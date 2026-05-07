#!/usr/bin/env bash
# Regenerate the SVG diagrams from download.ipynb.
# Requires nix. Executes the notebook in place and writes *_light.svg / *_dark.svg
# alongside this script.
set -euo pipefail

cd "$(dirname "$0")"

nix-shell \
    -p python3Packages.pandas \
    -p python3Packages.matplotlib \
    -p python3Packages.jupyter \
    --run "jupyter nbconvert --to notebook --execute download.ipynb --output download.ipynb"

echo "Generated:"
ls -1 *.svg
