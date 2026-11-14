---
slug: beta1-performance-next-steps
title: "Beta.1 performance and next steps"
authors: [dan]
tags: [benchmarks, performance]
date: 2026-11-14
image: https://github.com/themighty1.png
---

With the TLSNotary stack maturing and now being used across real-world deployments, we are pleased to announce the release of Beta 1 as we work toward general availability.

Here are the benchmarked performance improvements and some plans for the next release.

<!-- truncate -->

## TL;DR

On the same 1 KB request / 2 KB response workload:

- **MPC native:** **8.2–9.3% faster** than the previous release, alpha.15.
- **MPC browser (WASM):** **13.1–20.9% faster** than alpha.15.
- **Proxy native:** **21.0–24.3% faster** than the previous proxy benchmark ([May 2026 proxy-mode report](https://tlsnotary.org/blog/2026/05/10/blog-proxy-mode)).
- **Proxy browser (WASM):** **35.5–39.4% faster** than that benchmark.

The prioritized feature for the next release is **TLS 1.3 support**.

## Benchmark results

| | Cable | Fiber | Mobile 5G |
|---|---:|---:|---:|
| **MPC native** | 14.58 → **13.35 s** (**−8.4%**) | 3.74 → **3.43 s** (**−8.2%**) | 10.61 → **9.63 s** (**−9.3%**) |
| **MPC browser (WASM)** | 16.28 → **14.15 s** (**−13.1%**) | 5.27 → **4.17 s** (**−20.9%**) | 12.15 → **10.45 s** (**−13.9%**) |
| **Proxy native** | 1.72 → **1.30 s** (**−24.3%**) | 1.05 → **0.83 s** (**−21.1%**) | 1.63 → **1.29 s** (**−21.0%**) |
| **Proxy browser (WASM)** | 2.54 → **1.57 s** (**−38.0%**) | 1.85 → **1.12 s** (**−39.4%**) | 2.41 → **1.55 s** (**−35.5%**) |

*MPC: alpha.15 → beta.1. Proxy: previous proxy benchmark ([May 2026 proxy-mode report](https://tlsnotary.org/blog/2026/05/10/blog-proxy-mode)) → beta.1. Bold percentages indicate improvement.*

The three default scenarios model:

- **Cable**: home broadband (20 Mbps, 20 ms latency)
- **Fiber**: high-speed internet (100 Mbps, 15 ms latency)
- **Mobile 5G**: cellular (30 Mbps, 30 ms latency)

All default scenarios use a **1 KB request and a 2 KB response**, so they differ
only in bandwidth and latency.


## What changed?


The timing data constrains what the explanation needs to cover:

- **Total MPC protocol traffic fell from 34.78 MB to 30.08 MB per default run
  (−13.5%).**
- **Verifier→prover traffic fell sharply — 4.00 MB to 0.60 MB (−85.1%) —
  owing to the cumulative executor/session rework and OT optimizations.**
- **Almost all of the saved time is in preprocessing.** Native preprocessing is
  **7.1–8.5%** faster; browser preprocessing is **9.3–14.5%** faster.

---

## Detailed performance analysis

The sections below break the result down by bandwidth, latency, and response
size. The headline stays the same: beta.1 is faster at every measured point, and
the browser build gains more than the native build.

### Upload bandwidth

<img src="/assets/images/beta1-vs-alpha15/bandwidth_light.svg#gh-light-mode-only" alt="Runtime vs upload bandwidth" />
<img src="/assets/images/beta1-vs-alpha15/bandwidth_dark.svg#gh-dark-mode-only" alt="Runtime vs upload bandwidth" />

MPC mode is upload-bandwidth constrained; after about 100 Mbps it starts to converge quickly toward proxy-mode speed as bandwidth increases.

### Network latency

<img src="/assets/images/beta1-vs-alpha15/latency_light.svg#gh-light-mode-only" alt="Runtime vs network latency" />
<img src="/assets/images/beta1-vs-alpha15/latency_dark.svg#gh-dark-mode-only" alt="Runtime vs network latency" />

The latency data implies ~48 serialized round trips for native MPC and ~56 for browser MPC, but only ~21 for both proxy builds. The extra ~8 browser round trips are either a harness artifact or a protocol inefficiency. Isolating those and reducing the overall round count are future work.

### Response size

<img src="/assets/images/beta1-vs-alpha15/download_light.svg#gh-light-mode-only" alt="Runtime vs response size" />
<img src="/assets/images/beta1-vs-alpha15/download_dark.svg#gh-dark-mode-only" alt="Runtime vs response size" />

The gap between proxy and MPC mode stays roughly constant in both native and browser, isolating the fixed MPC-mode cost from the response-processing work that both modes share.

:::info

Note: This benchmark measures proving statements over the entire server response. If selective disclosure is not required, the protocol can process much larger resources (images, video, etc.) without significant runtime impact by using ciphertext commitments, which are fast and largely independent of response size.

:::

### Browser vs native

The browser build is still slower than native at every measured point, but the gap is closing. In the default scenarios, browser/native falls from **1.12–1.41×** on alpha.15 to **1.06–1.21×** on beta.1, and from **2.28×** to **1.53×** at 50 KB.

Proxy mode follows the same trend: browser/native falls from **1.62–1.99×** on the original proxy build to **1.21–1.35×** on beta.1, and from **3.86×** to **1.93×** at 50 KB.

The biggest remaining gap is still at large payloads, where the ZK proof work dominates. More targeted WASM optimizations there could close it further.

## Next steps

Adding support for **TLS 1.3** is the most requested feature and the priority for the next release.

---

## Benchmark details

- **Hardware:** Azure `Standard_F8als_v6` (8 vCPU / 16 GB RAM), AMD EPYC 9004
  (Genoa) with up to 3.7 GHz boost and SMT disabled, Debian 12.
- **Samples:** 10 measured samples per point, plus 3 warmup samples that are
  excluded from every statistic.
- **Deferred decryption:** enabled for MPC runs.
- **Reproducibility:** Raw data, notebooks, and benchmarking harness available in our [GitHub repository](https://github.com/tlsnotary/website/tree/master/blog/2026-11-14-beta1-performance/data).
