#!/usr/bin/env node

// tslint:disable:no-console

import core = require("@actions/core");
import io = require("@actions/io");
import { DefaultArtifactClient } from "@actions/artifact";
import github = require("@actions/github");
import { exec } from "child_process";
import FormData from "form-data";
import { S3 } from "@aws-sdk/client-s3";
import fetch from "node-fetch";
import semver = require("semver");
import git = require("git-rev-sync");
import fs = require("fs");
import os = require("os");
import { execSync } from "child_process";
import { basename, resolve } from "path";

const cleanupSteps: Array<() => Promise<any>> = [];

const commitHash = execSync("git rev-parse HEAD").toString().trim();

function readPackageJson(workingDirectory: string) {
  return JSON.parse(fs.readFileSync(workingDirectory + "/package.json", "utf8").toString());
}

async function setCommitHash(workingDirectory: string) {
  const packageJson = readPackageJson(workingDirectory);
  packageJson.commit = commitHash;
  fs.writeFileSync(workingDirectory + "/package.json", JSON.stringify(packageJson, null, 2));
}

async function triggerPipeline(data: {
  packageName: string;
  packageTag: string;
  packageVersion: string;
  registryUrl: string;
}) {
  const GITLAB_STATIC_PIPELINE_TOKEN = core.getInput("gitlab-token", { required: false });
  const GITLAB_STATIC_PIPELINE_URL = core.getInput("gitlab-pipeline-url", { required: false });

  if (!GITLAB_STATIC_PIPELINE_URL) return;
  if (!data.packageName) throw new Error("packageName is missing");

  await core.group("Triggering external pipeline", async () => {
    const body = new FormData();
    if (GITLAB_STATIC_PIPELINE_TOKEN) {
      body.append("token", GITLAB_STATIC_PIPELINE_TOKEN);
    } else {
      core.warning("MISSING gitlab-pipeline-url");
    }
    body.append("ref", "master");
    body.append("variables[PACKAGE_NAME]", data.packageName);
    body.append("variables[PACKAGE_DIST_TAG]", data.packageTag);
    body.append("variables[PACKAGE_VERSION]", data.packageVersion);
    body.append("variables[REGISTRY_URL]", data.registryUrl);
    body.append("variables[REPO]", github.context.repo.repo);
    body.append("variables[REPO_OWNER]", github.context.repo.owner);
    body.append("variables[COMMIT]", commitHash);

    try {
      const r = await fetch(GITLAB_STATIC_PIPELINE_URL, {
        body,
        method: "POST",
      });

      if (r.ok) {
        core.info(`Status: ${r.status}`);
      } else {
        core.setFailed(`Error triggering pipeline. status: ${r.status}`);
      }
    } catch (e) {
      core.setFailed(`Error triggering pipeline. Unhandled error.`);
    }
  });
}

async function uploadTarToS3(localFile: string) {
  const BUCKET = core.getInput("s3-bucket", { required: false });
  const REGION = core.getInput("s3-bucket-region", { required: false });
  const BUCKET_KEY_PREFIX = core.getInput("s3-bucket-key-prefix", { required: false }) || "";

  if (!BUCKET || !REGION) return;

  const s3 = new S3({ region: REGION });

  const key = (BUCKET_KEY_PREFIX + "/").replace(/^(\/)+/, "") + basename(localFile);
  core.info(`Uploading ${localFile} to ${key}`);

  await s3.putObject({
    Bucket: BUCKET,
    Key: key,
    Body: fs.createReadStream(localFile),
    ContentType: "application/tar",
    ACL: "public-read",
    CacheControl: "max-age=0,private",
  });

  core.setOutput("s3-bucket-key", key);
}

