---
title: The full-reveal fast path — when response size stops mattering
authors: [heeckhau]
draft: true
---

TLSNotary recently landed the **full-reveal fast path** ([issue #474](https://github.com/tlsnotary/tlsn/issues/474)): when a prover fully reveals the server's response, it can hand the verifier the server write key instead of proving the response plaintext in ZK. The verifier (or someone on its behalf) has seen the ciphertext; with the key, it decrypts and checks the response locally. The most expensive step of the protocol — proving tens of kilobytes of plaintext in zero knowledge — falls away.

The result: on the prover's critical path, response size stops being a meaningful cost axis when the response is public.

If you haven't read our [proxy mode benchmarks](<TODO: link to Post 1>) yet, that post covers the MPC-vs-proxy tradeoff and the trust-model choice underneath it. This post picks up from there and zooms in on a single optimization that applies in both modes.

<!-- truncate -->

## TL;DR

On a 20 Mbps / 20 ms cable connection, with a partially redacted 1 KB request and a response sweeping from 1 KB to 51 KB:

|                                             | 1 KB       | 10 KB      | 51 KB      |
| ------------------------------------------- | ---------: | ---------: | ---------: |
| MPC + redact response (ZK baseline)         | 14.5 s     | 15.2 s     | 17.4 s     |
| MPC + reveal response (fast path)           | 14.5 s     | 14.5 s     | 14.6 s     |
| Proxy + redact response                     | 1.66 s     | 2.32 s     | 4.56 s     |
| **Proxy + reveal response (fast path)**     | **1.56 s** | **1.56 s** | **1.66 s** |

The fast path saves about **3 seconds on the prove phase regardless of mode**. Those 3 seconds are the cost of authenticating the response plaintext in ZK, and the fast path skips them when the response is public. Whether that 3 s is the whole runtime (proxy) or a slice of it (MPC) depends on the mode's preprocessing cost, which is dominated by upload bandwidth on cable.

## What the fast path does

Under the hood, TLSNotary proves that ciphertext observed on the wire corresponds to some plaintext the prover claims. For bytes the prover redacts, that proof is done in ZK — expensive, scales with plaintext length. For bytes the prover reveals, there is a second option: just give the verifier the symmetric key and let them decrypt.

The fast path wires up that second option for the response side. When the prover's `reveal_recv` range covers the entire response transcript, the prover reveals the server write key instead of running ZK on the response plaintext. For bytes the verifier will learn anyway, this trades the same information at dramatically lower cost.

The optimization does **not** apply when any byte of the response is private. One sensitive field, one token in a header, and the prover stays on the ZK path for the whole response.

## A note on mode and trust

Short recap from the [proxy mode post](<TODO: link to Post 1>): TLSNotary runs in two modes. In MPC mode the verifier is a pure cryptographic participant and never holds TLS ciphertext. In Proxy mode the verifier sits on the network path and sees the encrypted traffic. Both modes can produce the same attestation, but the trust story differs.

The fast path changes that story in Proxy mode specifically. If the prover hands over the server write key, the verifier (which already holds the ciphertext) can decrypt whatever slice of traffic it recorded. That is fine when the response is *intended* to be public, and not fine when it is not. The fast path is therefore best understood as "my response is already public, so let me skip paying the ZK tax on it" — not as a general speed knob. In MPC mode the same optimization is cleaner: the verifier had no ciphertext, so revealing the key is just a fast way to transmit plaintext the prover wanted to share anyway.

If you need the verifier to be forever unable to read content the prover did not explicitly authorize, the fast path is not for you. Stay on the ZK path, and consider MPC mode.

## Benchmark setup

- **Hardware:** AMD Ryzen 9 7900X (12 cores / 24 threads), 64 GB RAM, NixOS.
- **Network profile:** Cable / DSL residential — 20 Mbps symmetric, 20 ms RTT. Simulated via Linux `tc` / `iptables`.
- **Request:** 1 KB, **partially redacted** (realistic: requests carry tokens, cookies). Same for every run.
- **Response:** fully revealed (`reveal_recv = 0..len`, triggers the fast path) or partially redacted (`0..len-1`, stays on ZK path).
- **Modes:** MPC and Proxy, crossed with reveal/redact on the response.
- **Sweep:** download size 1, 2, 5, 10, 20, 30, 40, 51 KB. 10 samples per row.

The benchmark harness and the TOML config live at [`data/bench_fast_reveal_download.toml`](./data/bench_fast_reveal_download.toml). Raw data at [`data/metrics_fast_reveal_download.csv`](./data/metrics_fast_reveal_download.csv).

## Results: total runtime

[
![download sweep runtime](./data/download_light.svg#gh-light-mode-only)
![download sweep runtime](./data/download_dark.svg#gh-dark-mode-only)
](./data/download.ipynb)
*Total protocol runtime vs response size, four configurations. Cable profile, 1 KB partially redacted request.*

Four curves, and the shape that matters is the green one on the bottom: **Proxy + reveal is nearly flat across the sweep.** 1.56 s at 1 KB, 1.66 s at 51 KB — a 50× size change produces a 6% runtime change. When the response is public and you are in proxy mode, response size is no longer a first-order cost.

The other three curves tell you where that flatness comes from:

- **Proxy + redact** grows from 1.66 s to 4.56 s. Same mode, same network, same everything except the response stays on the ZK path. That extra ~3 s at 51 KB is the cost the fast path avoids.
- **MPC + redact** grows from 14.5 s to 17.4 s. Same ~3 s response-side spread, on top of an ~13 s preprocess floor that is bandwidth-bound on cable (the prover uploads ~30 MB of garbled-circuit material before the TLS handshake).
- **MPC + reveal** stays at ~14.5 s. The fast path shaves the same ~3 s off the prove phase; it is just a smaller fraction of the total because MPC preprocess dominates.

## Where the saving actually comes from

[
![prove phase breakdown](./data/prove_light.svg#gh-light-mode-only)
![prove phase breakdown](./data/prove_dark.svg#gh-dark-mode-only)
](./data/download.ipynb)
*Prove-phase time only (= total − preprocess − online). The piece the fast path targets.*

Split the total into preprocess / online / prove, and the fast path's contribution becomes crisp and mode-independent. The prove phase — where ZK authentication of the transcript happens — grows from ~0.3 s at 1 KB to ~3 s at 51 KB when the response is redacted, and stays at ~0.3 s regardless of size when the response is revealed. **MPC and Proxy collapse onto essentially the same curve.** The fast path does the same amount of work whichever mode you use; the mode only determines how visible that work is next to preprocess.

This is a useful frame for where future optimization effort lands. The fast path moved the response-side cost out of the prove phase. The remaining preprocess cost in MPC mode is a separate problem, and a bandwidth problem before it is a cryptography problem.

## When the fast path applies

The precondition is simple: every byte of the response must be revealable. In practice that is a smaller set of use cases than it sounds.

| Response shape                                          | Fast path?   | Notes                                                        |
| ------------------------------------------------------- | ------------ | ------------------------------------------------------------ |
| Public API — prices, rates, status, public feed         | Yes          | The response was public anyway; pay nothing extra            |
| Response with one sensitive field or header             | No           | Entire recv stays on ZK path; no partial fast path           |
| Response where disclosure is policy-gated per byte      | No           | Selective disclosure needs ZK                                |
| Large binary the prover can commit but not disclose     | No           | Use ciphertext commitments instead (separate path)           |

Mode selection is an orthogonal choice, covered in the [proxy mode post](<TODO: link to Post 1>). The short version: Proxy + fast path is the fastest configuration available today and appropriate when the verifier is trusted to hold (and eventually decrypt) the ciphertext it observed. MPC + fast path is the right call when the verifier must never possess ciphertext at all; you still collect the ~3 s prove-phase saving, but most of your runtime is preprocess on cable.

## Caveats and limitations

- **One network profile.** We ran cable only (20 Mbps, 20 ms). On faster uploads, MPC preprocess shrinks and the fast-path saving becomes a larger fraction of MPC total runtime.
- **One payload shape.** Request fixed at 1 KB. Real requests vary. A large public request would push the same fast-path saving up on the sent side, but requests carry tokens and cookies and rarely meet the "fully revealable" precondition.
- **51 KB ceiling.** The flat-line story extends further in principle. We cut the sweep at 51 KB to match the existing harness download-sweep configuration.
- **No proof-verification time.** We measured prover-side wall-clock and wire bytes. Verifier-side verification time is fast in both configurations but not graphed here.

## Benchmark details

- **Harness:** [`tlsn`](https://github.com/tlsnotary/tlsn) `crates/harness`, commit `<fill-me-in>`.
- **Deferred decryption:** enabled.
- **Raw data, notebooks, and regeneration script:** [`data/`](./data).
- **Network simulation:** `tc`, `iptables`, `ip` via `crates/harness/bin/runner setup`.

---

## Open questions for a follow-up

- Does the flat-line story hold at 256 KB / 1 MB response sizes? We expect yes, but the sweep stops at 51 KB.
- How does the picture change on fiber (100 Mbps, 15 ms)? MPC preprocess should drop below 3 s and the fast-path delta should dominate MPC total runtime.
- Preprocess is ~30 MB of wire traffic regardless of request/response size. Where does that budget go, and what would it take to halve it?
