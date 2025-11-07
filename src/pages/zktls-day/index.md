---
title: zkTLS Day at Devconnect 2025
description: Join us for a full day of talks, demos, and hands-on workshops on zero knowledge TLS
slug: /zktls-day
hide_table_of_contents: true
keywords:
  - zkTLS
  - TLSNotary
  - Devconnect
  - Ethereum
  - zero knowledge proofs
image: /img/zktls-day-og.png
---

# zkTLS Day at Devconnect 2025

**¿Dónde están las pruebas?**  
Right here! 🔥 Come to zkTLS day to learn how TLS becomes privately verifiable.

**Date**: November 19, 2025  
**Location**: Ceibo Room, La Rural, Buenos Aires 🇦🇷  
**Part of**: [Devconnect 2025](https://devconnect.org/calendar)  
**[Tickets](https://devconnect.org/calendar?event=zktls-day)** 

A full day dedicated to learn about zkTLS.

Whether you are deep into zk tooling or just curious about the emerging zkTLS standard, this event brings together builders, researchers, and integrators to explore what zkTLS makes possible.

---

## Overview

zkTLS is **transformative technology** that's reshaping what we can do with our data on the internet. Imagine proving your bank balance, or GitHub contributions **without revealing the actual data** or needing cooperation from the service provider. That's the power of zkTLS!

🎯 **Two tracks, infinite possibilities:**

* **🧠 Main Track** - Dive deep with technical talks from the teams **building the future**. From protocol fundamentals to cutting-edge implementations, you'll hear directly from the pioneers who are making zkTLS a reality.

* **🧪 Workshop Track** - **Get your hands dirty!** No waiting, no tickets required. Just walk in and start building. Try multiple zkTLS implementations, complete challenges, and walk away with practical knowledge (plus maybe some swag 😉).

## 🧠 Main Track

Our speaker lineup represents the absolute cutting edge of zkTLS research and development:

🔹 **Protocol deep-dives**: Understand the cryptographic magic that makes zkTLS possible  
🔹 **Live demos**: See real applications proving private data right before your eyes  
🔹 **Ethereum integration**: Discover how zkTLS is unlocking new DeFi and identity primitives  
🔹 **Developer tools**: Get hands-on with the SDKs and frameworks that will power tomorrow's apps  

**Featuring the teams that are defining the space:** vlayer, Primus Labs, Reclaim Protocol, and TLSNotary.

🎟️ **Tickets** https://devconnect.org/calendar?event=zktls-day

## 🧪 Workshop Room

We have set up a **hands-on workshop space** where you can try multiple zkTLS implementations in practice.

The workshops run in parallel to the main track. You can walk in anytime and try different zkTLS flows at your own pace (around 15 minutes per tutorial, with optional advanced challenges). No ticket is required -- first come, first served.

The workshops start after their introduction in the main track at 11 and continue until 17:00.

You might even earn a POAP or some swag 🙂

The tutorials are organized by: [vlayer](https://www.vlayer.xyz/), [Primus Labs](https://primuslabs.xyz/), [Reclaim](https://reclaimprotocol.org/) and [TLSNotary](/)

## Agenda

Talks will take place in the main stage room from **10:00 to 17:00**. 

| Time        | Main Track                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Workshop Room              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 09:30–10:00 | Doors open                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |                            |
| 10:00–10:10 | Welcome                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                            |
| 10:10–10:50 | [zkTLS fundamentals](#zktls-fundamentals-thomas-tlsnotary) (Thomas, TLSNotary)                                                                                                                                                                                                                                                                                                                                                                                               |                            |
| 10:50–11:00 | Workshops pitch                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Workshop teams pitch       |
| 11:00–11:35 | [Building Online Trust, On-Chain](#building-online-trust-on-chain-maciek-kalka-vlayer) (Maciek Kalka, vlayer)                                                                                                                                                                                                                                                                                                                                                                | Workshops open             |
| 11:35–12:10 | [Cryptography of zkTLS](#cryptography-of-zktls-xiang-xie-primus-labs) (Xiang Xie, Primus Labs)                                                                                                                                                                                                                                                                                                                                                                               | Workshops continue         |
| 12:10–13:30 | Lunch break                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | No lunch break, open lab 🙂 |
| 13:30–14:05 | [zkTLS for developers](#zktls-for-developers-maddy-reclaim-protocol) (Maddy, Reclaim Protocol)                                                                                                                                                                                                                                                                                                                                                                               | Workshops continue         |
| 14:05–15:10 | [Use case demos Part 1](#use-case-demos-part-1)<br/>• [Kofi (cr3dentials.xyz)](#trustless-verification-for-financial-institutions-kofi-cr3dentialsxyz)<br/>• [Dimitris Mouris (Nillion)](#tlshare-verifiable-inputs-for-private-computation-dimitris-mouris-nilion)<br/>• [Mikhail (Bring ID)](#proof-of-humanity-from-web-accounts-mikhail-bring-id)<br/>• [Sachin (zkp2p)](#fast-permissionless-on-and-offramping-sachin-zkp2p)                                            | Workshops continue         |
| 15:10–15:25 | Break                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Workshops continue         |
| 15:25–16:30 | [Use case demos Part 2](#use-case-demos-part-2)<br/>• [Luís Freitas (MCPay)](#verifiable-micropayments-for-api-data-luís-freitas-mcpay)<br/>• [Michael Dong (Brevis)](#infofi-without-doxxing-the-first-zktls-and-zkvm-powered-social-leaderboard-michael-dong-brevis)<br/>• [Mehdi Rhouzlane (Stormbit Labs)](#web2-backed-on-chain-credit-mehdi-rhouzlane-stormbit-labs)<br/>• [Ryan (Usher Labs)](#verity-trust-minimized-data-flows-for-smart-contracts-ryan-usher-labs) | Workshops continue         |
| 16:30–17:00 | [The future of zkTLS](#the-future-of-zktls)                                                                                                                                                                                                                                                                                                                                                                                                                                  | Workshops continue         |

## Talk details

### zkTLS fundamentals (Thomas, TLSNotary)
Start your zkTLS journey with a foundational session led by Thomas, a key contributor to EF's TLSNotary project.
This talk traces the evolution of zkTLS and breaks down its core concepts, from proofs vs. attestations to the trade-offs between TEE-, proxy-, and MPC-based approaches.
You’ll learn how different trust models, privacy techniques, and verification methods shape the landscape of zkTLS, and gain a clear understanding of the performance and security considerations behind each design.

### Building Online Trust, On-Chain (Maciek Kalka, vlayer)
Join Maciej from vlayer for a deep dive into how zkTLS web proofs can power Ethereum ecosystem. This session explores the emerging design space of on-chain attestations - from cryptographic verification and the oracle problem to evolving trust assumptions in decentralized systems. Drawing on lessons from building zk tooling and infrastructure for practical web proofs, Maciej will highlight the promising directions for verifiable web data - and the approaches intentionally left behind along the way.

### Cryptography of zkTLS (Xiang Xie, Primus Labs)
Dive into the cryptographic foundations that make zkTLS possible with Xiang Xie, one of the leading minds behind protocols like Ferret, QuickSilver, and modern advances in Oblivious Transfer and Garbled Circuits.
This session will unpack the building blocks and explore how these primitives power practical, privacy-preserving zkTLS.
Whether you’re a cryptography enthusiast or a developer curious about the math behind zkTLS, this talk will illuminate how cutting-edge research translates into real-world privacy infrastructure.

### zkTLS for developers (Maddy, Reclaim Protocol)
Gain a developer’s perspective on bringing zkTLS from theory to production with Madhavan Malolan, founder of Reclaim Protocol.
This session distills hard-won insights from real integrations : from reverse-engineering APIs and handling data formats like HTML and JSON, to managing redaction, compatibility across platforms, and legal or UX considerations.
A practical deep dive into what it really takes to build privacy-preserving applications powered by zkTLS.

### Use case demos Part 1

#### Trustless Verification for Financial Institutions (Kofi, cr3dentials.xyz)

Cr3dentials is a privacy preserving verification platform that helps lenders, fintechs, and payment companies perform income verification, KYC/identity checks, and lending risk assessments from any online source across banking platforms, freelance, creator, crypto, and more without storing user data. It uses zkTLS proofs to turn digital financial activity into trusted credentials, helping institutions mitigate counterparty risk, reduce fraud, and enable faster lending and financial access across the global digital economy.

#### TLShare: Verifiable Inputs for Private Computation (Dimitris Mouris, Nilion)
TLShare extends zkTLS to enable verifiable, provenance-attested data to be securely imported into multiparty computation (MPC) and fully homomorphic encryption (FHE) workflows. It allows multiple clients to use authentic TLS-sourced data (e.g., from banks, exchanges, etc.) in privacy-preserving analytics, as well as AI model inference and training. Developed jointly by Nillion and Primus Labs, TLShare bridges the gap between verifiable web data and downstream private computation. The talk will also introduce tickr.app, a production deployment showcasing privacy-preserving computation on zkTLS-extracted data using trusted execution environments (TEEs).

#### Proof of Humanity from Web Accounts (Mikhail, Bring ID)

Bring ID uses MPC-TLS to privately verify online activity — for example, confirming a user has completed at least one Uber trip — as a basis for proof of personhood. Built with TLSNotary, it achieves more efficient, privacy-preserving, and trustworthy Sybil-resistance across blockchain ecosystems.

#### Fast, Permissionless On and Offramping (Sachin, zkp2p)

zkp2p enables instant, trust-minimized crypto onramps and offramps across Base, Arbitrum, Solana, Hyperliquid, and Ethereum — completing transfers in under 60 seconds. Built with Reclaim and Primus Labs, it delivers a seamless UX for users moving between fiat and crypto without intermediaries.

### Use case demos Part 2

####  Verifiable Micropayments for API Data (Luís Freitas, MCPay)
MCPay uses zkTLS to prove that API responses received after a micropayment are authentic and untampered, enabling agents and AI models to trust the data they purchase. Built with vlayer, it explores the intersection of verifiable payments and trustworthy data exchange, tackling challenges around proof latency and low-cost transactions.

#### InfoFi without Doxxing: The first ZKTLS and ZKVM Powered Social Leaderboard (Michael Dong, Brevis)
Brevis combines zkTLS for verifiable Web2 data with a high-performance zkVM (Pico) to privately compute eligibility for incentive programs. In the Brevis Yapper Leaderboard on Kaito, users prove social identity and on-chain behavior without exposing wallets or trusting operators — enabling rewards and multipliers based on verified credentials, fully private end-to-end.

#### Web2-Backed On-Chain Credit (Mehdi Rhouzlane, Stormbit Labs)

Stormbit Labs integrates zkTLS into its modular fixed-rate lending protocol, allowing users to prove Web2 credentials or financial data to unlock on-chain credit. Built with Primus Labs and Reclaim, it bridges traditional finance and DeFi while focusing on improving proof speed, efficiency, and TEE security.

#### Verity: Trust-Minimized Data Flows for Smart Contracts (Ryan, Usher Labs)
Usher Labs' Verity zkTLS stack enables trust-minimised data flows between traditional systems and blockchains. Integrate private or restricted data from any trusted API into your Smart Contracts. Building on TLSNotary, RiscZero, and the Internet Computer, the Verity stack provides a full-stack framework to extract, transform, and load data into blockchains with end-to-end verifiability. Think "zkRollup of TLS attestations".

### The future of zkTLS
Panel discussion about what is next, and how to get involved.