async function createArtifacts(workingDirectory: string) {
  await core.group("Creating static artifact", async () => {
    try {
      const packDetails: { filename: string }[] = JSON.parse(
        await execute(`npm pack --json`, workingDirectory)
      );

      for (let file of packDetails) {
        // This is workaround of a NPM bug which returns wrong filename
        const filename = file.filename.replace(/^@/, "").replace(/\//, "-");
        const localFile = workingDirectory + "/" + filename;

        // Assuming the current working directory is /home/user/files/plz-upload
        const artifact = new DefaultArtifactClient();

        await artifact.uploadArtifact(filename, [localFile], workingDirectory);

        await uploadTarToS3(localFile);
        await io.rmRF(localFile);
      }
    } catch (e: any) {
      core.error(e);
    }
  });
}

const time = new Date()
  .toISOString()
  .replace(/(\..*$)/g, "")
  .replace(/([^\dT])/g, "")
  .replace("T", "");

console.log(`> oddish`);

function configAuthentication(registryUrl: string, alwaysAuth: string, workingDirectory: string) {
  const npmrc: string = resolve(process.env["RUNNER_TEMP"] || workingDirectory, ".npmrc");

  if (!registryUrl.endsWith("/")) {
    registryUrl += "/";
  }

  writeRegistryToFile(registryUrl, npmrc, alwaysAuth);
}

function writeRegistryToFile(registryUrl: string, fileLocation: string, alwaysAuth: string) {
  let scope: string = core.getInput("scope");
  if (!scope && registryUrl.indexOf("npm.pkg.github.com") > -1) {
    scope = github.context.repo.owner;
  }
  if (scope && scope[0] != "@") {
    scope = "@" + scope;
  }
  if (scope) {
    scope = scope.toLowerCase();
  }

  core.debug(`Setting auth in ${fileLocation}`);
  let newContents: string = "";
  if (fs.existsSync(fileLocation)) {
    const curContents = fs.readFileSync(fileLocation, "utf8");
    curContents.split(os.EOL).forEach((line: string) => {
      // Add current contents unless they are setting the registry
      if (!line.toLowerCase().startsWith("registry")) {
        newContents += line + os.EOL;
      }
    });

    cleanupSteps.push(async () => {
      fs.writeFileSync(fileLocation, curContents);
    });
  } else {
    cleanupSteps.push(async () => {
      if (fs.existsSync(fileLocation)) {
        await io.rmRF(fileLocation);
      }
    });
  }

  // Remove http: or https: from front of registry.
  const authString: string =
    registryUrl.replace(/(^\w+:|^)/, "") + ":_authToken=${NODE_AUTH_TOKEN}";
  const registryString: string = scope
    ? `${scope}:registry=${registryUrl}`
    : `registry=${registryUrl}`;
  const alwaysAuthString: string = `always-auth=${alwaysAuth}`;
  newContents += `${authString}${os.EOL}${registryString}${os.EOL}${alwaysAuthString}`;
  console.log(`  writing: ${fileLocation}`);
  fs.writeFileSync(fileLocation, newContents);
  core.exportVariable("NPM_CONFIG_USERCONFIG", fileLocation);
  // Export empty node_auth_token so npm doesn't complain about not being able to find it
  if (!process.env.NODE_AUTH_TOKEN) {
    core.exportVariable("NODE_AUTH_TOKEN", "XXXXX-XXXXX-XXXXX-XXXXX");
  }
}

/**
 * Use cases
 *
 *  If no version is published, pick the version from the package.json and publish that version
 *
 *  If a version is published and the minor and major matches the package.json, publish a patch
 *
 *  If the packaje.json version minor and major differs from the published version, pick the latest published patch for the version of the package.json and increment the patch number
 *
 */

async function execute(command: string, workingDirectory: string): Promise<string> {
  return core.group(
    `${command}`,
    () =>
      new Promise<string>((onSuccess, onError) => {
        exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
          stdout.trim().length && console.log("stdout:\n" + stdout.replace(/\n/g, "\n  "));
          stderr.trim().length && console.error("stderr:\n" + stderr.replace(/\n/g, "\n  "));

          if (error) {
            onError(stderr);
          } else {
            onSuccess(stdout);
          }
        });
      })
  );
}

async function getBranch(workingDirectory: string): Promise<string> {
  return git.branch(workingDirectory) as any;
}

async function setVersion(newVersion: string, workingDirectory: string): Promise<string> {
  core.setOutput("version", newVersion);
  return execute(
    `npm version "${newVersion}" --force --no-git-tag-version --allow-same-version`,
    workingDirectory
  );
}

