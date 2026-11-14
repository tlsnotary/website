# Data and notebooks — beta.1 performance

Raw CSVs, notebooks, and chart-generation code for
beta.1 Performance Improvements (`../index.md`).

## Builds compared

| Series | Build | Commit |
|---|---|---|
| MPC baseline | `v0.1.0-alpha.15` | `47aee45b53e06648c1b2ad3689b367b8c923fdec` |
| MPC beta.1 | mpz2 integration tree (content-equivalent to beta.1) | `79ca533fa` / run tree `34d7c638b`, `mpz-ot` `6a1864d` |
| Proxy baseline | previous proxy tip | `f47cca06e` |
| Proxy beta.1 | `mpz` `v0.1.0-beta.1` + GHASH fix | `ca12b4a9847fa9e7063caafc49ec356203fc35a6` |

## Runs

| Series | Date | Mode | Samples |
|---|---|---|---|
| MPC | 2026-11-12 | MPC (`proxy=false`) | 10 measured + 3 warmups |
| Proxy | 2026-11-14 | Proxy (`proxy=true`) | 10 measured + 3 warmups |

All runs used the same Azure `Standard_F8als_v6` VM (8 vCPU / 16 GB),
AMD EPYC 9004 (Genoa), Debian 12, SMT disabled.

## File naming

- `mpc_<sweep>_<build>_<mode>.csv` — MPC sweeps. `build` is `alpha15` or
  `beta1`; `mode` is `native` or `browser` (WASM).
- `proxy_<sweep>_<build>_<mode>.csv` — proxy sweeps. `build` is `previous`
  (`f47cca06e`) or `beta1` (`ca12b4a98`).
- `<sweep>` is one of `default`, `bandwidth`, `latency`, `download`.
- `summary-mpc.*`, `summary-proxy-*.md`, and `traffic_decomposition.csv` are
  the pre-computed summary tables used to cross-check the notebooks.

## Bench parameters

| Sweep | Fixed | Varied |
|---|---|---|
| Default | 1 KB request, 2 KB response | Cable 20 Mbps / 20 ms, Fiber 100 Mbps / 15 ms, Mobile 5G 30 Mbps / 30 ms |
| Bandwidth | 25 ms latency, 1 KB request, 2 KB response | 5, 10, 20, 50, 100, 250, 500, 1000 Mbps |
| Latency | 100 Mbps, 1 KB request, 2 KB response | 10, 25, 50, 75, 100, 150, 200 ms |
| Download | 100 Mbps, 25 ms latency, 1 KB request | 1, 2, 5, 10, 20, 30, 40, 50 KB response |

## Notes

- The previous-tip proxy CSVs use an older harness header: the header row starts
  at `time_total`, while data rows contain all 18 columns. The notebooks parse
  those files by position.
- `time_preprocess`, `time_online`, and `time_total` are milliseconds. The
  notebooks divide by 1000 before plotting seconds.
- `uploaded_*` / `downloaded_*` count bytes on the prover↔verifier MPC channel,
  not the TLS request or response payload.
- MPC runs use deferred decryption. Proxy runs leave `app_latency` at its 50 ms
  default, so every proxy number includes a constant 50 ms application leg.
- The MPC byte counters are comparable between alpha.15 and beta.1; the header
  and counting code are unchanged. See `traffic_decomposition.csv`.

## Reproduce

The notebooks are self-contained. From this directory:

```bash
jupyter nbconvert --to notebook --execute --inplace bandwidth.ipynb latency.ipynb download.ipynb
```

Each notebook reads the CSVs in this directory, redraws the light and dark SVG
next to it, and prints the summary table used in the post.
