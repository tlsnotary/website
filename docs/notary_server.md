---
sidebar_position: 4
sidebar_label: Notary server
unlisted: true
---

# Notary Server (Deprecated)

:::danger

The Notary server was **removed** from the TLSNotary project in [alpha.13](https://github.com/tlsnotary/tlsn/releases/tag/v0.1.0-alpha.13). The project's scope was narrowed to focus on the core TLSNotary libraries and the upcoming SDK.

The `notary.pse.dev` hosted server and its WebSocket proxy have been **shut down**.

:::

## What Should I Use Instead?

- **Browser extension users:** Use the [Verifier Server](/docs/extension/verifier), which includes a [built-in WebSocket proxy](/docs/extension/verifier#built-in-websocket-proxy).
- **Rust users:** See the [Quick Start](/docs/quick_start/rust) examples for Prover-Verifier workflows that don't require a notary server.

## Legacy Documentation

For users who have forked and maintain their own notary server, the original source code and documentation are available at:

- [Notary server source code (v0.1.0-alpha.12)](https://github.com/tlsnotary/tlsn/tree/v0.1.0-alpha.12/crates/notary/server)
- [alpha.13 release notes](https://github.com/tlsnotary/tlsn/releases/tag/v0.1.0-alpha.13) explaining the removal
