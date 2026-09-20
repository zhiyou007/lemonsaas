#!/bin/sh
# Run the built app locally with .env loaded (DB expected on localhost:5432).
set -a
. "$(dirname "$0")/.env"
set +a
exec node .output/server/index.mjs
