---
title: "Testing MPC-TLS: Building a Reproducible Network Harness"
authors: [heeckhau]
---

Testing a multi-party computation (MPC) protocol like TLSNotary presents unique challenges. Two parties, Prover and Verifier, must communicate over a network, and the protocol's performance is highly sensitive to real-world network conditions: approximately 40 communication rounds make it latency-sensitive, while significant data transfer makes it bandwidth-sensitive. Add browser/WASM support to the mix, and things get even more interesting.

In this post, we'll walk through how we built a test and benchmark harness that provides reproducible network conditions for both native and browser-based testing. This is the same harness we use to produce our [performance benchmarks](/blog/2026/01/19/alpha14-performance).

<!-- truncate -->

## The Testing Challenge

TLSNotary is an MPC-TLS protocol where a Prover proves facts about a TLS connection to a Verifier without revealing sensitive data.

![TLSNotary Overview](./light/overview.svg#gh-light-mode-only)
![TLSNotary Overview](./dark/overview.svg#gh-dark-mode-only)

Testing this requires:

1. **Two networked parties**: Prover and Verifier must communicate, exchanging MPC protocol messages
2. **A target server**: The Prover connects to a server via TLS
3. **Reproducible network conditions**: Performance benchmarks are meaningless without controlled latency and bandwidth
4. **Both native and browser support**: Our WASM build must work in real browsers, not just headless environments

Simply running everything on `localhost` doesn't cut it. Localhost traffic has near-zero latency and effectively unlimited bandwidth, but real users don't have that luxury. A protocol that completes in 2 seconds on localhost might take 30 seconds on a slow home connection. To make meaningful performance claims, we need to test under realistic network conditions.

## The Solution: Linux Traffic Control

Linux's `tc` (traffic control) is a battle-tested tool for shaping network traffic: limiting bandwidth, adding latency, simulating packet loss. The challenge is applying it selectively to test traffic without affecting the rest of the system.

Our solution uses **network namespaces** to create isolated network environments. Each namespace has its own network stack, connected to others via virtual ethernet (veth) pairs. We apply `tc` rules to these veth interfaces, giving us precise control over traffic between components.

### The Network Topology

The harness creates three namespaces connected via a bridge:

![Network Topology](./light/topology.svg#gh-light-mode-only)
![Network Topology](./dark/topology.svg#gh-dark-mode-only)

| Namespace  | Purpose              | Key Components                                                 |
| ---------- | -------------------- | -------------------------------------------------------------- |
| **NS_0**   | Prover environment   | Prover executor, WebSocket proxies (browser mode), WASM server |
| **NS_1**   | Verifier environment | Verifier executor                                              |
| **NS_APP** | Target server        | Test HTTP server                                               |

### Applying Traffic Shaping

We use two `tc` qdiscs (queuing disciplines):

- **TBF (Token Bucket Filter)**: Limits bandwidth
- **netem**: Adds latency (and optionally jitter, packet loss, etc.)

```bash
# Apply bandwidth limit
tc qdisc add dev vethp0 root handle 1: tbf \
  rate 100mbit burst 200kbit latency 60s

# Add latency as child qdisc
tc qdisc add dev vethp0 parent 1:1 handle 10: netem \
  delay 25ms
```

We apply shaping to the veth interfaces on both sides of the protocol channel (`vethp0` and `vethp1`), giving us control over the Prover/Verifier communication. Similarly for the app channel to the target server.

:::note
Latency is configured as half the desired round-trip time since traffic traverses shaped interfaces in both directions.
:::

This enables benchmark configurations like:

- **High bandwidth, low latency**: Ideal conditions (100+ Mbps, 10ms RTT)
- **Low bandwidth**: Constrained upload (10 Mbps)
- **High latency**: Intercontinental distances (200ms RTT)

## The Browser Problem

Browser-based testing introduces additional complexity. Browsers can't open raw TCP sockets; they're limited to HTTP, WebSocket, and WebRTC. Our solution uses WebSocket proxies that relay WebSocket connections to TCP.

The proxy runs **inside NS_0**, so when it connects to the Verifier in NS_1, the traffic traverses the shaped veth interfaces where `tc` rules apply.

![Browser Traffic Flow](./light/browser-flow.svg#gh-light-mode-only)
![Browser Traffic Flow](./dark/browser-flow.svg#gh-dark-mode-only)

## The Runner Architecture

The harness runner orchestrates everything:

1. **Create network**: Set up namespaces, bridge, veth pairs, routing, iptables rules
2. **Start services**: Server fixture, WASM server, WebSocket proxies
3. **Start executors**: Launch Prover and Verifier processes in their respective namespaces
4. **Configure network**: Apply tc rules for the desired bandwidth/latency
5. **Run tests**: Send commands via RPC, collect results

### Native vs Browser Mode

| Aspect            | Native Mode              | Browser Mode              |
| ----------------- | ------------------------ | ------------------------- |
| Prover            | `executor-native` binary | Chrome with WASM          |
| Protocol channel  | Direct TCP               | WebSocket to proxy to TCP |
| RPC               | TCP with bincode         | Chrome DevTools Protocol  |
| WebSocket proxies | Not needed               | Required                  |

In browser mode, we launch Chrome inside the namespace with remote debugging enabled. The runner then connects via Chrome DevTools Protocol, navigates to the local WASM server, and executes test commands by calling JavaScript functions that interact with the WASM module.

## Putting It All Together

Here's what happens when running a browser-mode test:

1. Browser loads WASM from the local WASM server
2. WASM code connects to the WebSocket proxy (in the same namespace)
3. Proxy establishes TCP connection to Verifier in NS_1
4. Traffic flows through shaped veth interfaces
5. MPC protocol executes with realistic latency/bandwidth
6. Results collected via Chrome DevTools Protocol

The same test in native mode skips the proxy; the Prover connects directly to the Verifier via TCP, but the traffic still flows through the same shaped interfaces.

## Running Benchmarks

Benchmarks are configured via TOML files specifying the test matrix:

```toml
# Define a reusable configuration group
[[group]]
name = "cable"
bandwidth = 20
protocol_latency = 20
upload-size = 1024
download-size = 2048

# Run a benchmark using the group's settings
[[bench]]
group = "cable"
```

The harness runs warm-up iterations first to stabilize JIT compilation and caches, then executes the configured number of samples per configuration. Results are written to CSV with detailed timing metrics, making it easy to analyze performance across different network scenarios.

## Conclusion

This infrastructure lets us make confident performance claims. When we say "TLSNotary completes in 5 seconds at 100 Mbps with 25ms latency," that's a reproducible measurement, not a best-case localhost number.

The approach isn't specific to TLSNotary. Any multi-party protocol could benefit from similar testing infrastructure. The key ingredients are:

- **Traffic control (`tc`)** for realistic network simulation
- **Network namespaces** for isolation and selective shaping
- **WebSocket proxies** for browser compatibility (since browsers can't open TCP sockets)

The harness is open source: [github.com/tlsnotary/tlsn/tree/main/crates/harness](https://github.com/tlsnotary/tlsn/tree/main/crates/harness)

See the results this infrastructure produced in our [alpha.14 performance analysis](/blog/2026/01/19/alpha14-performance), where we break down how network conditions affect TLSNotary's runtime.
