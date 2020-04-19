# Oddish GitHub Action

## How it works

`oddish` will:

    Publish in @latest on semver tags, only if the new version is greater to the latest published.
    Publish in @tag-[GIT_TAG] on non-semver tags.
    Publish in @rc all relase candidates (extracted from the tag).
    Publish in @next every master build.

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
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```
