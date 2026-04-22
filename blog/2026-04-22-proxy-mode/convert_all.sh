#!/bin/bash

FORMAT="svg"

SOURCE_DIR=$(dirname "$0")
TARGET_DIR=$(realpath "$(dirname "$0")/")

OS=$(uname)
case "$OS" in
"Darwin") # Mac
    DRAW_IO="/Applications/draw.io.app/Contents/MacOS/draw.io"
    ;;
"Linux") # Linux
    DRAW_IO="drawio"
    ;;
esac

# Unset Electron env vars that interfere with draw.io when running from VSCode
unset ELECTRON_RUN_AS_NODE ELECTRON_NO_ATTACH_CONSOLE

if ! command -v "$DRAW_IO" &>/dev/null; then
    echo "Error: draw.io executable not found. Please install draw.io and make sure it's in your PATH."
    exit 1
fi

for SOURCE in "$SOURCE_DIR"/*.drawio; do
    BASENAME=$(basename "$SOURCE" .drawio)

    for theme in "dark" "light"; do
        mkdir -p "${TARGET_DIR}/${theme}"
        TARGET="${TARGET_DIR}/${theme}/${BASENAME}.${FORMAT}"
        if [[ "$SOURCE" -nt "${TARGET}" ]]; then
            echo "Exporting ${BASENAME} -> $theme/${BASENAME}.$FORMAT"
            "$DRAW_IO" --export --format ${FORMAT} --scale 2.5 --svg-theme "${theme}" --no-sandbox -o "${TARGET}" "$SOURCE"
            # Remove DOCTYPE to prevent SVGO entity count errors during build
            sed -i '/<!DOCTYPE/d' "${TARGET}"
        fi
    done
done
