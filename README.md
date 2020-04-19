# Oddish GitHub Action

## How it works

`oddish` will:

    Publish in @latest on semver tags, only if the new version is greater to the latest published.
    Publish in @tag-[GIT_TAG] on non-semver tags.
    Publish in @rc all relase candidates (extracted from the tag).
    Publish in @next every master build.

This publishing method ignores completely the `version` field in package.json files, it publishes based on branches, tags and published versions.

## Usage

Add `oddish-action` to the workflow for your NPM package. The below example will publish your application on pushes to the `master` branch:

```yaml
name: Deploy

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@master

      - run: npm run build

      - name: Publish
        uses: menduz/oddish-action@2.0.0
        with:
          ### Working directory to publish
          # cwd: "./packages/package-a"

          ### Optional registry to set up for auth. Will set the registry in a
          ### project level .npmrc and .yarnrc file, and set up auth to read in
          ### from env.NODE_AUTH_TOKEN
          # registry-url: "https://registry.npmjs.org"

          ### Optional scope for authenticating against scoped registries
          # scope: arduz

          ### Set always-auth in npmrc
          # always-auth: true
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```
