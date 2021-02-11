#!/usr/bin/env node

// tslint:disable:no-console

import core = require("@actions/core");
import github = require("@actions/github");

import { exec } from "child_process";
import fetch from "node-fetch";
import semver = require("semver");
import git = require("git-rev-sync");
import fs = require("fs");
import os = require("os");
import { execSync } from "child_process";
import { resolve } from "path";

const commitHash = execSync("git rev-parse HEAD").toString().trim();

async function setCommitHash() {
  const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
  packageJson.commit = commitHash;
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
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
    const curContents: string = fs.readFileSync(fileLocation, "utf8");
    curContents.split(os.EOL).forEach((line: string) => {
      // Add current contents unless they are setting the registry
      if (!line.toLowerCase().startsWith("registry")) {
        newContents += line + os.EOL;
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

async function publish(npmTags: string[], workingDirectory: string): Promise<string> {
  core.setOutput("tags", npmTags.join(","));

  const args: string[] = [];

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
  const json = JSON.parse(fs.readFileSync(workingDirectory + "/package.json", "utf8"));

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

  return value + "-" + time + ".commit-" + commit;
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

  let gitTag: string | null = null;

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

  console.log(`  package.json#version: ${await getVersion(workingDirectory)}`);
  console.log(`  publishing:`);
  console.log(`    version: ${newVersion}`);
  console.log(`    tag: ${npmTag || "ci"}\n`);

  if (!gitTag) {
    if (branch === "master" || branch == "main") {
      npmTag = "next";
    } else {
      core.info(
        `! canceling automatic npm publish. It can only be made in main/master branches or tags`
      );
      process.exit(0);
    }
  }

  const tags = await getReleaseTags(workingDirectory, registryUrl);

  if (npmTag && npmTag in tags) {
    if (semver.gte(tags[npmTag], newVersion)) {
      core.error(
        `! This version will be not published as "${npmTag}" because a newer version is set. Publishing as "ci"\n`
      );
      npmTag = null;
    }
  }

  await setCommitHash();
  await setVersion(newVersion, workingDirectory);

  if (npmTag) {
    await publish([npmTag], workingDirectory);
  } else {
    await publish(["ci"], workingDirectory);
  }

  if (linkLatest) {
    try {
      if (!tags.latest || semver.gte(newVersion, tags.latest)) {
        const pkgName = (await execute(`npm info . name`, workingDirectory)).trim();
        await execute(`npm dist-tag add ${pkgName}@${newVersion} latest`, workingDirectory);
        console.log(`  publishing:\n    version: ${newVersion}`);
        core.setOutput("latest", "true");
      } else {
        core.setOutput("latest", "false");
      }
    } catch (e) {
      core.error(e);
    }
  } else {
    core.setOutput("latest", "false");
  }

  await execute(`npm info . dist-tags --json`, workingDirectory);
};

run().catch((e) => {
  core.setFailed(e.message);
  core.error(e);
  process.exit(1);
});
