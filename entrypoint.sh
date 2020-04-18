#!/bin/sh

set -e

export HOME="/github/workspace"
export NVM_DIR="/github/workspace/nvm"
export WRANGLER_HOME="/github/workspace"

# h/t https://github.com/elgohr/Publish-Docker-Github-Action
sanitize() {
  if [ -z "${1}" ]
  then
    >&2 echo "Unable to find ${2}. Did you add a GitHub secret called key ${2}, and pass in secrets.${2} in your workflow?"
    exit 1
  fi
}

sanitize "${INPUT_APITOKEN}" "npmToken"

echo "//registry.npmjs.org/:_authToken=$INPUT_APITOKEN" > ~/.npmrc

npm install

node oddish.js

