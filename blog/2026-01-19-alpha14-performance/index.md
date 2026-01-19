---
title: alpha.14 Performance Improvements
authors: [dan]
---

We're pleased to share performance improvements in TLSNotary **alpha.14**. Through optimizations across the protocol stack, alpha.14 delivers speedups of **8% to 16%** across real-world network scenarios.

In this post, we present detailed benchmarks comparing alpha.13 and alpha.14 across different network conditions, demonstrating how these improvements translate to real-world performance gains for both native and browser deployments.

<!-- truncate -->

## Benchmark Results

Protocol runtime (in seconds) for alpha.14 native and browser builds across representative real-world scenarios:

|  | Cable | Fiber | Mobile 5G |
|--|-------|-------|-----------|
| Native | 15.0s (**-8.9%**) | 4.1s (**-9.7%**) | 10.9s (**-8.4%**) |
| Browser | 16.8s (**-12.8%**) | 6.5s (**-16.1%**) | 12.9s (**-12.6%**) |

*__Bold percentages__ indicate improvement over alpha.13.*

These representative benchmarks model typical network conditions users experience:
- **Cable**: Home broadband connection (20 Mbps, 20ms latency)
- **Fiber**: High-speed internet connection (100 Mbps, 15ms latency)
- **Mobile 5G**: Modern cellular network (30 Mbps, 30ms latency)

All scenarios use the same payload sizes: **1 KB request, 2 KB response**, differing only in bandwidth and latency to isolate network effects.

Browser builds see slightly larger improvements (13-16%) compared to native (8-10%), benefiting proportionally from the protocol optimizations.

## What Changed?

The performance improvements in alpha.14 come from several key optimizations:

- **Cryptographic optimizations**: Improved implementation of core MPC primitives
- **Protocol refinements**: Reduced communication overhead and round complexity where possible
- **Memory management**: Better allocation strategies reducing overhead
- **Browser-specific improvements**: Enhanced WebAssembly performance for browser builds

These changes improve both the **preprocessing phase** (work done before connecting to the server) and the **online phase** (interactive proving while connected), making the entire protocol faster end-to-end.

---

## Detailed Performance Analysis

The sections below provide a deeper dive into how specific factors—bandwidth, latency, and response size—affect protocol performance. These details are useful for understanding edge cases and optimizing deployments, but the key takeaway remains: **alpha.14 delivers consistent 8-16% improvements across real-world scenarios.**

### Upload Bandwidth

[
![bandwidth benchmark](./data/bandwidth_light.svg#gh-light-mode-only)
![bandwidth benchmark](./data/bandwidth_dark.svg#gh-dark-mode-only)
](
    https://github.com/tlsnotary/website/blob/master/blog/2026-01-19-alpha14-performance/data/bandwidth.ipynb
)
*Benchmark Parameters: latency = 25 ms, request size = 1 KB, response size = 2 KB.*

On bandwidth-constrained connections, the protocol runtime is dominated by the volume of MPC data the prover must upload to the verifier. Performance improvements are consistent across the range. Once bandwidth exceeds ~100 Mbps, it's no longer the limiting factor, and computational optimizations provide more significant benefits.

### Network Latency

[
![latency benchmark](./data/latency_light.svg#gh-light-mode-only)
![latency benchmark](./data/latency_dark.svg#gh-dark-mode-only)
](
    https://github.com/tlsnotary/website/blob/master/blog/2026-01-19-alpha14-performance/data/latency.ipynb
)
*Benchmark Parameters: bandwidth = 100 Mbps, request size = 1 KB, response size = 2 KB.*

Network latency has a direct linear impact on runtime due to the ~40 communication rounds in the MPC-TLS protocol. Performance improvements are maintained across all latency levels, though the relative impact decreases as network round-trip time becomes the dominant factor.

### Response Size

[
![response size benchmark](./data/download_light.svg#gh-light-mode-only)
![response size benchmark](./data/download_dark.svg#gh-dark-mode-only)
](
    https://github.com/tlsnotary/website/blob/master/blog/2026-01-19-alpha14-performance/data/download.ipynb
)
*Benchmark Parameters: latency = 25 ms, bandwidth = 100 Mbps, request size = 1 KB.*

Runtime scales with server response size, as expected. Performance improvements are maintained across all response sizes. For typical web API responses (~10 KB), **native builds complete in under 7 seconds** while **browser builds take ~13 seconds** — both fast enough for responsive end-user experiences.

:::info

Note: This benchmark measures proving statements over the entire server response. If selective disclosure is not required, TLSNotary can process much larger resources (images, video, etc.) without significant runtime impact by using ciphertext commitments, which are fast and largely independent of response size.

:::

### Browser vs Native

Browser builds show a performance gap compared to native builds, most notably in the response size benchmark where WebAssembly runs approximately **2× slower on average**. This gap is primarily due to WebAssembly's lack of hardware-accelerated cryptographic instructions (AES-NI, PCLMULQDQ) that native builds leverage extensively.

We expect to bridge this gap in future releases through additional WASM-specific optimizations.

## Conclusions

Alpha.14 improves TLSNotary performance:

- **8-16% faster** across real-world network scenarios (Cable, Fiber, Mobile 5G)
- **Consistent improvements** across varying latency, bandwidth, and response sizes
- **Both preprocessing and online phases** benefit from optimizations

---

## Benchmark Details

- **Hardware:** All benchmarks were run on an AWS c5.4xlarge instance (16 vCPU, 3.0 GHz, 32 GB RAM).
- **Versions Compared:**
  - alpha.13: Prior release baseline
  - alpha.14: Current release with optimizations
- **Deferred Decryption:** Enabled (defers decryption until full TLS transcript is available, reducing MPC workload).
- **TCP_NODELAY:** Enabled to disable Nagle's algorithm, ensuring immediate packet transmission. [Learn more](https://en.wikipedia.org/wiki/Nagle%27s_algorithm).
- **Network Simulation:** Using Linux `tc`, `iptables`, and `ip` commands for precise latency and bandwidth control.
- **Reproducibility:** Raw data, notebooks, and benchmarking harness available in our [GitHub repository](https://github.com/tlsnotary/website/tree/master/blog/2026-01-19-alpha14-performance/data).
