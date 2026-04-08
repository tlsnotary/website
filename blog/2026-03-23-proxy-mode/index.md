---
title: "Introducing Proxy Mode: Choose Your Trust-Speed Tradeoff"
authors: [heeckhau]
description: "TLSNotary now supports proxy mode alongside MPC-TLS, letting developers choose between maximum security and maximum speed, or switch between both depending on the use case."
---

import Figure from '@site/src/components/Figure';

Today we're introducing **proxy mode**: a fast, lightweight way to prove the authenticity of web data using TLSNotary. It complements our existing **MPC-TLS** approach, giving developers a choice between maximum security and maximum speed, and you can switch between the two with a simple toggle.
<!-- truncate -->

## Why Proxy Mode?

MPC-TLS is TLSNotary's gold standard. The prover and verifier jointly execute the TLS handshake using multi-party computation, meaning **no single party ever holds the full session keys**. This provides the strongest possible guarantee: even a malicious prover cannot forge data.

But MPC comes at a cost. The cryptographic protocol requires significant bandwidth between prover and verifier (garbled circuits, oblivious transfers, and multiple rounds of interaction during the TLS handshake). For many real-world applications, this overhead is a bottleneck.

Proxy mode offers a different approach: **let the verifier act as a network proxy**, forwarding real TLS traffic between the prover and the server. After the session, the prover generates a zero-knowledge proof that cryptographically binds the observed traffic to the actual TLS session. The result is dramatically faster verification, at the cost of a different (but well-understood) trust model.

## How It Compares to MPC-TLS

In MPC-TLS, the **prover** connects directly to the server. The server sees the prover's IP address, and the verifier does not learn which server the prover is talking to during the online phase.

<Figure
  src={require('./light/mpc_mode.svg').default}
  darkSrc={require('./dark/mpc_mode.svg').default}
  caption="MPC-TLS: the prover connects to the server. Prover and verifier jointly perform the TLS handshake."
  width={500}
/>

In proxy mode, the **verifier** connects to the server and forwards encrypted traffic. The server sees the verifier's IP address, not the prover's.

<Figure
  src={require('./light/proxy_mode.svg').default}
  darkSrc={require('./dark/proxy_mode.svg').default}
  caption="Proxy mode: the verifier connects to the server, forwards encrypted TLS traffic, and verifies a ZK proof after the session."
  width={500}
/>

| | MPC-TLS | Proxy Mode |
|---|---|---|
| **Trust model** | No trusted party; security from MPC | Verifier must trust its own network path to the server |
| **Who connects to the server** | The prover | The verifier (as proxy) |
| **Detectable by server** | No, looks like normal TLS | Yes, the server sees the verifier's IP |
| **Bandwidth (prover-verifier)** | High (MPC protocol overhead) | Low (only forwarded TLS packets + ZK proof) |
| **Speed** | Slower | Significantly faster |
| **Blind verification** | Possible | No, verifier connects to the server directly |

## How Proxy Mode Works

At a high level, proxy mode has three phases:

1. **Preprocessing.** Before the TLS connection begins, the prover and verifier set up the zero-knowledge circuits that will later be used to verify key derivation. This is much lighter than MPC-TLS preprocessing (which requires garbled circuits and oblivious transfers), but it is not instant.
2. **TLS session.** The prover performs a standard TLS handshake through the verifier, which forwards encrypted packets in both directions. The verifier records all traffic but cannot decrypt it. During the handshake, the prover captures the pre-master secret from the key exchange.
3. **Verification.** After the session ends, the prover and verifier run the ZK protocol. The prover proves that the traffic the verifier observed is consistent with a legitimate TLS session. This happens in three steps (detailed below).

### Step 3a: Prove key derivation

The core of the proof is a zero-knowledge computation of the TLS 1.2 PRF (pseudo-random function). The prover holds the **pre-master secret** as its private input. Everything else is used as public inputs: the client random, server random, and handshake transcript hashes.

The ZK circuit computes the full derivation chain:

- **Master secret** from the pre-master secret (using the Extended Master Secret extension)
- **Session keys** (client/server write keys and IVs) from the master secret
- **Verify data** for both the client Finished and server Finished messages

The verifier learns the `verify_data`, but never learns the pre-master secret or the derived keys.

### Step 3b: Validate the Finished messages

The TLS Finished messages contain `verify_data`: a value derived from the master secret and the full handshake transcript. Both client and server send one. Since the verifier forwarded the traffic, it has the **encrypted** Finished records.

