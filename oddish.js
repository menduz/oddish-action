#!/usr/bin/env node
"use strict";
// tslint:disable:no-console
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const child_process_1 = require("child_process");
const node_fetch_1 = __importDefault(require("node-fetch"));
const semver = require("semver");
const git = require("git-rev-sync");
const fs = require("fs");
const child_process_2 = require("child_process");
const commitHash = child_process_2.execSync("git rev-parse HEAD").toString().trim();
function setCommitHash() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
        packageJson.commit = commitHash;
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
    });
}
const time = new Date()
    .toISOString()
    .replace(/(\..*$)/g, "")
    .replace(/([^\dT])/g, "")
    .replace("T", "");
console.log(`> oddish`);
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
function execute(command) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((onSuccess, onError) => {
            console.log(`> ${command}`);
            child_process_1.exec(command, (error, stdout, stderr) => {
                stdout.trim().length && console.log("  " + stdout.replace(/\n/g, "\n  "));
                stderr.trim().length &&
                    console.error("! " + stderr.replace(/\n/g, "\n  "));
                if (error) {
                    onError(stderr);
                }
                else {
                    onSuccess(stdout);
                }
            });
        });
    });
}
function getBranch() {
    return __awaiter(this, void 0, void 0, function* () {
        return git.branch();
    });
}
function setVersion(newVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        core.setOutput("version", newVersion);
        return execute(`npm version "${newVersion}" --force --no-git-tag-version --allow-same-version`);
    });
}
function publish(npmTag = []) {
    return __awaiter(this, void 0, void 0, function* () {
        core.setOutput("tags", npmTag.join(","));
        return execute(`npm publish` + npmTag.map(($) => ' "--tag=' + $ + '"').join(""));
    });
}
function getVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const json = JSON.parse(fs.readFileSync("package.json", "utf8"));
        const pkgJsonVersion = json.version;
        const version = semver.parse(pkgJsonVersion.trim());
        if (!version) {
            throw new Error("Unable to parse semver from " + pkgJsonVersion);
        }
        return `${version.major}.${version.minor}.${version.patch}`;
    });
}
function snapshotize(value) {
    const commit = git.short();
    if (!commit) {
        throw new Error("Unable to get git commit");
    }
    return value + "-" + time + ".commit-" + commit;
}
function getSnapshotVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        let nextVersion = snapshotize(yield getVersion());
        const versions = yield getReleaseTags();
        console.log("  published versions: " + JSON.stringify(versions));
        if (versions.latest && semver.lt(nextVersion, versions.latest)) {
            console.log(`! @latest(${versions.latest}) > ${nextVersion}. Incrementing patch.`);
            nextVersion = snapshotize(semver.inc(versions.latest, "patch"));
        }
        if (versions.next && semver.lt(nextVersion, versions.next)) {
            console.log(`! @next(${versions.latest}) > ${nextVersion}. Incrementing patch.`);
            nextVersion = snapshotize(semver.inc(versions.next, "patch"));
        }
        return nextVersion;
    });
}
function getReleaseTags() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const json = JSON.parse(fs.readFileSync("package.json", "utf8"));
            const versions = yield node_fetch_1.default(`https://registry.npmjs.org/-/package/${json.name}/dist-tags`);
            if (versions.ok) {
                return yield versions.json();
            }
            else {
                return {};
            }
        }
        catch (_a) {
            return {};
        }
    });
}
console.log(`  pwd: ${process.cwd()}`);
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const npmToken = core.getInput("npmToken");
    if (!npmToken) {
        throw new Error("Missing data.npmToken in oddish-action configuration");
    }
    fs.writeFileSync("~/.npmrc", `//registry.npmjs.org/:_authToken=${npmToken}`);
    let branch = process.env.CIRCLE_BRANCH ||
        process.env.BRANCH_NAME ||
        process.env.TRAVIS_BRANCH ||
        (yield getBranch());
    let npmTag = null;
    let gitTag = null;
    if (github.context.ref.startsWith("refs/tags/")) {
        gitTag = github.context.ref.replace(/^refs\/tags\//, "");
    }
    let newVersion = null;
    let linkLatest = false;
    console.log(`  cwd: ${process.cwd()}`);
    console.log(`  branch: ${branch}`);
    console.log(`  gitTag: ${gitTag}`);
    console.log(`  commit: ${commitHash}`);
    // Travis keeps the branch name in the tags' builds
    if (gitTag) {
        const prerelease = semver.prerelease(gitTag);
        if (semver.valid(gitTag)) {
            if (semver.coerce(gitTag).version === gitTag) {
                // Contains no prerelease data and should go to latest
                npmTag = "latest";
                linkLatest = true;
                newVersion = gitTag;
            }
            else if (prerelease && prerelease.includes("rc")) {
                // Release candidate
                npmTag = "rc";
                newVersion = gitTag;
            }
            else if (prerelease && prerelease.includes("er")) {
                // Explorer release
                npmTag = "er";
                newVersion = gitTag;
            }
            else {
                npmTag = "tag-" + gitTag;
                newVersion = yield getSnapshotVersion();
            }
        }
        else {
            console.log(`invalid semver version: ${gitTag}`);
            npmTag = "tag-" + gitTag;
            newVersion = yield getSnapshotVersion();
        }
    }
    else {
        newVersion = yield getSnapshotVersion();
    }
    console.log(`  package.json#version: ${yield getVersion()}`);
    console.log(`  publishing:\n    version: ${newVersion}`);
    console.log(`    tag: ${npmTag || "ci"}\n`);
    if (!gitTag) {
        if (branch === "master") {
            npmTag = "next";
        }
        else {
            console.log(`! canceling automatic npm publish. It can only be made in master branches or tags`);
            process.exit(0);
        }
    }
    const tags = yield getReleaseTags();
    if (npmTag && npmTag in tags) {
        if (semver.gte(tags[npmTag], newVersion)) {
            console.log(`! This version will be not published as "${npmTag}" because a newer version is set. Publishing as "ci"\n`);
            npmTag = null;
        }
    }
    yield setCommitHash();
    yield setVersion(newVersion);
    if (npmTag) {
        yield publish([npmTag]);
    }
    else {
        yield publish(["ci"]);
    }
    if (linkLatest) {
        try {
            if (!tags.latest || semver.gte(newVersion, tags.latest)) {
                const pkgName = (yield execute(`npm info . name`)).trim();
                yield execute(`npm dist-tag add ${pkgName}@${newVersion} latest`);
                core.setOutput("latest", "true");
            }
            else {
                core.setOutput("latest", "false");
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        core.setOutput("latest", "false");
    }
    yield execute(`npm info . dist-tags --json`);
});
run().catch((e) => {
    core.setFailed(e.message);
    console.error("Error:");
    console.error(e);
    process.exit(1);
});
