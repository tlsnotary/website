---
title: TLSNotary Performance Benchmarks
authors: [dan, heeckhau]
---

Over the past months, we’ve made major performance leaps in TLSNotary. We implemented the VOLE-based IZK backend (QuickSilver) and implemented control-flow and MPC optimizations across the stack. These changes have drastically accelerated both native and browser builds.

Starting with v0.1.0-alpha.8, QuickSilver replaced the older garbled-circuit proof backend, greatly reducing bandwidth usage and sensitivity to latency. Subsequent releases added transcript-hash commitments, low-bandwidth modes, faster APIs, and more. (https://github.com/tlsnotary/tlsn/releases)

These changes yield significant performance gains in both native and browser builds. 

In this post, we share results from our new benchmarking harness and highlight how different network conditions (bandwidth, latency, response size) affect real-world performance.

<!-- truncate -->

## Why is performance important?

TLSNotary is an interactive protocol: the Prover and Verifier exchange data while the TLS session is ongoing. That means runtime is more than a benchmark number, it directly determines usability.

If proving takes too long:
- Connections may **timeout** before notarization completes.  
- Users may experience **slow, blocking interactions**.  

What matters most is minimizing the **online time**: the period when the Prover is actively connected to the Server.  If this phase runs too long, the server will simply close the connection.  

TLSNotary addresses this by allowing the Prover and Verifier to **preprocess** much of the MPC work *before* the Prover connects to the Server. 
The protocol is designed to make both the preprocessing and the online phase as short as possible; fast enough for smooth end-user experiences, without compromising security or privacy.

## How did we measure?

To ensure performance results are both **reliable** and **reproducible**, we created a dedicated benchmarking harness. It executes the full TLSNotary protocol in both **native** and **browser-based (WebAssembly)** environments, enabling apples-to-apples comparisons.

For simulating network conditions, the harness uses robust, low-level Linux tooling (`ip`, `iptables`, and `tc`) to precisely emulate real-world scenarios:

- **Bandwidth throttling**, to model tight or abundant network capacity.
- **Custom latency**, to reflect different round-trip times.
- **Packet shaping**, which can introduce jitter, chunking, or drops.

Combined with the ability to tweak **request** and **response** sizes, this gives us a controlled environment to isolate how each factor—network and payload—impacts runtime in native versus browser builds.

As all TLSNotary code, the harness is open source, so anyone can reproduce our results or adapt it for their own testing:
https://github.com/tlsnotary/tlsn/tree/783355772ac34af469048d0e67bb161fc620c6ac/crates/harness

Raw data and notebooks are available on [GitHub](https://github.com/tlsnotary/website/tree/master/blog/2025-08-31-benchmarks/data).

## How does Prover Upload Bandwidth impact performance?

[
![bandwidth benchmark](./data/bandwidth_light.svg#gh-light-mode-only)
![bandwidth benchmark](./data/bandwidth_dark.svg#gh-dark-mode-only)
](
    https://github.com/tlsnotary/website/blob/master/blog/2025-08-31-benchmarks/data/download.ipynb
)  
*Benchmark parameters: latency = 25 ms, request size = 1 KB, response size = 4 KB.*

On low-bandwidth connections, protocol runtime is dominated by the volume of MPC data the prover must upload to the verifier. Once bandwidth reaches around **100 Mbps**, the impact diminishes significantly and no longer drives the overall runtime.

## How does Network Latency impact performance?

[
![latency benchmark](./data/latency_light.svg#gh-light-mode-only)
![latency benchmark](./data/latency_dark.svg#gh-dark-mode-only)
](
    https://github.com/tlsnotary/website/blob/master/blog/2025-08-31-benchmarks/data/latency.ipynb
)  
*Benchmark parameters: bandwidth = 1000 Mbps (to isolate latency), request size = 1 KB, response size = 4 KB.*

As expected, latency has a direct proportional impact on runtime. Since our MPC-TLS protocol involves ~40 communication rounds, higher RTT values linearly increase total runtime. At higher latencies, the cost of communication dominates, and the **native build’s speed advantage** is effectively canceled out — its runtime converges to that of the browser build.

## How does Server Response Size impact performance?

[
![response size benchmark](./data/download_light.svg#gh-light-mode-only)
![response size benchmark](./data/download_dark.svg#gh-dark-mode-only)
](
    https://github.com/tlsnotary/website/blob/master/blog/2025-08-31-benchmarks/data/download.ipynb
)  
*Benchmark parameters: latency = 10 ms, bandwidth = 200 Mbps, request size = 2 KB.*

Runtime also scales with server response size. In many real-world use cases, a response size of ~10 KB is sufficient. Under these conditions, the **native build completes in ~5 s**, while the **browser build takes ~10 s** — still responsive enough for a smooth end-user experience.

:::info

Note: The benchmarks above measure proving statements over the entire server response. If redaction is not required, TLSNotary can process much larger resources, such as images or video, without a significant impact on runtime. In these cases, obtaining a ciphertext commitment is fast and largely independent of response size. This scenario will be covered in a separate benchmark in the upcoming alpha.13 release.

:::

## Native vs. Browser Performance

Overall, as demonstrated in the final benchmark where bandwidth and latency are not the limiting factors, the **browser build runs about 3× slower than the native build**. The main reason is the absence of hardware acceleration in the browser’s WebAssembly environment. The underlying interactive ZK protocol, **QuickSilver**, relies heavily on SIMD instructions and hardware-accelerated cryptographic operations for optimal performance, which are fully available in native builds but not yet accessible in browsers.

In conclusion, the performance is good enough for practical use, but still leaves room for optimization in the browser. As WebAssembly gets better support for SIMD and hardware acceleration, the gap with native will shrink. Meanwhile, our harness gives us a clear way to track progress over time.

## Performance Tweaks

Alongside major protocol changes like QuickSilver, smaller optimizations also help reduce runtime:

- **TCP_NODELAY** — enabled in these benchmarks to disable Nagle's algorithm. Nagle normally batches small TCP packets to improve efficiency, but in interactive protocols like TLSNotary it adds latency. Disabling it ensures packets are sent immediately. [Learn more](https://en.wikipedia.org/wiki/Nagle%27s_algorithm).

- **Deferred decryption** — enabled here. This defers decryption until a full TLS transcript is available, reducing the amount of data that must be processed with MPC.

- **Ongoing improvements** — more optimizations are underway; see for example [issue #474](https://github.com/tlsnotary/tlsn/issues/474).

While smaller in scope than the QuickSilver integration, these tweaks help shave off precious time.


---
## Notes
The benchmarks were run on a c5.4xlarge AWS instance: 16 vCPU, 3.0GHz, 32GB RAM.

These benchmarks can be reproduced by running the benchmarking harness located in our repo https://github.com/tlsnotary/tlsn/tree/783355772ac34af469048d0e67bb161fc620c6ac/crates/harness