The ZK circuit decrypts these Finished records using the derived keys and checks that the plaintext matches the `verify_data` computed in Step 3a. If they match, the verifier knows the prover actually participated in this specific TLS handshake, because only a party that completed the ECDHE key exchange could know the pre-master secret that produces matching `verify_data`.

### Step 3c: Verify application data

Finally, the verifier checks the **AES-GCM authentication tags** sent by the server on every application data record it observed. Using the session keys from Step 3a, it recomputes the expected tags and compares them against the actual, observed tags. This confirms that the application data was encrypted under the same keys, linking it to the authenticated handshake.

After these three steps, the verifier has cryptographic assurance that the traffic it forwarded corresponds to a real TLS session with the claimed server, and that the prover could not have tampered with the data.

Selective disclosure works the same way as in MPC-TLS: the prover can choose which parts of the transcript to reveal to the verifier while keeping the rest private.

### Constraints

Proxy mode currently supports **TLS 1.2** with `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256` (secp256r1 key exchange).

## Who Connects to the Server Matters

A key difference between the two modes is which party opens the TCP connection to the web server.

In **MPC-TLS**, the prover's device connects directly. From the server's perspective, this looks like a normal request from a regular user. The server has no way to detect that TLSNotary is involved.

In **proxy mode**, the verifier connects to the server on behalf of the prover. This has practical consequences:

- **Server-side blocking.** Many web applications block requests from known cloud or data center IPs to prevent bots and scraping. If the verifier runs on a server, its IP may be flagged. A common workaround is routing through a residential proxy, but this introduces another intermediary and further weakens the network trust assumptions.
- **No blocking issue with MPC-TLS.** Because the prover's own device connects to the server, there is no risk of IP-based blocking. The request originates from the user's residential or mobile connection, exactly as the server expects.

This is another reason MPC-TLS is the stronger choice for high-stakes use cases: it avoids the detectability and censorship concerns entirely.

## Trust Assumptions

In proxy mode, if you **run the verifier yourself**, you do not need to trust anybody else. You control the infrastructure. The ZK proof guarantees the prover cannot forge the data.

The remaining attack surface is the network: if an adversary controls the network between your verifier and the web server (via [DNS or BGP hijacking](https://blog.reclaimprotocol.org/posts/fake-website-attack), for example), they could redirect the connection to a fake server. This is a well-understood class of attacks that applies broadly to internet infrastructure, not just TLSNotary.

TLSNotary does not require you to run the verifier yourself. The verifier role can be delegated to a third party. In that scenario, you must trust the third-party verifier not to collude with the prover, since a colluding verifier could attest to fabricated sessions. This trust requirement applies equally to both MPC-TLS and proxy mode.

What sets TLSNotary apart is the ability to **switch modes**. If stakes are high, and the prover's device needs to connect to the server, use MPC-TLS. If speed and simplicity matter more, use proxy mode. Both modes share the same protocol and API; switching between them is a configuration change, not a rewrite.

## When to Use Which Mode

**Use proxy mode when:**
- Speed is the priority (identity verification flows, frequent attestations)
- You control the verifier infrastructure
- The server's data is low-to-medium stakes
- Bandwidth between prover and verifier is constrained

**Use MPC-TLS when:**
- The stakes are high (financial proofs, legal attestations)
- You want blind verification (verifier should not learn which server)
- You want zero trust assumptions beyond cryptography
- The server might block known proxy IPs

The ability to **switch modes per use case** is a unique advantage. A single integration can route high-stakes attestations through MPC-TLS while using proxy mode for everyday verifications, no code changes required.

## A Note on the WebSocket Proxy

If you have used TLSNotary in the browser, you may have encountered the term "WebSocket proxy." This is **unrelated** to proxy mode.

The WebSocket proxy is a transport-layer relay needed because browsers cannot make raw TCP connections. It simply tunnels TCP traffic over WebSockets so that browser-based TLSNotary can communicate with a TLS server. It has no role in the verification process.

Proxy mode, by contrast, is a fundamentally different **verification approach**: it changes how the verifier participates in the attestation, not how packets reach the server.

## What's Next

Proxy mode is available in the upcoming TLSNotary release. We will follow up with detailed performance benchmarks comparing proxy and MPC-TLS across different network conditions and deployment targets.

For technical details on the implementation, see [PR #1122](https://github.com/tlsnotary/tlsn/pull/1122).

We are excited to see what you build. Proxy mode lowers the bar for integrating web data verification, and MPC-TLS is always there when you need the strongest guarantees.
