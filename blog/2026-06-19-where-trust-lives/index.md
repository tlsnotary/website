---
title: "Where does your trust live? Cryptographic soundness and the TEE trade"
authors: [heeckhau]
description: "Moving a web proof from zkTLS to a TEE keeps the same on-chain result and can even raise the integrity bar. The honest question is privacy: is the guarantee rooted in cryptographic soundness, or in a signature from a chip?"
---

import Figure from '@site/src/components/Figure';

Web proofs let a user prove a real-world fact (a bank balance, a payment, an identity) to an app that otherwise has no way to trust it. Each one rests on a guarantee: that the data is genuine, and that the user's secrets stayed private. That guarantee can be rooted in very different places.

[Peer](https://docs.peer.xyz), a noncustodial fiat-to-crypto protocol and a prominent production zkTLS application, just moved its payment verification to a TEE running in AWS Nitro Enclaves. The reason is speed: in their words, from about thirty seconds down to under a second. That is a real win, and [Sachin's public write-up](https://x.com/0xSachinK/status/2062860592906731888) is candid about the reasoning behind it.

To be clear, we are not neutral: we think zkTLS is the stronger approach and would like to see Peer keep it. For some applications the TEE trade is a defensible call. Either way, web proofs never remove trust; they relocate it. A TEE moves it onto a chip and the vendor that attests to it, but the user's privacy now rests on that attestation rather than on cryptography.

<!-- truncate -->

A web proof makes **two** promises, not one, and they come apart the moment zkTLS is swapped for a TEE:

- **Integrity** (*did this payment really happen?*): both designs end at a delegated attestor's signature that a smart contract checks, and a TEE can make that signature *harder* to forge. This is **not** where the disagreement is.
- **Privacy** (*who gets to see the user's secrets?*): with zkTLS the user's credential only ever reaches the server it logs into, kept confidential by **cryptography**; with a TEE it is decrypted inside someone else's hardware, kept confidential by a second **signature**, the enclave's attestation.

Switching to a TEE improves integrity while replacing a cryptographic privacy guarantee with an attestation-based one.

## Integrity: both roads end at a signature

Start with what does not change. zkTLS, TLSNotary included, is **designated-verifier**: a proof convinces only the party that took part in the session, and a smart contract cannot be that party. So on-chain there is always a trusted attestor that signs a statement in lieu of a proof, and the contract checks the signature. (We unpack why an in-session witness is unavoidable in a [companion post](/blog/2026/06/17/public-verifiability).)

So if a payment releases funds on a signature, the user is trusting that attestor, whether the box behind it runs MPC, a proxy, or an enclave. That is why Peer's integrity argument is convincing. Their old system was proxy zkTLS with a **single attestor**: Peer alone held the signing key, and one compromised operator could sign off on a payment that never happened. Inside an enclave, the key is released only to code AWS attests, so forging an attestation now means subverting AWS itself, its keys or its isolation, not just compromising one operator. Sachin describes this as the anchor moving *"from 'an operator is honest' to 'this exact code ran in isolated hardware.'"* We would put it more plainly: it moves from Peer to AWS, a far better-resourced and more accountable custodian. On **integrity**, that is a real upgrade.

The tradeoff appears on the other axis.

## Privacy: where the plaintext goes

In the proxy-zkTLS flow Peer used to run, the user's device holds the TLS session. The credential goes only where it always would, to the server it logs into, and the attestor sees only ciphertext. The device decrypts the response locally and proves it held the right payment detail. Only that proof crosses to the verifier, revealing only what is necessary while the rest of the response never leaves the user's device. That is **selective disclosure**, the core privacy primitive of this field.

In the TEE flow, the PeerAuth extension reads the user's live session token and **encrypts it to the enclave's public key**. The enclave makes the request itself, sees the full plaintext response, and emits the attestation. The credential and the response now exist in the clear inside a machine the operator runs. In that flow, selective disclosure is gone: the enclave sees everything, and the user trusts it to emit only the attestation and forget the rest.

<Figure
  src={require('./light/plaintext_boundary.svg').default}
  darkSrc={require('./dark/plaintext_boundary.svg').default}
  caption="Where the plaintext lives. In zkTLS the credential only ever reaches the server it logs into, and just a selective-disclosure proof crosses to the verifier. In the TEE flow the credential crosses into the operator's enclave and is decrypted there, so its confidentiality now rests on an attestation. Both rows end at the same signed attestation; what differs is what crossed the boundary to produce it."
  width={760}
/>

Peer's own description is fair: nothing is stored, the credential lives in memory for about a second, and only the attestation leaves. Their conclusion is that *"the privacy guarantees are identical to zkTLS, with better UX."* On a day when everything works exactly as designed, that may be true. Our objection is to the word *identical*, because the **basis** of the guarantee changed:

> With zkTLS, the confidentiality of the user's credential is **structural**: a fact about *where the computation happened* (the user's device) and *what left it* (a proof). With a TEE it is **contingent on a signature**: an attestation saying the code that saw the plaintext was the published code, running in hardware that promises not to leak it. Even when the integrity is identical, that is a weaker kind of guarantee.

A cryptographic guarantee holds regardless of whether the operator is honest or the vendor was compelled. An attestation-backed one holds *as long as the attestation means what it appears to mean*. Those are reasonable things to believe. They are not the same kind of thing as "no third party ever saw the user's credential."

And the difference stays invisible until it doesn't. A forged payment would be bad, but that is the integrity failure everyone guards against, and the TEE makes it harder. The privacy downgrade opens a quieter one: a **stolen credential**. The attestation document tells the user's client which key to encrypt the credential to. If an attacker can forge that document, binding a key *the attacker* controls to the expected measurement, the victim's client encrypts straight to the attacker. The signature verifies, so nothing looks wrong: the attack is silent, targetable at one user, and invisible to the victim. The credential was encrypted perfectly, to the wrong party.

## Can you check it yourself?

To their credit, Peer ships an npm package, [`@zkp2p/zkp2p-attestation`](https://www.npmjs.com/package/@zkp2p/zkp2p-attestation), that lets a client fetch the attestation, verify AWS's Nitro signature chain, and check the measurement *before* handing over anything sensitive. The correct pattern is **attest, then encrypt**: verify the binding first, because a public key is just bytes, and an *unattested* one could be decrypting the credential outside any enclave at all.

But notice the limits of that check. It answers "am I talking to a genuine enclave running the expected measurement?" It does not answer:

1. **A measurement is a hash, not a meaning.** Matching PCR `abc123` tells a verifier the *expected* image loaded, not that `abc123` is the *honest* code. Establishing that requires the source, a reproducible build, and a matching hash. Peer says they will open-source it; as of writing, that has not shipped.
2. **Someone has to run the check.** On a phone, the thing verifying the attestation is the client Peer ships. It can verify diligently or skip verification, and the user cannot tell from the outside.
3. **AWS is the root, unconditionally.** The chain ends at AWS's keys, and "the host cannot read enclave memory" is AWS's word. Whoever holds that key can be compelled to use it and legally barred from disclosing it, and there would be no way to tell, because the signature would verify like any other.

None of these make the design bad. They show where the trust actually lives.

## The upgrade was not the hardware

The upgrade is real, but it is worth being precise about what produced it, because it was not the silicon. It is tempting to argue about whether the enclave can be broken, but the strength of the design does not turn on that. Even if the hardware is perfect, what a verifier checks is still a **signature**: does this attestation chain to a key it trusts? The enclave's only job is to keep that key secret, so the guarantee is only ever as strong as the key's custody, and the custodian sits *outside* the enclave by construction. Which TEE, Intel SGX or AWS Nitro, makes no difference to that basic structure. The trust in Peer has not vanished; it moved to AWS, which is the **same kind** of trust: a secret key held by someone else, just in more capable hands.

<Figure
  src={require('./light/three_anchors.svg').default}
  darkSrc={require('./dark/three_anchors.svg').default}
  caption="Three places a guarantee can anchor. Peer's move on both axes: integrity from 1 to 2 (an upgrade), privacy from 3 to 2 (a downgrade). Anchors 1 and 2 are the same kind of trust, a secret someone else holds. Anchor 3 is different: there is no secret to hold."
  width={760}
/>

That is the difference cryptography makes. In a soundness-rooted design the user's plaintext never left their device, so there is no key whose compromise hands over their data, because there is nothing to redirect: no operator to trust, no measurement to map to source, no vendor at the root. The accurate pitch for a TEE is "stronger than trusting one operator's word," not "as good as cryptographic soundness."

## The trade may not be necessary

The obvious rebuttal is that cryptography is too slow. But thirty seconds came from an older proxy implementation, not from where zkTLS sits today: TLSNotary's proxy mode already runs in under two seconds ([latest benchmarks](https://tlsnotary.org/blog/2026/05/10/blog-proxy-mode)). A sub-second enclave is still faster, but that is nothing like thirty to one, and for the use case Peer is built around, payment verification, a second or two is a small price for a guarantee rooted in cryptographic soundness rather than a signature.

And the gap keeps closing: [SpeakUp](https://privacy-ethereum.github.io/speakup/), a VOLE-based zkVM built for phones and browsers, makes selective disclosure fast and flexible: it proves arbitrary logic, much like a program running in a TEE, but keeps the secrets on the prover's side, the very thing a TEE gives up.

So the choice is rarely "TEE or cryptography" in the first place. When latency genuinely is the binding constraint and the stakes are low, a well-built TEE like Peer's can be a reasonable call.

## You can have both

<Figure
  src={require('./why_not_both.jpg').default}
  caption="Privacy from cryptography, or integrity from hardware? Why not both: run the zkTLS verifier inside the enclave, and the user's plaintext still never leaves their device."
  width={300}
/>

What actually did the work in Peer's integrity win? The signing key was bound to attested code, so the operator could not unilaterally sign a session that never happened. That works without giving up any privacy: run the zkTLS verifier *inside* the enclave. It still sees only ciphertext, because the prover decrypts on-device and proves in zero-knowledge. Integrity anchored in a TEE, privacy still on the user's device.

This was never really speed versus soundness: a TEE can bound the attestor while the cryptography keeps the user's plaintext on their device. The two compose, so when the privacy stakes rise, the cryptographic path is right there when it is needed. That combination is what we hope more teams will ship.
