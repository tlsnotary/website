---
title: "Zero-knowledge ≠ trustless: what \"publicly verifiable\" means for zkTLS"
authors: [heeckhau]
description: "A zkTLS proof isn't trustless math anyone can check on their own. It's a notarized attestation, and \"publicly verifiable\" means verifiable by anyone who trusts the notary. Here is why a witness is unavoidable, and what the words actually mean."
---

import Figure from '@site/src/components/Figure';

There's a common misconception that a zkTLS proof works like a zkSNARK on a blockchain: a self-contained Zero Knowledge Proof that anyone, anywhere, can verify, with no trust in anyone. You generate it, you publish it, the world checks it. Forever.

Unfortunately, that is **not** how zkTLS works, and it is a common source of confusion. This post is about what "publicly verifiable" actually means for a zkTLS proof, whom you're trusting when you check one, and why that turns out to be a feature rather than a flaw.

<!-- truncate -->

The one line to keep in your head:

> A zkTLS proof isn't checked by the world. It's checked by whoever trusts the verifier that witnessed it.

## You can't prove a TLS session by yourself

A screenshot of your bank balance proves nothing. You could have edited it, and everyone knows it, which is why no one accepts screenshots anymore as proof of anything that matters.

TLS has the same problem, for a precise reason. In a TLS session the client and the server share the same symmetric key, and that key is what "authenticates" the data. TLS guarantees authenticity *only to the two parties in the connection*. As the client, you hold the very key the server used, so you can produce a transcript that says whatever you like, and the server never signed the bytes to prove otherwise. A TLS session you ran by yourself is exactly as convincing as a screenshot: not at all.

So if you want to convince someone else that a website really told you something, you need a second party in the session **while it happens**: a witness. And here is the part that trips people up: you cannot add that witness after the fact. Once the session is over, there is nothing left to anchor a proof to. No amount of clever cryptography applied afterward can manufacture trust in a moment that no one witnessed.

<Figure
  src={require('./light/witness_needed.svg').default}
  darkSrc={require('./dark/witness_needed.svg').default}
  caption="A TLS session you ran alone is forgeable: you hold the same key the server used, so the transcript proves nothing, like a screenshot (left). Add a second party as a witness *during* the session and the result becomes provable (right)."
  width={720}
/>

This is also why "serverless zkTLS, entirely in your browser, no third party" cannot convince anyone of anything. With no second party in the session, there is simply nothing for the rest of us to believe.

Cryptographers have a precise name for this shape: zkTLS is a **designated-verifier** protocol. The proof convinces *only* the party that took part in the session. The reason is subtle but important: because the verifier participates, it *could* have collaborated with the prover to fabricate the entire exchange. If you are the verifier, you know you didn't, so the proof is ironclad to you. Anyone else has no way to rule out that collusion, so to them the proof is only as good as their trust that the verifier played fair. Every zkTLS protocol today is designated-verifier in this way.

That one property drives everything below: to convince *yourself*, be the verifier; to convince *anyone else*, they have to trust whoever the verifier was.

## So who is the witness? It depends on who needs convincing

The witness, the party in the session, is called the **verifier**. In TLSNotary it's either an *MPC-TLS verifier* or a *proxy verifier* depending on the mode, but in both modes it has to be online during the session. The only real question is: who plays that role?

| Who needs convincing, and can they be in the session? | Who is the verifier | What you trust |
|---|---|---|
| Just you, online during the session | you are the verifier | nobody |
| Anyone who can't be in the session: offline, asynchronous, or many at once | a delegated verifier (a **notary**) | the notary |

If you are the one who needs convincing and you can be online, you're done. You run the verifier yourself, you participate in the session, and you trust no one: the cryptography guarantees the prover cannot lie to you.

<Figure
  src={require('./light/self_verify.svg').default}
  darkSrc={require('./dark/self_verify.svg').default}
  caption="You're online and the only one who needs convincing: run the verifier yourself and trust no one. The live connection to the server is made by you (MPC mode) or by the verifier (proxy mode)."
  width={420}
/>

But a lot of real use cases are the other kind, where whoever needs convincing *can't* be in the session:

