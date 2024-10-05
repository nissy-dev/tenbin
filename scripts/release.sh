#!/usr/bin/env bash
# -u: Fail on when existing unset variables
# -e -o pipefail: Fail on when happening command errors
set -ueo pipefail

# Release packages
for PKG in packages/* ; do
  if [[ $PKG == "packages/core" ]] ; then
    continue
  fi
  pushd $PKG
  echo "Publishing $PKG...."
  cp ../../LICENSE .
  pnpm publish --access public --no-git-checks
  popd > /dev/null
done
