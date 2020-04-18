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

function configAuthentication(registryUrl: string, alwaysAuth: string) {
  const npmrc: string = resolve(
    process.env["RUNNER_TEMP"] || process.cwd(),
    ".npmrc"
  );

  if (!registryUrl.endsWith("/")) {
    registryUrl += "/";
  }

  writeRegistryToFile(registryUrl, npmrc, alwaysAuth);
}

function writeRegistryToFile(
  registryUrl: string,
  fileLocation: string,
  alwaysAuth: string
) {
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

async function execute(command: string): Promise<string> {
  return new Promise<string>((onSuccess, onError) => {
    console.log(`> ${command}`);
    exec(command, (error, stdout, stderr) => {
      stdout.trim().length && console.log("  " + stdout.replace(/\n/g, "\n  "));
      stderr.trim().length &&
        console.error("! " + stderr.replace(/\n/g, "\n  "));

      if (error) {
        onError(stderr);
      } else {
        onSuccess(stdout);
      }
    });
  });
}

async function getBranch(): Promise<string> {
  return git.branch(process.cwd()) as any;
}

async function setVersion(newVersion: string): Promise<string> {
  core.setOutput("version", newVersion);
  return execute(
    `npm version "${newVersion}" --force --no-git-tag-version --allow-same-version`
  );
}

async function publish(npmTag: string[] = []): Promise<string> {
  core.setOutput("tags", npmTag.join(","));
  return execute(
    `npm publish` + npmTag.map(($) => ' "--tag=' + $ + '"').join("")
  );
}

async function getVersion() {
  const json = JSON.parse(fs.readFileSync("package.json", "utf8"));

  const pkgJsonVersion = json.version;

  const version = semver.parse(pkgJsonVersion.trim());

  if (!version) {
    throw new Error("Unable to parse semver from " + pkgJsonVersion);
  }

  return `${version.major}.${version.minor}.${version.patch}`;
}

function snapshotize(value: string) {
  const commit = git.short(process.cwd());

  if (!commit) {
    throw new Error("Unable to get git commit");
  }

  return value + "-" + time + ".commit-" + commit;
}

async function getSnapshotVersion() {
  let nextVersion = snapshotize(await getVersion());

  const versions = await getReleaseTags();

  console.log("  published versions: " + JSON.stringify(versions));

  if (versions.latest && semver.lt(nextVersion, versions.latest)) {
    console.log(
      `! @latest(${versions.latest}) > ${nextVersion}. Incrementing patch.`
    );
    nextVersion = snapshotize(semver.inc(versions.latest, "patch") as string);
  }

  if (versions.next && semver.lt(nextVersion, versions.next)) {
    console.log(
      `! @next(${versions.latest}) > ${nextVersion}. Incrementing patch.`
    );
    nextVersion = snapshotize(semver.inc(versions.next, "patch") as string);
  }

  return nextVersion;
}

async function getReleaseTags() {
  try {
    const json = JSON.parse(fs.readFileSync("package.json", "utf8"));

    const versions = await fetch(
      `https://registry.npmjs.org/-/package/${json.name}/dist-tags`
    );

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
  const registryUrl: string = core.getInput("registry-url");
  const alwaysAuth: string = core.getInput("always-auth") || "false";

  if (!process.env.NODE_AUTH_TOKEN) {
    console.log(`! warn: variable NODE_AUTH_TOKEN is not set`);
  }

  if (process.env.NODE_AUTH_TOKEN || registryUrl) {
    configAuthentication(registryUrl, alwaysAuth);
  }

  let branch =
    process.env.CIRCLE_BRANCH ||
    process.env.BRANCH_NAME ||
    process.env.TRAVIS_BRANCH ||
    (await getBranch());

  let npmTag: string | null = null;

  let gitTag: string | null = null;

  if (github.context.ref.startsWith("refs/tags/")) {
    gitTag = github.context.ref.replace(/^refs\/tags\//, "");
  }

  let newVersion: string | null = null;

  let linkLatest = false;

  console.log(`  cwd: ${process.cwd()}`);
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
      } else if (prerelease && prerelease.includes("er")) {
        // Explorer release
        npmTag = "er";
        newVersion = gitTag;
      } else {
        npmTag = "tag-" + gitTag;
        newVersion = await getSnapshotVersion();
      }
    } else {
      console.log(`invalid semver version: ${gitTag}`);
      npmTag = "tag-" + gitTag;
      newVersion = await getSnapshotVersion();
    }
  } else {
    newVersion = await getSnapshotVersion();
  }

  console.log(`  package.json#version: ${await getVersion()}`);
  console.log(`  publishing:\n    version: ${newVersion}`);
  console.log(`    tag: ${npmTag || "ci"}\n`);

  if (!gitTag) {
    if (branch === "master") {
      npmTag = "next";
    } else {
      console.log(
        `! canceling automatic npm publish. It can only be made in master branches or tags`
      );
      process.exit(0);
    }
  }

  const tags = await getReleaseTags();

  if (npmTag && npmTag in tags) {
    if (semver.gte(tags[npmTag], newVersion)) {
      console.log(
        `! This version will be not published as "${npmTag}" because a newer version is set. Publishing as "ci"\n`
      );
      npmTag = null;
    }
  }

  await setCommitHash();
  await setVersion(newVersion);

  if (npmTag) {
    await publish([npmTag]);
  } else {
    await publish(["ci"]);
  }

  if (linkLatest) {
    try {
      if (!tags.latest || semver.gte(newVersion, tags.latest)) {
        const pkgName = (await execute(`npm info . name`)).trim();
        await execute(`npm dist-tag add ${pkgName}@${newVersion} latest`);
        core.setOutput("latest", "true");
      } else {
        core.setOutput("latest", "false");
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    core.setOutput("latest", "false");
  }

  await execute(`npm info . dist-tags --json`);
};

run().catch((e) => {
  core.setFailed(e.message);
  console.error("Error:");
  console.error(e);
  process.exit(1);
});
