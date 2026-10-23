#!/bin/sh
set -eu

# File-vendored renderer builds do not need a private registry token.
# Keep accepting the existing BuildKit secret for registry-backed dependencies.
token=""
if [ -r /run/secrets/NODE_AUTH_TOKEN ]; then
  token=$(tr -d '[:space:]' < /run/secrets/NODE_AUTH_TOKEN)
fi
if [ -z "$token" ]; then
  pnpm install --frozen-lockfile
  exit 0
fi

npmrc_backup=$(mktemp)
cp .npmrc "$npmrc_backup"
restore_npmrc() {
  mv "$npmrc_backup" .npmrc
}
trap restore_npmrc EXIT

printf '%s\n' \
  '@eternal-encoders:registry=https://npm.pkg.github.com' \
  "//npm.pkg.github.com/:_authToken=${token}" \
  '//npm.pkg.github.com/:always-auth=true' \
  > .npmrc

pnpm install --frozen-lockfile
