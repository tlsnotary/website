#!/usr/bin/env bash
# Regenerate all SVG diagrams for the Proxy mode blog post.
# Reads metrics_native.csv and metrics_browser.csv, writes
# {bandwidth,latency,download}_{light,dark}.svg alongside this script.
# Idempotent.
set -euo pipefail

cd "$(dirname "$0")"

NOTEBOOKS=(bandwidth.ipynb latency.ipynb download.ipynb)

nix-shell \
    -p python3Packages.pandas \
    -p python3Packages.matplotlib \
    -p python3Packages.jupyter \
    --run "for nb in ${NOTEBOOKS[*]}; do jupyter nbconvert --to notebook --execute \$nb --output \$nb; done"

echo "Generated:"
ls -1 *.svg
