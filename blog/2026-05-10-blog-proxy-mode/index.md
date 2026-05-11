---
title: "Proxy mode benchmarks: what the new mode actually buys you"
authors: [heeckhau, th4s]
---

We recently [announced Proxy mode](https://tlsnotary.org/blog/2026/04/22/proxy-mode) support in TLSNotary as a faster zkTLS protocol and discussed the trust and security assumptions. In this post we bring the benchmark results.

We ran the benchmark harness across the same network profiles, sweeps, and payload sizes that anchored our [August 2025](https://tlsnotary.org/blog/2025/08/31/benchmarks/) and [alpha.14](https://tlsnotary.org/blog/2026/01/19/alpha14-performance) posts, in both native and browser builds, and added Proxy mode side-by-side with MPC mode. The headline finding lives below; the rest of the post is about *when each mode is the right choice*, because faster is not always better. A full alpha.14-vs-alpha.15 comparison is coming with the alpha.15 release post; this post is the mode comparison only.

<!-- truncate -->

## TL;DR

On three representative real-world network profiles, with a 1 KB request and a 2 KB response:

|         | Cable                          | Mobile 5G                     | Fiber                         |
|---------|--------------------------------|-------------------------------|-------------------------------|
| Native  | MPC: 14.5 s<br/>Proxy: 1.6 s    | MPC: 10.4 s<br/>Proxy: 1.6 s   | MPC: 3.6 s<br/>Proxy: 1.0 s    |
| Browser | MPC: 15.5 s<br/>Proxy: 2.0 s    | MPC: 11.4 s<br/>Proxy: 1.9 s   | MPC: 4.8 s<br/>Proxy: 1.4 s    |

*Means over 10 samples per row. Both modes use the realistic ZK authentication path on sent and recv. See [Benchmark setup](#benchmark-setup).*

Proxy mode completes a 1 KB / 2 KB attestation in **1-2 seconds** across real-world residential and mobile profiles, in both native and browser builds. MPC ranges from 3-15 seconds on the same profiles. Whether that difference matters for your deployment depends on the trust model you need.

## Speed isn't the only axis

As discussed in the [Proxy mode introduction post](https://tlsnotary.org/blog/2026/04/22/proxy-mode) there are a few practical considerations beyond raw runtime:

**Who connects to the server.** In MPC mode the prover's device connects, so the request reaches the server from a normal residential or mobile IP. In Proxy mode the verifier connects on the prover's behalf; if the verifier runs in a data center, the server may flag or block its IP, and routing around that with a residential proxy weakens the network trust assumption further.

**Browser deployments.** Browsers cannot open raw TCP connections, so MPC mode in the browser needs a WebSocket-to-TCP proxy on the path between the prover and the server. Someone has to host that: either the application, or the user themselves locally. The latter is fine for power users and awkward for everyone else. Proxy mode sidesteps the problem: the browser prover speaks WebSocket to the verifier, and the verifier handles the TCP leg to the server.

The previous blog post covers the trust model in [Who Connects to the Server Matters](https://tlsnotary.org/blog/2026/04/22/proxy-mode#who-connects-to-the-server-matters), and clarifies the WebSocket-proxy distinction in [A Note on the WebSocket Proxy](https://tlsnotary.org/blog/2026/04/22/proxy-mode#a-note-on-the-websocket-proxy). The benchmarks below are about speed.

## Benchmark setup

- **Hardware:** AMD Ryzen 9 9950X (16 cores / 32 threads), 64 GB RAM, Linux.
- **Build:** TLSNotary `main` post-Proxy-mode merge ([`tlsn`](https://github.com/tlsnotary/tlsn) `crates/harness`, commit `d50658ab973`).
- **Network simulation:** Linux `tc` / `iptables` / `ip` via the harness `runner setup` command.
- **Modes:** MPC and Proxy, run side by side under identical network and payload conditions.
- **Disclosure:** both sent and recv stay on the realistic ZK path (one-byte hole, no full-reveal optimization).
- **Targets:** native and browser (WebAssembly) builds.
- **Deferred decryption:** enabled on MPC.
- **TCP_NODELAY:** enabled.
- **Samples:** 10 per row; charts show means.

Raw data, notebooks, and regeneration scripts: [`data/`](https://github.com/tlsnotary/website/tree/master/blog/2026-05-10-blog-proxy-mode/data), including [`bench_proxy_vs_mpc.toml`](https://github.com/tlsnotary/website/blob/master/blog/2026-05-10-blog-proxy-mode/data/bench_proxy_vs_mpc.toml), [`metrics_native.csv`](https://github.com/tlsnotary/website/blob/master/blog/2026-05-10-blog-proxy-mode/data/metrics_native.csv), and [`metrics_browser.csv`](https://github.com/tlsnotary/website/blob/master/blog/2026-05-10-blog-proxy-mode/data/metrics_browser.csv).

## Bandwidth sensitivity

[
![bandwidth sweep](./data/bandwidth_light.svg#gh-light-mode-only)
![bandwidth sweep](./data/bandwidth_dark.svg#gh-dark-mode-only)
](https://github.com/tlsnotary/website/blob/master/blog/2026-05-10-blog-proxy-mode/data/bandwidth.ipynb)

*Bandwidth sweep at 25 ms latency, 1 KB request, 2 KB response.*

On low-bandwidth connections, MPC mode runtime is dominated by uploading ~30 MB of garbled-circuit material before the TLS handshake even begins. At 5 Mbps that costs ~52 seconds; at 1 Gbps it shrinks to ~1 second. Proxy mode has no such preprocessing; its runtime drops from ~4 seconds to ~1 second across the same range. The MPC-vs-Proxy gap is therefore largest where users actually live (residential broadband at 5-50 Mbps) and shrinks at 1 Gbps where neither mode is bandwidth-bound: speedup ratio falls monotonically from **12.5× at 5 Mbps to 1.8× at 1 Gbps**.

## Latency sensitivity

[
![latency sweep](./data/latency_light.svg#gh-light-mode-only)
![latency sweep](./data/latency_dark.svg#gh-dark-mode-only)
](https://github.com/tlsnotary/website/blob/master/blog/2026-05-10-blog-proxy-mode/data/latency.ipynb)

*Latency sweep at 100 Mbps, 1 KB request, 2 KB response.*

Both modes are linear in latency, but MPC's slope is roughly twice Proxy's because MPC-TLS uses ~40 communication rounds during the handshake while Proxy mode has substantially fewer. At 200 ms RTT (transcontinental or satellite), MPC takes 13.3 seconds while Proxy takes 6.2 seconds, still 2× faster, but the multiplicative win shrinks from **4.2× at 10 ms to 2.1× at 200 ms**. Latency-sensitive applications benefit from Proxy more on local connections than on long-haul ones.

## Response size

[
![response size sweep](./data/download_light.svg#gh-light-mode-only)
![response size sweep](./data/download_dark.svg#gh-dark-mode-only)
](https://github.com/tlsnotary/website/blob/master/blog/2026-05-10-blog-proxy-mode/data/download.ipynb)

*Response-size sweep at 100 Mbps, 25 ms latency, 1 KB request.*

Both modes pay a ZK authentication cost on the response transcript, which scales with response size. The cost is roughly equal in absolute terms: about 1.2 seconds for 50 KB in MPC, about 1.5 seconds for 50 KB in Proxy. But because Proxy's baseline is much smaller, the multiplicative speedup shrinks as response size grows: **3.6× at 1 KB to 2.0× at 51 KB**. Both curves grow on the redact path; a follow-up post shows what happens when this growth is removed by completely revealing the response.

## Native vs browser

In the representative scenarios (1 KB / 2 KB), the WASM browser build is only **10-40% slower** than native. At larger response sizes the gap reopens: at 51 KB, native Proxy completes in 2.6 s while browser Proxy takes 7.3 s (2.8× slower). The remaining gap is concentrated in the ZK authentication path on recv, which leans heavily on AES operations that WASM cannot yet hardware-accelerate.

## When to choose which mode

| Use case                                                    | Recommended mode | Why                                                            |
| ----------------------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| Adversarial prover, high-stakes proofs, compliance pressure | MPC              | Strongest trust model (see the [Proxy mode announcement](https://tlsnotary.org/blog/2026/04/22/proxy-mode)) |
| Server may block data-center or proxy IPs                   | MPC              | Prover's own residential or mobile IP connects directly        |
| Bandwidth- & latency-sensitive UX                      | Proxy            | An order of magnitude faster on real connections               |
| Browser deployment for general users                        | Proxy            | No WebSocket-to-TCP proxy to host    |

The decision is principally about who runs the verifier, who connects to the server, how strong a trust story you need, and how you balance speed against the residual risk.

---

## Coming next

**Full-reveal fast path.** One TLSNotary optimization we deliberately left out of this post: when the response is fully revealable, the prover can hand the verifier the server write key instead of proving the response plaintext in ZK. On the prover's critical path, response size effectively stops being a cost axis. A follow-up post will benchmark this.

**Alpha.15 release benchmarks.** Once alpha.15 ships, we will publish a release-focused post comparing alpha.14 and alpha.15 head-to-head across both modes.
