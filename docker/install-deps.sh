#!/bin/sh
set -eu

token=$(tr -d '[:space:]' < /run/secrets/NODE_AUTH_TOKEN)
if [ -z "$token" ]; then
  echo "NODE_AUTH_TOKEN build secret is empty. The publish workflow reads the PACKAGER repository secret." >&2
  exit 1
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