async function publish(
  npmTags: string[],
  workingDirectory: string,
  provenance: boolean
): Promise<string> {
  core.setOutput("tags", npmTags.join(","));

  const args: string[] = [];

  if (provenance) args.push("--provenance");

  const access = core.getInput("access", { required: false });

  if (access) {
    args.push("--access", access);
  }

  for (let tag of npmTags) {
    args.push("--tag", JSON.stringify(tag));
  }

  return execute(`npm publish ` + args.join(" "), workingDirectory);
}

async function getVersion(workingDirectory: string) {
  const json = readPackageJson(workingDirectory);

  let pkgJsonVersion = json.version;
  if (!pkgJsonVersion) pkgJsonVersion = "0.0.0";

  const version = semver.parse(pkgJsonVersion.trim());

  if (!version) {
    throw new Error("Unable to parse semver from " + pkgJsonVersion);
  }

  return `${version.major}.${version.minor}.${version.patch}`;
}

function snapshotize(value: string, workingDirectory: string) {
  const commit = git.short(workingDirectory);

  if (!commit) {
    throw new Error("Unable to get git commit");
  }

  if (core.getInput("deterministic-snapshot") && core.getBooleanInput("deterministic-snapshot")) {
    return value + "-" + github.context.runId + ".commit-" + commit;
  } else {
    return value + "-" + time + ".commit-" + commit;
  }
}

async function getSnapshotVersion(workingDirectory: string, registryUrl: string) {
  let nextVersion = snapshotize(await getVersion(workingDirectory), workingDirectory);

  const versions = await getReleaseTags(workingDirectory, registryUrl);

  core.info("  published versions: " + JSON.stringify(versions));

  if (versions.latest && semver.lt(nextVersion, versions.latest)) {
    core.info(`! @latest(${versions.latest}) > ${nextVersion}. Incrementing patch.`);
    nextVersion = snapshotize(semver.inc(versions.latest, "patch") as string, workingDirectory);
  }

  if (versions.next && semver.lt(nextVersion, versions.next)) {
    core.info(`! @next(${versions.latest}) > ${nextVersion}. Incrementing patch.`);
    nextVersion = snapshotize(semver.inc(versions.next, "patch") as string, workingDirectory);
  }

  return nextVersion;
}

async function getReleaseTags(workingDirectory: string, registry: string) {
  try {
    const json = JSON.parse(fs.readFileSync(workingDirectory + "/package.json", "utf8"));

    const versions = await fetch(`${registry}/-/package/${json.name}/dist-tags`);

    if (versions.ok) {
      return await versions.json();
    } else {
      return {};
    }
  } catch {
    return {};
  }
}

