# Oddish GitHub Action

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
