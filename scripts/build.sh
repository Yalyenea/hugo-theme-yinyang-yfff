#!/usr/bin/env sh
set -eu

# Build the search index from the same HTML that will be deployed.
hugo --cleanDestinationDir --minify
npx -y pagefind@1.5.2 --site public
