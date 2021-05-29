#!/usr/bin/env node
const { build } = require("estrella")
build({
  entry: "oddish.ts",
  outfile: "dist/index.js",
  platform: 'node',
  bundle: true,
  debug: true,
})