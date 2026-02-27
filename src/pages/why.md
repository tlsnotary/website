---
title: Why TLSNotary
---

:::tip TL;DR

* **Prove your data** from any website without screenshots or sharing passwords
* **Selective disclosure**: Show only what you want (balance but not transactions)
* **No permission needed**: Works with existing sites — servers don't even know it's happening

:::

## The problem

The internet is broken. Your data is locked in walled gardens, and you can't prove what's yours without giving away the keys to everything.

When you browse the web, **TLS** (the lock icon in your browser) protects your connection. It ensures that the data you receive from a server is authentic and hasn't been tampered with in transit.

But TLS only protects the conversation between you and the server. It doesn't give you proof you can share with others. Anyone can fake a screenshot, and because TLS uses symmetric keys, the user could technically forge data — so a third party has no way to verify it actually came from the server.

![](../../diagrams/light/data_provenance_none.svg#gh-light-mode-only)
![](../../diagrams/dark/data_provenance_none.svg#gh-dark-mode-only)

## Today's workaround: OAuth

The current solution is **OAuth** ("Sign in with Google"). This lets a third-party app access your data directly from the server, guaranteeing authenticity. But it has major problems:

* **All-or-nothing access** — most platforms don't let you pick and choose what to share.
* **The platform watches everything** — the server knows exactly what you're sharing and with whom.
* **Many platforms refuse to play ball** — most services have zero incentive to let competitors access their users' data.

![](../../diagrams/light/data_provenance_oauth.svg#gh-light-mode-only)
![](../../diagrams/dark/data_provenance_oauth.svg#gh-dark-mode-only)

## The solution: TLSNotary

TLSNotary uses **multi-party computation (MPC)** to split the TLS cryptographic keys between the user and a verifier. This means:

* **Selective disclosure** — prove your bank balance but hide your transaction history.
* **Verifiable authenticity** — the verifier participated in the TLS connection, so the user can't fake it.
* **No server changes** — from the server's perspective, it's just a normal TLS connection. No API required, no permission needed.

![](../../diagrams/light/data_provenance_tlsn.svg#gh-light-mode-only)
![](../../diagrams/dark/data_provenance_tlsn.svg#gh-dark-mode-only)

## Why it matters

True **data provenance** — proving your data is real, where it came from, and that it hasn't been tampered with — makes your data **portable**. You control what you share and with whom. No intermediaries, no gatekeepers.

This unlocks a massive new class of applications:

* **Data portability** — break free from walled gardens while keeping your data, reputation, and history.
* **Permissionless access** — no need for API blessings or cooperation from corporate gatekeepers.
* **Privacy-preserving proofs** — use zero-knowledge proofs to prove facts about your data without revealing the data itself.

:::tip Further reading
For a deep dive into why data provenance matters and how TLSNotary fits into the bigger picture, read our blog post: **[do not pass "Go"](/blog/2026/01/01/do-not-pass-go)**.
:::

## Get started

Ready to build? Check out the [Quick Start](/docs/quick_start) or explore the full [Documentation](/docs/intro).

Questions? Join us on [Discord](https://discord.com/invite/9XwESXtcN7).
