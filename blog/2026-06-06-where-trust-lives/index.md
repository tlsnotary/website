---
title: "Where does your trust live? Cryptographic soundness and the TEE trade"
# authors: [sinu, heeckhau]
description: "Moving a web proof from zkTLS to a TEE keeps the same on-chain result, and can even raise the integrity bar. The honest question is privacy: do you trust a guarantee rooted in mathematics, or one rooted in a signature from a chip?"
---

import Figure from '@site/src/components/Figure';

Web proofs opened up a whole class of applications: proving your bank balance, your income, a payment, or your identity to an app that otherwise has no way to trust it. And across all of them, the number one feature request is always the same, speed. As our recent posts on [proxy-mode benchmarks](https://tlsnotary.org/blog/2026/05/10/blog-proxy-mode) and the [full-reveal fast path](https://tlsnotary.org/blog/2026/05/19/fast-reveal) keep showing, users do not want to wait for a proof.

One application we are genuinely fans of is [Peer](https://docs.peer.xyz), a noncustodial fiat-to-crypto protocol. They just announced moving their payment verification from zkTLS to a TEE, running inside AWS Nitro Enclaves, and the reason is unsurprisingly "speed": in their words, from about thirty seconds down to under a second. That is a real win, so it is worth looking honestly at what the move buys and what it costs.

None of this is an attack on Peer; we want them to win. The point is more general. Any system that proves "this web data is real" has to root that promise somewhere, and swapping the technology underneath rarely removes the trust. It relocates it. So the real question is never trust versus no trust. It is where the trust now lives, and whether you can still see it from there. That is what this post is about.

<!-- truncate -->

Peer's Sachin wrote up the reasoning in a clear, public [post](https://x.com/0xSachinK/status/2062860592906731888), and explaining the trade in public is the honest thing to do. So we will engage it on the merits. The argument here is not that the hardware can be broken; it is that even when the hardware works exactly as designed, the guarantee still comes down to a signature.

## TL;DR

- This is **not an integrity argument**. On-chain, both approaches end at the same signed attestation, and against a single attestor a TEE can even *raise* the integrity bar.
- It is a **privacy argument**, and a change of *basis*. With zkTLS your credential never leaves your device; only a proof does. With a TEE your credential leaves your device and is decrypted inside someone else's hardware, and the promise it stays private rests on a **signature**, not on mathematics.
- And the failure is **silent**: a forged attestation verifies exactly like a real one, so the guarantee can break with **no way for a user to detect it**. That distinction is invisible when everything works and decisive when it does not.

## Both roads end at a signature

Start with the thing that does not change. zkTLS, TLSNotary included, is a **designated-verifier** technology: the proof convinces only the party that took part in the session, and a smart contract cannot be that party. So on-chain there is always a trusted attestor that signs a statement in lieu of a proof, and the contract checks the signature. (We unpack why an in-session witness is unavoidable, and what "publicly verifiable" really means, in a [companion post](/blog/2026/06/05/public-verifiability).)

The upshot for us is simple: if your funds release on an attestor's signature, you are trusting that attestor, whether the box behind it runs MPC, a proxy, or an enclave. Which is exactly why Peer's integrity argument lands. Their prior production system was proxy-based zkTLS with a **single attestor**, and a single attestor that is compromised or colluding can sign off on a payment that never happened. Move the signing key inside a Nitro Enclave, wrap it under a KMS policy that only releases it to an enclave whose measured identity matches the published build, and now forging an attestation means breaking the hardware's isolation or subverting KMS, not just leaning on one server. As Sachin puts it, *"the trust anchor moves from 'an operator is honest' to 'this exact code ran in isolated hardware.'"*

That is a real improvement over trusting an operator's word, and we are not going to pretend otherwise. Hold onto that phrase, *the trust anchor moves*, because the rest of this post is about reading the fine print on where it moves to.

## So what actually changed? Where the plaintext goes

Here is the difference that matters, and it is almost geometric.

In the proxy-zkTLS flow Peer used to run, the buyer's device holds the TLS session. The witness proxy sees only ciphertext. The buyer decrypts *on their own machine*, generates a proof that the response contained the right payment detail, and the attestor signs off on that proof. The sensitive bytes (the session token, the full bank response) **never leave the user's device** in the clear. What leaves is a proof, and the user chooses exactly which bytes it reveals. That last part has a name: selective disclosure. It is the core privacy primitive of this entire field.

In the TEE flow, the PeerAuth extension reads your live session token and **encrypts it to the enclave's public key**. The enclave then makes the authenticated request itself, sees the full plaintext response, checks it, and emits the attestation. The credential and the response now exist, in the clear, inside a machine the operator runs. Selective disclosure is gone: the enclave sees everything, and you trust it to emit only the attestation and forget the rest.

<Figure
  src={require('./light/plaintext_boundary.svg').default}
  darkSrc={require('./dark/plaintext_boundary.svg').default}
  caption="Where your plaintext lives. In zkTLS it never leaves your device; only a selective-disclosure proof crosses the boundary. In TEE-TLS your credential crosses into the operator's enclave and is decrypted there, and its confidentiality now rests on an attestation, not on the geometry. Both rows end at the same signed attestation; what differs is what crossed the boundary to produce it."
  width={760}
/>

So the plaintext crossed a boundary it never used to cross. That is the whole ballgame.

## Identical, until it is not

This is where the honest disagreement lives, and both sides are describing the *same facts*.

Peer's case is strong on its own terms: nothing is stored, the enclave boots from a read-only image, the credential lives in memory for about a second and is wiped, and the only thing that leaves is the attestation. Sachin's conclusion: *"the privacy guarantees are identical to zkTLS, with better UX."* In good faith, operationally, on a day when everything works exactly as designed, that is a fair description.

Our objection is not to any of those facts. It is to the word *identical*. This is not about the attestor's signature the contract checks — both designs share that one, and the TEE strengthens it. It is about a second signature only the TEE flow introduces, the one your client must trust *before handing over your credential*, and it quietly swaps the **basis** of the privacy guarantee:

> With zkTLS, the confidentiality of your credential is **structural and cryptographic**: it is a fact about *where the computation happened* (your device) and *what mathematically left it* (a proof). With a TEE, the confidentiality is **contingent on a signature**: an attestation that says "the code that saw your plaintext was the published code, running in isolated hardware that promises not to leak it." Strictly speaking, that is weaker, even when the integrity is the same.

A cryptographic guarantee holds whether or not the operator is honest, whether or not the hardware vendor was compelled, whether or not there is a bug you did not find. An attestation-backed guarantee holds *as long as the attestation means what you think it means*, as long as the measured code is bug-free, the isolation is real, the vendor's keys are clean, and the enclave actually does what its source says. Those are reasonable things to believe. They are not the same kind of thing as "the plaintext never left your phone."

The point is narrower than wrongdoing: the *shape* of the guarantee changed, from one that cannot fail in these ways to one that, in principle, could. And that kind of difference stays invisible right up until the day it matters.

What does that day look like? Not a forged payment — a stolen credential. The attestation document is what tells your client *which public key to encrypt your credential to*. Forge that document, binding a key *you* control to the expected measurement, and the victim's client encrypts its credential straight to you. The signature verifies, so nothing looks wrong: the attack is silent, targetable at individual users, and invisible to the victim. The credential was encrypted perfectly, to the wrong party. This is why "contingent on a signature" is not a figure of speech: the confidentiality of your data is exactly as good as the secrecy of a key you will never see.

## Can you check it yourself?

Peer deserves real credit here, because they did not hand-wave this. They ship an npm package, [`@zkp2p/zkp2p-attestation`](https://www.npmjs.com/package/@zkp2p/zkp2p-attestation), that lets a client fetch the enclave's attestation document, verify AWS's Nitro signature chain, and check the PCR measurements and signer. That is genuinely more than most TEE deployments offer, and it is the right instinct.

Crucially, the check happens *before* you hand over anything sensitive. The correct pattern is *attest, then encrypt*: the client asks the enclave for an attestation over a fresh nonce; that signed document binds the enclave's public key to its measurement; the client verifies the AWS chain, the measurement, and the nonce; and only *then* encrypts the credential to the key the attestation vouched for. The intuition that "it is encrypted, so it is fine" is exactly wrong: a public key is just bytes, and an *unattested* one could have its private half sitting in ordinary server memory, decrypting your credential outside any enclave at all. The safety comes from verifying the binding first, not from the encryption.

So yes, you can check beforehand. But notice what that check does and does not settle. It answers "am I talking to a genuine enclave running the expected measurement?" It does not answer the next three questions, and on an actual phone this is where it bottoms out:

1. **A measurement is a hash, not a meaning.** Verifying that the running enclave matches PCR `abc123` tells you the *expected* image is loaded. To know `abc123` is the *honest* code (the code that wipes your token and emits nothing else), you have to obtain the enclave source, build it reproducibly, and get the same hash. Peer says they *will* open-source the attestation service so anyone can do this; as of writing, that has not shipped. So today you can confirm "an enclave matching Peer's published measurement ran," but you are still trusting Peer's claim about what that measurement *is*.
2. **Someone has to actually run the check.** On mobile or in a browser, the thing fetching the attestation and comparing the measurement is the client Peer ships. A client can verify diligently or skip it, and the user cannot tell from the outside. Independent verification means an independently built client pinning an independently audited measurement.
3. **AWS is the root, unconditionally.** The signature chains to AWS's attestation keys, and the "host cannot read enclave memory" property is AWS's design and AWS's word. You are trusting a single vendor that operates the hardware and holds the root key, and whoever holds that key can be compelled to use it: a lawful order could require the vendor to vouch for a key the requester controls, with a gag order keeping it quiet. You would have no way to tell, because the signature would verify like any other, the same silent failure as before, reached through a courtroom rather than an exploit.

None of these make the design bad. They locate it. The verifiable part is real; the part you still take on faith is real too.

## Three anchors

Sachin's framing is the right one, *the trust anchor moves*, so let's just finish the sentence. There are three places a guarantee can anchor, and they are not equivalent:

1. **Someone's word.** An operator promises. Simplest, weakest.
2. **Someone's hardware.** A TEE binds the promise to an attested measurement. Stronger, but conditional on a hardware vendor, a measurement you can map to source, and isolation that holds.
3. **The structure itself.** The property holds by construction, whoever ran what: there is no operator to trust, no measurement to map, no vendor at the root.

<Figure
  src={require('./light/three_anchors.svg').default}
  darkSrc={require('./dark/three_anchors.svg').default}
  caption="Three places a guarantee can anchor, with Peer's move drawn on both axes: integrity moves from 1 to 2, an upgrade; privacy moves from 3 to 2, a downgrade. Anchors 1 and 2 are the same kind of trust, a secret someone else holds. Anchor 3 is a different kind: there is no secret to hold."
  width={760}
/>

The catch, and the reason this post exists, is that a web proof is not one guarantee. It is two, and they anchor independently. On **integrity** (did this payment really happen?), everything on-chain anchors at 1 or 2 today, our own proofs included: zkTLS is designated-verifier, so the contract checks an attestor's signature either way. On that axis Peer's move is a clean upgrade, from 1 to 2. But on **privacy** (who saw your credential?), the move ran the other direction: from 3, plaintext that structurally never left your device, down to 2, an enclave you trust to forget it. Up the ladder on integrity, down it on privacy. That asymmetry is why TLSNotary defaults to [MPC-TLS](/docs/protocol/mpc-tls/) and treats every step away from it, including our own [proxy mode](https://tlsnotary.org/blog/2026/04/22/proxy-mode), as a *named, legible* trade rather than a free lunch.

But push on anchor 2 and it leans closer to anchor 1 than it first appears. Strip away the silicon and what a verifier actually checks is a *signature*: does this attestation chain to a key I trust? The hardware's real job is to keep that key secret, so the guarantee is only ever as strong as the key's custody, and the custodian sits *outside* the enclave's protection by construction. For Peer that custodian is AWS, which operates both the Nitro attestation root and the KMS that releases the signing key. An unbreakable enclave and an unforgeable attestation are not the same thing.

That is the difference anchor 3 makes. Mathematics has no key whose compromise hands over your data, because in a soundness-rooted design your plaintext never left your device, so there is nothing to redirect. Anchor 2 is a real upgrade over anchor 1: it moves the trust to a far better-resourced custodian. But it is the *same kind* of trust, a secret key kept by someone else, not the different kind that math provides. The honest pitch for a TEE is "stronger than trusting one operator's word," not "as good as math."

## How fast is fast enough?

The usual, fair rebuttal at this point is: *math is great, but it is too slow on a phone, which is the whole reason we reached for hardware.* But that carries a hidden assumption, that faster is always better. Speed has a "good enough" point, and the question worth asking is not "how fast can we go" but "are we already fast enough, and what are we paying for the rest?"

Thirty seconds was genuinely too long, and no one should defend it. But that figure comes from an older proxy implementation, not from where cryptographic zkTLS sits today: TLSNotary's current proxy mode already runs in low single-digit seconds (around 1.6s in our [latest benchmarks](https://tlsnotary.org/blog/2026/05/10/blog-proxy-mode)). A sub-second enclave is still faster, but the distance is a long way from thirty-to-one. And a few seconds is fine for most flows, especially the ones that matter: someone moving money, proving income for a loan, or settling a trade will gladly wait five seconds for a guarantee rooted in mathematics. The hunger for sub-second speed is sharpest in casual, high-frequency, low-stakes interactions, which is exactly where giving up privacy costs the least. So speed and privacy usually point the same way: when the stakes are high enough to want the stronger guarantee, they are high enough that a short wait is no objection.

And the gap keeps closing from the cryptographic side. [SpeakUp](https://privacy-ethereum.github.io/speakup/) is a VOLE-based zkVM built specifically for proving on resource-constrained devices (phones and browsers), trading larger proofs for minimal work on the prover. It is privacy-first and post-quantum by construction. The point, for this discussion, is that it pushes general-purpose **selective disclosure back onto the user's own device**: prove an arbitrary property of your transcript, reveal nothing else, keep the plaintext where it started. That is the exact privacy property the TEE path gives up, recovered without sending your credential anywhere. We will not oversell it: SpeakUp is interactive, so it lives in the same designated-verifier world described above. It makes client-side privacy fast; making proofs publicly verifiable on-chain is the harder frontier, still open research, and we are working on it.

So the honest first question is not "TEE or cryptography," it is "do we even need to make this trade?" Increasingly, the answer is no.

When raw latency really is the binding constraint and the stakes are genuinely low, a well-built TEE deployment like Peer's might be a reasonable call. We would only ask one thing of anyone making that trade: name it. Say "we relocated the privacy guarantee from your device to attested hardware, and here is the vendor, the measurement, and the verification tooling you can check." Peer, to their credit, did. The failure mode is not choosing a TEE; it is letting users believe "verified" means cryptography when it means a signature from a chip.

## You can have both

Notice what actually did the work in Peer's integrity win. It was not that the enclave saw your data. It was that the signing key was bound to attested code, so the operator could not sign a session that never happened. You can get that without giving up any privacy.

Run the zkTLS verifier *inside* the enclave. It still sees only ciphertext, because the prover decrypts on-device and proves in zero-knowledge, so your plaintext never leaves your device and the privacy stays structural. The enclave's only job is to stop the operator from signing whatever it likes. That is a TEE used as an integrity bound on top of cryptographic privacy, rather than a replacement for it: integrity anchored at 2, privacy at 3. It is close to what TLSNotary already supports through a notary that carries a [TEE attestation of its own code](/docs/protocol/custom_extension).

It does not make the result trustless. You still trust the vendor for the verifier's integrity, and on-chain it is still a signature. But it buys the integrity Peer is after without moving your credential into someone else's hardware.

So when the privacy stakes rise, the cryptographic path is right there, for Peer too. TLSNotary is already one of the primitives in their stack. The deeper point is that this was never really speed versus soundness: a TEE can bound the attestor while the cryptography keeps your plaintext on your device. We are rooting for everyone shipping this. We just want the trust to live somewhere you can see it.

<!--
DRAFT NOTES (remove before publishing)
- BYLINE: currently commented out / undecided. Sibling post #62 (public-verifiability) is authored by heeckhau.
- STYLE: em-dash-free, to match the public-verifiability post's house style.
- COORDINATION: the designated-verifier explainer is compressed and cross-links the companion post (/blog/2026/06/05/public-verifiability, PR #62). Confirm that post's final slug/date before publishing; #62 is dated 2026-06-05 so it should publish first.
- FIGURES: plaintext_boundary (where the plaintext lives) + three_anchors. Both hand-authored light/dark SVGs.
- VERIFIED: ~30s -> <300ms / "100x" (Sachin article + @peerxyz, Jun 3 2026). npm @zkp2p/zkp2p-attestation v1.4.0 live (2026-06-05). zkp2p org has NO public Nitro enclave-source repo yet (only legacy proxy/witness forks); re-check before publish in case they push it.
- DROPPED: the unverified "$35M+ volume" figure (not in Sachin's article). Legal/liability angle explored then dropped at author's request.
- DELIBERATELY did NOT lean on the SGX side-channel litany (Sachin pre-rebutted; Nitro != SGX). Kept only honest residuals.
- FAIRNESS: integrity framed as an upgrade-over-single-attestor, not a downgrade. If Peer ships open-source reproducible builds, soften point 1 under "Can you check it yourself?" and add the link.
-->
