---
sidebar_position: 1
sidebar_label: Rust
---
# Rust Quick Start

This quick start demonstrates how to use TLSNotary with Rust code.

## Requirements

Before we start, make sure you have cloned the `tlsn` repository and have a recent version of Rust installed.

1. Clone the `tlsn` repository (defaults to the `main` branch, which points to the latest release):
    ```shell
    git clone https://github.com/tlsnotary/tlsn.git
    ```
2. If you don't have Rust installed yet, you can install it using [rustup](https://rustup.rs/). If your Rust version is outdated, update it with `rustup update stable`.

## Basic Verifier: Verifying Data from an API in Rust {#basic}

![](../../diagrams/light/overview_prover_verifier.svg#gh-light-mode-only)
![](../../diagrams/dark/overview_prover_verifier.svg#gh-dark-mode-only)

This example demonstrates how to use TLSNotary in a simple session between a Prover and a Verifier. It involves the Verifier first verifying the MPC-TLS session and then confirming the correctness of the data.

Follow the instructions from:
https://github.com/tlsnotary/tlsn/tree/main/crates/examples/basic#readme

## Simple Attestation Example: Attesting and Verifying Data from an API in Rust {#attestation}

![](../../diagrams/light/overview_notary.svg#gh-light-mode-only)
![](../../diagrams/dark/overview_notary.svg#gh-dark-mode-only)

TLSNotary also supports a workflow where a Verifier (acting as Attestor) attests to the proven data. The Prover can then generate a presentation of this attested data, which can be verified by anyone who trusts the Attestor.

Follow the instructions from:
https://github.com/tlsnotary/tlsn/tree/main/crates/examples/attestation#readme

## Zero-Knowledge Age Verification Example {#basic-zk}

This example demonstrates **privacy-preserving age verification** using TLSNotary and zero-knowledge proofs. It allows a prover to demonstrate they are 18+ years old without revealing their actual birth date or any other personal information. The ZK proof is generated using [Noir](https://noir-lang.org/).

Follow the instructions from:
https://github.com/tlsnotary/tlsn/tree/main/crates/examples/basic_zk#readme

🍾 Great job! You have successfully used TLSNotary in Rust.
