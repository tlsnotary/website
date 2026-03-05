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

SOURCE="$SOURCE_DIR/diagrams.drawio"

# Extract page names from uncompressed XML
TMPFILE=$(mktemp)
"$DRAW_IO" --export --format xml --no-sandbox --uncompressed -o "$TMPFILE" "$SOURCE" 2>/dev/null

# Read page names into an array
mapfile -t PAGES < <(grep -oP '<diagram[^>]*name="\K[^"]*' "$TMPFILE")
rm "$TMPFILE"

for i in "${!PAGES[@]}"; do
    name="${PAGES[$i]}"
    page_num=$((i + 1))
    for theme in "dark" "light"; do
        TARGET="${TARGET_DIR}/${theme}/${name}.${FORMAT}"
        # Only convert if the source is more recent than the target
        if [[ "$SOURCE" -nt "${TARGET}" ]]; then
            echo "Exporting page $page_num ($name) -> $theme/$name.$FORMAT"
            "$DRAW_IO" --export --format ${FORMAT} --scale 2.5 --svg-theme "${theme}" --no-sandbox --page-index "$page_num" -o "${TARGET}" "$SOURCE"
            # Remove DOCTYPE to prevent SVGO entity count errors during build
            sed -i '/<!DOCTYPE/d' "${TARGET}"
            # Fix embedded SVG icons for dark theme: draw.io can't resolve
            # currentColor inside base64-encoded SVG images, so we replace
            # it with an explicit color after export.
            if [[ "$theme" == "dark" ]]; then
                node -e '
                    const fs = require("fs");
                    const file = process.argv[1];
                    let svg = fs.readFileSync(file, "utf8");
                    svg = svg.replace(/xlink:href="data:image\/svg\+xml;base64,([^"]+)"/g, (m, b64) => {
                        const dec = Buffer.from(b64, "base64").toString("utf8");
                        let fixed = dec.replace(/currentColor/g, "#ffffff");
                        if (fixed === dec) return m;
                        return "xlink:href=\"data:image/svg+xml;base64," + Buffer.from(fixed).toString("base64") + "\"";
                    });
                    fs.writeFileSync(file, svg);
                ' "${TARGET}"
            fi
        fi
    done
done