const run = async () => {
  const registryUrl: string = core.getInput("registry-url") || "https://registry.npmjs.org";

  let workingDirectory: string = resolve(core.getInput("cwd") || process.cwd());

  if (workingDirectory.endsWith("/")) {
    workingDirectory.replace(/\/+$/, "");
  }

  const alwaysAuth: string = core.getInput("always-auth") || "false";
  const mainBranchLatestTag: boolean = core.getBooleanInput("main-branch-latest-tag");

  if (!process.env.NODE_AUTH_TOKEN) {
    core.warning(`! warn: variable NODE_AUTH_TOKEN is not set`);
  }

  if (process.env.NODE_AUTH_TOKEN || registryUrl) {
    configAuthentication(registryUrl, alwaysAuth, workingDirectory);
  }

  let branch =
    process.env.CIRCLE_BRANCH ||
    process.env.BRANCH_NAME ||
    process.env.TRAVIS_BRANCH ||
    (await getBranch(workingDirectory));

  let npmTag: string | null = null;

  let gitTag: string | null = process.env.GIT_TAG || null;

  if (github.context.ref.startsWith("refs/tags/")) {
    gitTag = github.context.ref.replace(/^refs\/tags\//, "");
  }

  let newVersion: string | null = null;

  let linkLatest = false;

  console.log(`  registry: ${registryUrl}`);
  console.log(`  cwd: ${workingDirectory}`);
  console.log(`  branch: ${branch}`);
  console.log(`  gitTag: ${gitTag}`);
  console.log(`  commit: ${commitHash}`);

  // Travis keeps the branch name in the tags' builds
  if (gitTag) {
    const prerelease = semver.prerelease(gitTag);

    if (semver.valid(gitTag)) {
      if (semver.coerce(gitTag)!.version === gitTag) {
        // Contains no prerelease data and should go to latest
        npmTag = "latest";
        linkLatest = true;
        newVersion = gitTag;
      } else if (prerelease && prerelease.includes("rc")) {
        // Release candidate
        npmTag = "rc";
        newVersion = gitTag;
      } else {
        npmTag = "tag-" + gitTag;
        newVersion = await getSnapshotVersion(workingDirectory, registryUrl);
      }
    } else {
      core.warning(`invalid semver version: ${gitTag}`);
      npmTag = "tag-" + gitTag;
      newVersion = await getSnapshotVersion(workingDirectory, registryUrl);
    }
  } else {
    newVersion = await getSnapshotVersion(workingDirectory, registryUrl);
  }
  const packageName = readPackageJson(workingDirectory).name;
  console.log(`  package.json#name: ${packageName}`);
  console.log(`  package.json#version: ${await getVersion(workingDirectory)}`);
  console.log(`  publishing:`);
  console.log(`    version: ${newVersion}`);

  await setCommitHash(workingDirectory);
  await setVersion(newVersion, workingDirectory);

  // skip publishing
  if (core.getInput("only-update-versions") && core.getBooleanInput("only-update-versions")) {
    core.info("> Skipping publishing.");
    return;
  }

  await createArtifacts(workingDirectory);

  if (!gitTag) {
    const customTag = core.getInput("custom-tag");
    const branchToCustomTag = core.getInput("branch-to-custom-tag");

    if (branch === "master" || branch == "main") {
      if (mainBranchLatestTag) {
        npmTag = "latest";
        linkLatest = true;
      } else {
        npmTag = "next";
      }
    } else if (core.getInput("branch-to-next") === branch) {
      npmTag = "next";
    } else if (
      customTag &&
      branchToCustomTag === branch &&
      customTag !== "latest" &&
      customTag !== "next"
    ) {
      npmTag = customTag;
    } else {
      if (customTag) {
        core.info(
          `! canceling automatic npm publish. It can only be made in main/master branches, tags or by the branch ${branchToCustomTag} != ${branch}`
        );
      } else {
        core.info(
          `! canceling automatic npm publish. It can only be made in main/master branches or tags`
        );
      }
      process.exit(0);
    }
  }

  const tags = await getReleaseTags(workingDirectory, registryUrl);

  if (npmTag && npmTag in tags) {
    if (semver.gte(tags[npmTag], newVersion)) {
      core.error(
        `! This version will be not published as "${npmTag}" because a ${tags[npmTag]} (${npmTag}) > ${newVersion} (current version). Publishing as "ci"\n`
      );
      npmTag = null;
    }
  }

  console.log(`    mainBranchLatestTag: ${mainBranchLatestTag}\n`);
  console.log(`    tag: ${npmTag || "ci"}\n`);

  const provenance = core.getBooleanInput("provenance", { required: false });

  if (npmTag) {
    await publish([npmTag], workingDirectory, provenance);
  } else {
    await publish(["ci"], workingDirectory, provenance);
  }

  if (linkLatest) {
    try {
      if (!tags.latest || semver.gte(newVersion, tags.latest)) {
        await execute(`npm dist-tag add ${packageName}@${newVersion} latest`, workingDirectory);
        console.log(`  publishing:\n    version: ${newVersion}`);
        core.setOutput("latest", "true");
      } else {
        core.setOutput("latest", "false");
      }
    } catch (e: any) {
      core.error(e);
    }
  } else {
    core.setOutput("latest", "false");
  }

  await execute(`npm info . dist-tags --json`, workingDirectory);

  await triggerPipeline({
    packageName,
    packageVersion: newVersion,
    packageTag: linkLatest ? "latest" : npmTag || "ci",
    registryUrl,
  });
};

async function cleanup() {
  for (const step of cleanupSteps)
    try {
      await step();
    } catch (err: any) {
      core.error(err);
    }
}

run()
  .catch((e) => {
    core.setFailed(e.message);
    core.error(e);
    process.exit(1);
  })
  .finally(cleanup);
