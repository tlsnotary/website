---
title: "Testing MPC-TLS: Building a Reproducible Network Harness"
authors: [heeckhau]
---

Testing and benchmarking a multi-party computation (MPC) protocol like TLSNotary presents unique challenges. Three parties, Server, Prover and Verifier, must communicate over a network, and the protocol's performance is highly sensitive to real-world network conditions: multiple communication rounds make it **latency-sensitive**, while significant data transfer makes it **bandwidth-sensitive**. Add network failures and browser/WASM support to the mix, and things get even more interesting.

![TLSNotary Overview](./light/overview.svg#gh-light-mode-only)
![TLSNotary Overview](./dark/overview.svg#gh-dark-mode-only)

In this post, we'll walk through how we built a test and benchmark harness that provides reproducible network conditions for both native and browser-based testing. This is the same harness we use to produce our [performance benchmarks](/blog/2026/01/19/alpha14-performance).

<!-- truncate -->

## The Testing Challenge

Testing TLSNotary requires:

1. **Two networked parties**: Prover and Verifier must communicate, exchanging MPC protocol messages
2. **A target server**: The Prover connects to a server via TLS
3. **Reproducible network conditions**: Performance benchmarks are meaningless without controlled latency and bandwidth
4. **Both native and browser support**: Our WASM build must work in real browsers, not just headless environments

Simply running everything on `localhost` doesn't cut it. Localhost traffic has near-zero latency and effectively unlimited bandwidth, but real users don't have that luxury. A protocol that completes in 2 seconds on localhost might take 30 seconds on a slow home connection. To make meaningful performance claims, we need to test under realistic network conditions.

## The Solution: Linux Traffic Control

Ideally, we'd test on two separate machines with a real network between them. But that's impractical for CI and local development.

Instead, we use Linux's `tc` (traffic control) combined with network namespaces. Namespaces give us isolated network environments; `tc` lets us shape the traffic between them. This isn't a perfect replica of real-world networking, but it's good enough for reproducible benchmarks.

### The Network Topology

The harness creates three namespaces connected via a bridge:

![Network Topology](./light/topology.svg#gh-light-mode-only)
![Network Topology](./dark/topology.svg#gh-dark-mode-only)

We apply `tc` rules to the virtual interfaces (veth) connecting namespaces, shaping traffic in both directions. This enables testing under different conditions: high bandwidth (100+ Mbps), constrained upload (10 Mbps), or high latency (200ms RTT).

## The Runner

A [runner](https://github.com/tlsnotary/tlsn/tree/v0.1.0-alpha.14/crates/harness/runner) orchestrates everything. It sets up the network namespaces, starts the necessary services (test server, WebSocket proxies, WASM server), launches the Prover and Verifier executors in their respective namespaces, applies `tc` rules, and coordinates execution via RPC. The same runner handles both tests and benchmarks.

## Native vs Browser Mode

In native mode, the Prover connects directly to the Verifier via TCP. Browser mode is trickier: browsers can't open raw TCP sockets, so we use WebSocket proxies that relay connections to TCP. Traffic still traverses the shaped virtual interfaces.

## Running Benchmarks

Benchmarks are configured via TOML files specifying network conditions and request sizes. The harness runs warm-up iterations first to stabilize JIT compilation and caches, then executes the configured number of samples. Results are written to CSV for analysis.

## Conclusion

This infrastructure lets us make confident performance claims. When we say "TLSNotary completes in 5 seconds at 100 Mbps with 25ms latency," that's a reproducible measurement, not a best-case localhost number.

The approach isn't specific to TLSNotary, any multi-party protocol could benefit from similar infrastructure using `tc` and network namespaces.

---

The harness is open source: [github.com/tlsnotary/tlsn/tree/main/crates/harness](https://github.com/tlsnotary/tlsn/tree/main/crates/harness)

See the scripts and results this infrastructure produced in our [alpha.14 performance analysis](/blog/2026/01/19/alpha14-performance), where we break down how network conditions affect TLSNotary's runtime.
