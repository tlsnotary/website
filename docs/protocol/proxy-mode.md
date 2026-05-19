---
sidebar_position: 7
---
# Proxy Mode

:::note
**MPC-TLS remains the default TLSNotary protocol.** Proxy mode is an alternative offered for use cases where prover-verifier bandwidth is the binding constraint, and where the stronger MPC-TLS security guarantees can be relaxed in exchange.
:::

In proxy mode, the `Verifier` acts as a network proxy between the `Prover` and the `Server`. The `Verifier` forwards encrypted TLS packets (without being able to decrypt them) and, after the TLS session ends, validates a zero-knowledge proof that binds the observed traffic to a legitimate TLS session.

![](../../diagrams/light/overview_proxy.svg#gh-light-mode-only)
![](../../diagrams/dark/overview_proxy.svg#gh-dark-mode-only)

## When to use proxy mode

- Prover-verifier bandwidth is constrained
- Verification latency is the priority (e.g. high-frequency identity checks)
- You control the verifier infrastructure
- You do not need the security guarantees of MPC

Use MPC-TLS when you need the strongest guarantees, blind verification (the verifier should not learn which server), or when the server might block requests originating from the verifier's IP.

## Protocol phases

Proxy mode has three phases:

1. **Preprocessing.** Before the TLS connection begins, the `Prover` and `Verifier` set up the zero-knowledge circuits used later to verify key derivation. Lighter than MPC-TLS preprocessing (no garbled circuits), but not instant.
2. **TLS session.** The `Prover` performs a standard TLS handshake through the `Verifier`, which forwards encrypted packets in both directions. The `Verifier` records all traffic but cannot decrypt it. The `Prover` captures the pre-master secret from the key exchange.
3. **Verification.** After the session ends, the `Prover` and `Verifier` run a ZK protocol in three steps:
   - **3a.** The `Prover` proves, in zero knowledge, the TLS 1.2 PRF derivation: master secret → session keys → `verify_data` for both Finished messages. The pre-master secret is the only private input.
   - **3b.** The `Verifier` decrypts the Finished records using the keys from step 3a and checks that their plaintext matches the derived `verify_data`. This proves that the private PMS input of the prover can indeed reproduce the handshake that the verifier observed during the online phase and binds the prover to the session keys, which are later used as private inputs for selective disclosure.
   - **3c.** The `Prover` proves the server's GHASH key to the `Verifier` in zero knowledge, using the server-side session keys as private input. The `Verifier` then uses this GHASH key to recompute the AES-GCM authentication tags on every server application-data record it observed, and compares them to the tags seen on the wire. This links the forwarded server data to the authenticated handshake.

Selective disclosure works identically to MPC-TLS: the `Prover` can reveal or redact arbitrary parts of the transcript.

## Trust model

Running the `Verifier` yourself is sufficient to rule out collusion: the ZK proof prevents the `Prover` from forging data. The remaining attack surface is the network path between the `Verifier` and the `Server`. An adversary who can make the `Verifier`'s TCP connection terminate at a server impersonating the claimed domain can fool the `Verifier`. This is a well-understood class of attack against TLS infrastructure in general, not specific to TLSNotary.

If a third party operates the `Verifier`, the `Prover` and the third-party `Verifier` must not collude — the same trust requirement as MPC-TLS.

## See also

- [Introducing Proxy Mode (blog post)](/blog/2026/04/22/proxy-mode) — full narrative, trade-offs, and when to choose which mode
- [Rust quick start: Proxy Verifier example](../quick_start/rust.md#proxy)