- The party who needs convincing often isn't around when the session happens. A smart contract can't co-run a TLS handshake. A backend wants to check the result tomorrow. A reviewer looks at it next week.
- Or there are many parties who each want to check the same result. They can't all be in the session at once.

In both cases someone has to play the verifier *during* the session on everyone else's behalf. That stand-in is a **notary**.

## Most of the confusion is terminology

Most of the confusion around zkTLS is really *terminology* confusion, and two words do most of the damage. If any of this tripped you up, that's on the words, not on you.

The first word is **"proof."** What you walk away with is usually not a self-contained proof at all. It's an **attestation**: a statement *signed* by whoever witnessed the session. (Sometimes a genuine zero-knowledge proof is layered on top, which we get to below.)

The second word is **"verifier,"** which gets stretched across two completely different jobs:

| Role | What it checks | When | Who can do it | Trust cost |
|---|---|---|---|---|
| **Verifier** (MPC-TLS or proxy) | the live session | during | one party, online | nothing (you can trust yourself) |
| **Notary** | the live session | during | a delegated stand-in | trust the notary |
| **Attestation verifier** | the notary's attestation | afterward | anyone, anywhere, anytime | inherits the notary's trust |

Two facts make this much clearer than the single word "verifier" ever does:

1. **A notary is just a verifier you didn't run yourself.** It is not a special authority bolted onto the protocol. It is the same in-the-session role, performed by a third party because you couldn't be there (the wider zkTLS ecosystem often calls this role an **attestor**, same thing). And thanks to the multi-party computation, the notary does this **without ever seeing your data in the clear**: it vouches that the session was real with a particular server while staying blind to the contents.
2. **The notary's output is an attestation**, a signed statement along the lines of: *"I was in a genuine TLS session with server X; here are cryptographic commitments to what was exchanged."* Anyone who later receives that attestation can check it. We'll call them the **attestation verifier**, and there can be as many of them as you like.

<Figure
  src={require('./light/delegated_verifier.svg').default}
  darkSrc={require('./dark/delegated_verifier.svg').default}
  caption="A notary (a delegated verifier) produces an attestation, which any number of attestation verifiers can check afterward. The notary is in the room; the attestation verifiers read the document. The live TLS connection is made by the prover (MPC mode) or by the notary (proxy mode)."
  width={700}
/>

The chain is now unambiguous: a **notary** (a delegated verifier) produces an **attestation**, which any number of **attestation verifiers** check afterward. Notice the seat-swap against the first diagram: the in-session role that *you* filled when you verified for yourself is exactly the role the notary fills here. Nothing new was added to the protocol; the role was simply handed to someone else.

## Where the zero-knowledge actually lives

So where does the "zk" come in? It does real work, just not the work a lot of people assume.

Zero-knowledge in zkTLS does **two** things. It proves that **whatever you do reveal faithfully matches what was committed during the session**: you can't disclose a doctored excerpt. And it lets the prover **reveal only part** of the data and keep the rest hidden: show the balance without the account number, prove you're over 18 without your birth date. Both are pure cryptography; neither needs trust.

What zero-knowledge *cannot* do is convince a non-participant that the session it all hangs from was real in the first place. That the notary truly witnessed a genuine TLS connection with the claimed server, and didn't quietly collude with the prover to invent it, is not something math can prove to an outsider. That is the designated-verifier gap, and it rests on trusting the notary.

So the honest split isn't "privacy vs. everything else." It's three layers:

| What you're relying on | Provided by | Trust required |
|---|---|---|
| Only part of the data is revealed | zero-knowledge / selective disclosure | none (pure math) |
| What's revealed matches the witnessed session | zero-knowledge | none (pure math) |
| The session was genuinely witnessed at all | the verifier / notary in the session | the notary, if delegated |

