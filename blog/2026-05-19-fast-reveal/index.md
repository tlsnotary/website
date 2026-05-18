---
title: "The full-reveal fast path: when response size stops mattering"
authors: [heeckhau]
draft: true
---

Users want their apps to be fast and don't like waiting for proofs. So "make TLSNotary faster" has been the number one request since forever. We've answered it by picking the fastest crypto we can find (without compromising on security) and trimming overhead out of the implementation release after release.

When the situation allows, we can do even more: things like deferred decryption and the **full-reveal fast path**. The full-reveal fast path has been available [since alpha.13](https://github.com/tlsnotary/tlsn/releases/tag/v0.1.0-alpha.13) ([PR #1010](https://github.com/tlsnotary/tlsn/pull/1010)), but we've never really explained what it does or measured what it buys you. This post fixes that.

<!-- truncate -->

## TL;DR

If the response is sharable in full, the prover skips ZK-proving it. Response size stops mattering.

## What is "Full-reveal" exactly?

In a default TLSNotary session, the ZK circuit proves: "I know a plaintext and a key, such that decrypting the ciphertext you observed under that key yields that plaintext." The session key stays private to the prover, and the verifier learns only the bytes the prover chose to reveal. That zero-knowledge property has a cost.

The "Full-reveal" fast path drops the circuit. When the prover plans to reveal an entire direction (request or response) anyway, TLSNotary just hands over the corresponding write key, and the verifier decrypts the ciphertext locally. The optimization kicks in **automatically**: unlike deferred decryption, there's no flag to toggle.

Can the prover fake the key? No. The ZK proof of TLS key derivation always runs, anchoring the disclosed key to the prover's private master secret and the recorded handshake. The fast path only skips the ciphertext-plaintext proof.

Requests routinely carry secrets like authentication headers and session cookies, so the sent side typically stays on the ZK path. Responses are often something the prover is happy to share in full: an API result, a text message, a bank balance. In that common case, the prover redacts a few request bytes, reveals the response, and the response-side cost drops to a constant. Exactly what the benchmarks below show.

The fast path is all-or-nothing per direction. A single private byte means the prover pays the full per-byte cost for what gets revealed. So if you have one sensitive field, one token in a header, you're back on the ZK path.

## Benchmark setup

- **Hardware:** AMD Ryzen 9 7900X (12 cores / 24 threads), 64 GB RAM, Linux.
- **Build:** TLSNotary [`tlsn`](https://github.com/tlsnotary/tlsn) `crates/harness`, on a Proxy-mode preview branch (pre-alpha.15).
- **Request:** 1 KB, **partially redacted**. Same for every run.
- **Response:** fully revealed (`reveal_recv = 0..len`, triggers the fast path) or partially redacted (`0..len-1`, stays on the ZK path).
- **Modes:** MPC and Proxy, crossed with reveal/redact on the response.
- **Deferred decryption:** enabled.
- **TCP_NODELAY:** enabled.
- **Samples:** 10 per row; charts show means.

Raw data, notebooks, and regeneration scripts: [`data/`](https://github.com/tlsnotary/website/tree/master/blog/2026-05-19-fast-reveal/data), including [`bench_fast_reveal_download.toml`](https://github.com/tlsnotary/website/blob/master/blog/2026-05-19-fast-reveal/data/bench_fast_reveal_download.toml) and [`metrics_fast_reveal_download.csv`](https://github.com/tlsnotary/website/blob/master/blog/2026-05-19-fast-reveal/data/metrics_fast_reveal_download.csv).

## Benchmarks

### Total runtime

[
![download sweep runtime](./data/download_light.svg#gh-light-mode-only)
![download sweep runtime](./data/download_dark.svg#gh-dark-mode-only)
](https://github.com/tlsnotary/website/blob/master/blog/2026-05-19-fast-reveal/data/download.ipynb)

*Total protocol runtime vs response size, four configurations. Cable profile, 1 KB partially redacted request.*

Four curves, two stories. In both modes, the **reveal** curve (fast path) is essentially flat across the sweep. A 50× change in response size produces only a few percent change in runtime:

- **MPC + reveal** stays at ~14.5 s from 1 KB to 51 KB.
- **Proxy + reveal** stays at ~1.6 s from 1 KB to 51 KB.

The **redact** curves grow with response size, and they grow by the same ~3 s at 51 KB because the response-side ZK work the prover adds is the same in either mode:

- **MPC + redact** grows from 14.5 s to 17.4 s.
- **Proxy + redact** grows from 1.66 s to 4.56 s.

That shared ~3 s spread is what the fast path skips, in both modes. The baseline difference comes from elsewhere: MPC sits on top of an ~13 s preprocess floor that's bandwidth-bound on cable (the prover uploads ~30 MB of garbled-circuit material before the TLS handshake); Proxy doesn't need that material at all.

### Where the saving comes from

[
![prove phase breakdown](./data/prove_light.svg#gh-light-mode-only)
![prove phase breakdown](./data/prove_dark.svg#gh-dark-mode-only)
](https://github.com/tlsnotary/website/blob/master/blog/2026-05-19-fast-reveal/data/download.ipynb)

*Prove-phase time only (= total − preprocess − online). The piece the fast path targets.*

Split the total into preprocess / online / prove, and the fast path's contribution becomes mode-independent. The prove phase (where ZK authentication of the transcript happens) grows from ~0.3 s at 1 KB to ~3 s at 51 KB when the response is redacted, and stays at ~0.3 s regardless of size when the response is revealed. **MPC and Proxy collapse onto essentially the same curve.** The fast path does the same amount of work whichever mode you use; the mode only determines how visible that work is next to preprocess.

## Conclusions

For the common shape of "request has secrets, response is sharable in full," the fast path turns the response into a flat cost on the prover's side. The same ~3 s of ZK work disappears in either mode, automatically, regardless of how large the response gets.

The optimization has been live since alpha.13. If your application matches the pattern (and many do), it's already on. No configuration to set, no trust trade-off to weigh, no mode switch to make.

Bigger responses, same proving cost. Your users wait less.
