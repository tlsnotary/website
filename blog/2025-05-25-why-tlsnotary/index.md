---
title: Why TLSNotary?
description: TLSNotary kickstarted the zkTLS movement. Here's why we built it—and where we're going next.
---

# Why TLSNotary?

TLSNotary is the pioneer of zkTLS. The original idea was proposed by Dan from our team all the way back in 2013—on a Bitcoin forum, before Ethereum even existed ([bitcointalk.org](https://bitcointalk.org/index.php?topic=173220.0)).

Inspired by the work of Deco, Sinu teamed up with Dan to build a new version of TLSNotary with support from the Ethereum Foundation, as part of the [Privacy & Scaling Explorations (PSE)](https://pse.dev/) team.

The result is a robust, open-source implementation of zkTLS that has kickstarted a whole new space in the industry—one that makes it possible to prove and verify things about **web data** without giving up **privacy**, **censorship resistance**, or **security**.


<!-- truncate -->

## Why We Built TLSNotary

Today’s blockchain oracles mainly serve public data. But what about **private data**?

TLSNotary makes it possible to bring **zero-knowledge proofs of private web data** on-chain. In doing so, it enables a new class of applications and solves one of the biggest remaining challenges in the space: **trustlessly proving off-chain data**.

In other words: we want to **bring web proofs into the mainstream**, with strong privacy guarantees and clear trust assumptions.

We're not alone in this vision. Several startups have emerged in the zkTLS space—some using TLSNotary directly, others building or using other protocols. That’s a clear signal the idea has real product-market fit. We’re not doing this alone. We actively collaborate with protocol, tooling, and application teams across the ecosystem. We all benefit if the space becomes more open, more performant, more trustworthy and more interoperable.

TLSNotary isn’t just for on-chain use cases. In fact, in Web2 applications, it requires **no external trust assumptions** at all. You only need to trust the data source and your own infrastructure—**not** the user or any third parties. TLSNotary gives you **cryptographic guarantees** that the revealed data is authentic.

## Values That Guide Us

TLSNotary is neutral, open-source, and built to be a public good. We don’t pick winners. Anyone can use the tools we build.

We’re guided by the following values:

- **Censorship resistance**  
- **Privacy**
- **Security**
- **Open source**

We're building infrastructure that benefits everyone—by making zkTLS more **interoperable**, **transparent**, and **performant**. That’s good for the ecosystem, and most importantly, for users.

Because let’s be honest: in a space like zkTLS, **security theatre** is a real risk. Users must be able to verify that their data is handled securely, and that applications aren’t leaking private information under the hood.

TLSNotary is built with Ethereum's **subtractive mindset** in mind: do less, trust less, and rely on cryptographic truth.

It's not just a tool—we believe it's foundational infrastructure for the next wave of Ethereum applications that need access to web data without compromising on core values.

## The Hard Path Is Worth It

Some teams have taken performance shortcuts—central proxies, TEE protocols with unclear guarantees, or designs that break geo-redundancy and decentralization.

We chose a different route, with a cryptographic solution: **MPC-TLS**.

It’s not the easiest solution, but it is:

- **Censorship-resistant** (the server doesn’t even know TLSNotary is being used)
- **Transparent** (clear trust assumptions)
- **Flexible** (usable for both off-chain and on-chain verification)

And now, thanks to recent work—including the QuickSilver merge—we’ve made it **fast** enough for real-world use.

## Why Cryptographic Guarantees Matter

In the rush to get zkTLS products to users, some teams have adopted centralized proxies or TEEs. These solutions can work—but they often introduce new trust assumptions.

We believe users deserve stronger guarantees. TLSNotary relies on **cryptography, not trust**, to ensure:

- **The server remains unaware** it’s part of a notarization.
- **No central proxy can censor or surveil** the data.
- **No TEE attestation loophole** can compromise integrity.

MPC-TLS is more complex, but it gives users what blockchains were meant to offer: **trustlessness**, **privacy**, and **verifiability**.

## Why Continue Investing in TLSNotary?

We’ve now proven the core protocol works. The space is growing. But right now, it’s still too easy to take shortcuts—and too hard to build privacy-preserving zkTLS apps the right way.

That’s why we continue to invest in TLSNotary:

- Provide the **reference implementation** that others build on.
- Keep the **ecosystem open** by discouraging platform lock-in.
- Ensure a **privacy- and security-first alternative** stays viable.
- Offer the tools, docs, and plugins to make it **easy to adopt**.

If we want zkTLS to stay aligned with Ethereum’s values, TLSNotary needs to remain at the heart of the ecosystem.

The next major step is **usability**. That’s why we’re building a **plugin system** to make it easy for developers to integrate TLSNotary into their apps without needing to understand all the cryptographic internals.

We'll cover that in an upcoming blog post.

---

> **TLSNotary's value proposition:**  
> Share web data—without compromising on censorship resistance, decentralization, privacy, or security.

> **Unique selling points:**  
> Public good. Clean code. Written in Rust. Safe, secure, and soon to be audited. Neutral by design.