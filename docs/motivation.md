---
sidebar_position: 2
---

# Motivation

:::tip TL;DR
* **Prove your data** from any website without screenshots or sharing passwords
* **Selective disclosure**: Show only what you want (balance but not transactions)
* **No permission needed**: Works with existing sites—servers don't even know it's happening
* **Built for Ethereum**: Import reputation, credentials, and private data into dApps on Day 1
:::

The internet is broken. Your data is locked in "walled gardens," and you can't prove what's yours without giving away the keys to everything.

**Data provenance** is the solution: it proves your data is real, shows where it came from, and guarantees it hasn't been tampered with. Think of it as a "digital receipt" that travels with your data.

With true data provenance, your data becomes **portable**. You control what you share and with whom. No intermediaries, no gatekeepers, no compromises.

## The Problem: TLS Keeps You Safe, But Can't Prove Your Data to Others

![](../diagrams/light/data_provenance_none.svg#gh-light-mode-only)
![](../diagrams/dark/data_provenance_none.svg#gh-dark-mode-only)

When you browse the web, **TLS** (the "lock" icon in your browser) protects your connection. It ensures that the data you receive from a server is authentic and hasn't been tampered with in transit. You can trust what you see on your screen came from the real server.

But here's the catch: **TLS only protects the conversation between you and the server**. It doesn't give you proof you can share with others.

Say Alice wants to prove her bank balance to Bob (maybe to get approved for a loan). Even though TLS guarantees the bank sent her that balance, she can't simply show Bob a screenshot: anyone can fake those. And because TLS uses "symmetric keys" (both Alice and the bank know the secret), Alice could technically fake the data herself and Bob would have no way to verify it actually came from the bank.

To solve this, you'd need **digital signatures** from the server, but servers don't do this. Even if they did, forcing Alice to share *all* her data would be a privacy nightmare. We need a way to prove data authenticity **while preserving privacy**.

## Today's "Solution": Hand Over the Keys (OAuth)

![](../diagrams/light/data_provenance_oauth.svg#gh-light-mode-only)
![](../diagrams/dark/data_provenance_oauth.svg#gh-dark-mode-only)

Right now, if Alice wants to share data from one platform with another service, she typically uses **OAuth** (think "Sign in with Google" or "Connect to Facebook"). This lets Bob's app directly access Alice's data from the original server, so the data is guaranteed to be authentic.

But there are major problems:

* **All-or-nothing access**: Most platforms don't let Alice pick and choose. She has to give Bob access to *way more* information than necessary. Want to prove you have a Twitter account? Here's your entire DM history too.

* **The platform watches everything**: The original server knows exactly what Alice is sharing and with whom. They can monitor, analyze, or even block the connection at any time.

* **Many platforms refuse to play ball**: Most services have zero incentive to let competitors access their users' data. No OAuth option means no data portability, you're stuck.

## TLSNotary: Prove Your Data Without Revealing Everything

![](../diagrams/light/data_provenance_tlsn.svg#gh-light-mode-only)
![](../diagrams/dark/data_provenance_tlsn.svg#gh-dark-mode-only)

TLSNotary solves this using clever cryptography called **multi-party computation** (MPC). Here's how it works:

Instead of Alice connecting to the server alone, **Alice and Bob work together** to manage the TLS connection. Neither one has full control: they split the cryptographic "keys" between them. This means:

* **Alice can selectively prove specific parts of her data** to Bob. Want to prove your bank balance but hide your transaction history? No problem: just reveal the balance.
* **Bob knows the data is authentic** because he participated in the TLS connection. Alice can't fake it because she never had complete control of the keys.
* **The server has no idea this is happening**. From the server's perspective, it's just a normal TLS connection. No API required, no permission needed, no modifications necessary.

It's data provenance with built-in privacy: exactly what the internet needs.

<!-- TLSNotary can also separate the TLS-MPC verification from the data verification. When an independent **Notary** handles the TLS verification, the user receives signed, or notarized, data from the notary, which she can store or carry around. This equates to full data portability. It is worth noting that in this setup, Bob (the data verifier) needs to trust the notary. -->

## TLSNotary is a Growth Accelerator for the Ethereum ecosystem

* **Unlocking the "Private Data" Ocean**: Ethereum is the ultimate "Trust Machine," but it currently runs primarily on public data. TLSNotary provides "super-fuel" by unlocking the 99% of world data currently hidden in "walled gardens" (bank records, social graphs, and identity), enabling a massive new class of useful applications.
* **Battling "Enshittification" via Portability**: It restores market pressure by enabling a Permissionless Exit. If users can leave a platform while taking their data and reputation with them to an Ethereum alternative, the "walled gardens" lose their monopoly power.
* **Solving the Cold Start Problem**: New dApps no longer have to start from zero. They can build on the "data capital" of incumbents, allowing users to import a 10-year reputation or credit history onto Ethereum on Day 1.
* **Scaling without Permission or Censorship**: It allows Ethereum to scale into real-world use cases without needing "API blessings" or permission from corporate gatekeepers.
* **Selective Disclosure**: TLSNotary ensures this new "private fuel" doesn't leak. By using zero-knowledge proofs, users stay in total control over what specific facts are shared and what raw data remains private.

[Read more](/blog/2026/01/01/do-not-pass-go)

## Make your data portable with TLSNotary!

TLSNotary is a solution designed to prove the authenticity of data while preserving user privacy. It unlocks a variety of new use cases. So, if you're looking for a way to make your data portable without compromising on privacy, TLSNotary is developed for you!

Dive into the protocol and integrate it into your applications. We eagerly await your feedback on [Discord](https://discord.com/invite/9XwESXtcN7).