This inverts the usual intuition. In zkTLS your **privacy is cryptographic**, and so is the **integrity of what you disclose**: the notary stays mathematically blind, and the prover can't fake an excerpt. The one thing that *isn't* cryptographic, the one thing an outsider has to take on trust, is that the witness was honest. People expect the trust to live in the data; it actually lives in the witness. (It's also why a TEE-based attestor that *sees* your data and signs for it offers the same trust-in-the-witness but strictly weaker privacy: its confidentiality is contingent on a signature, not on math.)

> Zero-knowledge keeps your data private and your disclosures honest. It still can't vouch for a session that no trustworthy party witnessed.

## So, can anyone verify a zkTLS proof?

Now we can answer it precisely: yes, and no; the gap between the two is the whole point.

**Yes:** anyone can be an attestation verifier. Hand the attestation to a thousand people and all thousand can check it: produce once, show to anyone, indefinitely. That part is genuinely public.

**No:** that check only means something if you trust the notary that made the attestation. For there to be an attestation at all, a verifier had to be in the session, and if that verifier wasn't you (it can't be; you weren't there), it was a notary you are trusting.

So "publicly verifiable" and "trustless" pull in opposite directions. The very thing that makes a proof checkable by everyone (delegating the in-session role so the result becomes portable) is the thing that introduces the notary. You don't get public verifiability and zero trust at the same time; you get public verifiability *because* you accepted a notary.

> **"But zkTLS proofs verify on-chain!"** A smart contract can't take part in a TLS session, and a designated-verifier proof means nothing to a non-participant, so on-chain there is always a **signature standing in for a proof**. Everything the contract does is *downstream of the notary's signature*: the chain verifies that signature, and any logic built on top of it, but it does not, and cannot, re-witness the session. The trust in the notary didn't go away; it's just expressed as a trusted public key.

## Minimizing the trust you took on

The honest move isn't to pretend the trust disappeared. It's to name it, and then shrink it. Once delegation is unavoidable, you have a dial:

- **Run the verifier yourself.** No notary, no third-party trust. Best when you're the only one who needs convincing and you can be online. Not portable to anyone else.
- **One reputable notary.** Simple and portable. Everyone downstream trusts that one operator.
- **Multiple independent notaries (M-of-N).** Require separately signed attestations from several independent notaries and accept the result only if enough of them agree. Each notary signs on its own, which rules out collusion between the prover and any single notary: a malicious prover would have to corrupt a whole quorum. Note this is *not* the same as splitting the notary role *itself* across several parties with MPC, so that no single machine ever sees the data or can sign alone. That would be stronger still (there would be no single notary to trust), but a multi-party MPC notary is not yet practical.
- **On-chain, economically-secured notaries.** Notaries that stake collateral and can be slashed for misbehavior, turning "trust the operator" into "trust the incentives." This is the most trust-minimized end of the dial. It isn't something TLSNotary ships itself; it's what ecosystem projects build *on top of* zkTLS (for example Opacity Labs, via restaking).

This is also why TLSNotary, by itself, does not solve the [oracle problem](/docs/faq#does-tlsnotary-solve-the-oracle-problem). A notary is a trusted party, and bringing data on-chain through a single trusted party inherits that trust. zkTLS doesn't dissolve the trusted party: it makes it explicit, swappable, and shrinkable. For high-stakes data, combine it with the trust-minimizing options above, or with a dedicated oracle protocol.

## The bottom line

A zkTLS proof is not trustless math that the whole world checks unconditionally. It's a notarized attestation. Anyone can be an attestation verifier, but the attestation only exists because a verifier was in the session, and unless that verifier was you, it was a notary you trust.

So when you build with zkTLS, the real design question isn't "is it publicly verifiable?" It's **who needs convincing, and can they be in the session?** Are you the only one who needs convincing, and can you be online? Run the verifier yourself. Is the result for a contract, a backend, or the public? Then you're delegating to a notary, so decide how much you trust it and how many you require. That choice is your trust model. Make it on purpose.

For the mechanics underneath all this, see [TLS verification with a general-purpose Notary](/docs/intro#tls-verification-with-a-general-purpose-notary) and the FAQ entries on [why TLSNotary needs an online verifier](/docs/faq#why-does-tlsnotary-need-an-online-verifier-cant-this-be-done-serverlessly-in-the-browser-with-zero-knowledge) and [why a verifier can trust a TLSNotary proof](/docs/faq#why-can-a-verifier-trust-a-tlsnotary-proof). For the trade-off in the in-session role itself, see the [proxy mode post](/blog/2026/04/22/proxy-mode).