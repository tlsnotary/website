#!/usr/bin/env bash
# Run the native and browser benchmarks for the Proxy mode blog post.
#
# Designed to survive an SSH disconnect. Invocation:
#
#   cd /home/heeckhau/tlsnotary/tlsn/crates/harness
#   sudo -v                                # cache sudo creds first
#   nohup sudo blog-proxy-mode-draft/data/run-bench.sh \
#       > /tmp/proxy-bench.log 2>&1 &
#   disown
#
# Then monitor with:
#   tail -f /tmp/proxy-bench.log
#
# The script is restart-safe: if a CSV already exists and is non-empty,
# that target is skipped. To force a re-run, delete the corresponding CSV
# from blog-proxy-mode-draft/data/ first.

set -euo pipefail

# Resolve to crates/harness/ regardless of where the script is invoked from.
# Script lives at crates/harness/blog-proxy-mode-draft/data/run-bench.sh,
# so harness dir is two levels up from the script's directory.
HARNESS_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$HARNESS_DIR"

CONFIG="blog-proxy-mode-draft/data/bench_proxy_vs_mpc.toml"
NATIVE_CSV="blog-proxy-mode-draft/data/metrics_native_ibra.csv"
BROWSER_CSV="blog-proxy-mode-draft/data/metrics_browser_ibra.csv"

stamp() { date '+%Y-%m-%d %H:%M:%S'; }

echo "[$(stamp)] === proxy-mode bench run ==="
echo "[$(stamp)] harness dir : $HARNESS_DIR"
echo "[$(stamp)] config      : $CONFIG"
echo "[$(stamp)] running as  : $(id -un) (uid $(id -u))"

if [ "$(id -u)" -ne 0 ]; then
    echo "[$(stamp)] ERROR: must be invoked as root (the runner needs network namespaces)" >&2
    exit 1
fi

if [ ! -f "$CONFIG" ]; then
    echo "[$(stamp)] ERROR: config $CONFIG not found relative to $HARNESS_DIR" >&2
    exit 1
fi

# Network setup — idempotent; `info` exits 0 if already configured.
if ./bin/runner info >/dev/null 2>&1; then
    echo "[$(stamp)] network already set up"
else
    echo "[$(stamp)] setting up network..."
    ./bin/runner setup
fi

run_target() {
    local target="$1"
    local out="$2"
    local started ended
    if [ -s "$out" ]; then
        echo "[$(stamp)] skipping $target — $out already exists and is non-empty"
        return 0
    fi
    started=$(date +%s)
    echo "[$(stamp)] >>> starting $target bench, writing $out"
    if [ "$target" = "browser" ]; then
        ./bin/runner --target browser bench --config "$CONFIG" --output "$out"
    else
        ./bin/runner bench --config "$CONFIG" --output "$out"
    fi
    ended=$(date +%s)
    echo "[$(stamp)] <<< $target bench finished in $((ended - started)) s, $(wc -l <"$out") rows in $out"
}

run_target native  "$NATIVE_CSV"
run_target browser "$BROWSER_CSV"

echo "[$(stamp)] === all done ==="
