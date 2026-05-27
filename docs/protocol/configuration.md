---
sidebar_position: 7
---
# Configuration

This page documents the configuration options exposed by the core TLSNotary protocol crates. The SDK re-exports these settings — sometimes with its own defaults — and tools built on top of it (such as the browser extension) inherit that surface. Refer to the SDK and tool-specific documentation for the user-facing options.

The protocol supports two modes, **MPC** and **Proxy**, with very different configuration surfaces.

## Mode-independent configuration

These configurations apply regardless of the mode.

### `TlsClientConfig`

Configures the TLS client that the `Prover` runs.

| Field          | Required | Description                                                                                                              |
|----------------|----------|--------------------------------------------------------------------------------------------------------------------------|
| `server_name`  | yes      | The DNS name (or IP) of the server.                                                                                      |
| `root_store`   | yes      | Root certificates used to verify the server certificate chain.                                                           |
| `client_auth`  | no       | Optional certificate chain and private key for TLS client authentication (mutual TLS, mTLS).                             |

### `VerifierConfig`

Configures what the `Verifier` accepts during the TLS handshake.

| Field        | Required | Description                                                                       |
|--------------|----------|-----------------------------------------------------------------------------------|
| `root_store` | yes      | Root certificates the `Verifier` will accept when validating the server's chain.  |

### `ProveConfig`

Built against a finished transcript, controls what the `Prover` discloses to the `Verifier` during the proving phase.

| Field                | Description                                                                                           |
|----------------------|-------------------------------------------------------------------------------------------------------|
| `server_identity`    | Whether to reveal the configured `server_name` to the `Verifier`.                                     |
| `reveal`             | Byte ranges of the sent and received transcript to reveal.                                            |
| `transcript_commit`  | Configuration of the transcript commitments (see [Commit Strategy](./commit_strategy.md)).            |

By default, no ranges are revealed and the server identity is hidden (see [Server Identity Privacy](./server_identity_privacy.md)).

## MPC mode (`MpcTlsConfig`)

In MPC mode the `Prover` and `Verifier` jointly run the TLS protocol over MPC. Resources for the MPC computation must be allocated up front, so the session is bounded by data limits configured in advance.

### Data and record limits

| Field                       | Required | Default                                | Description                                                                                                                                                            |
|-----------------------------|----------|----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `max_sent_data`             | yes      | —                                      | Maximum bytes the `Prover` may send to the server during the session.                                                                                                  |
| `max_recv_data`             | yes      | —                                      | Maximum bytes the `Prover` may receive from the server during the session.                                                                                             |
| `max_recv_data_online`      | no       | 32                                     | Of the received bytes, how many may be decrypted **while the TLS connection is active**. Must be `≤ max_recv_data`.                                                    |
| `max_sent_records`          | no       | Derived from `max_sent_data`           | Maximum number of TLS records (≤ 16KB each) the `Prover` may send.                                                                                                     |
| `max_recv_records_online`   | no       | Derived from `max_recv_data_online`    | Maximum number of received TLS records decrypted online.                                                                                                               |

Each of these sets a hard cap: exceeding it aborts the session. The record-count fields exist because TLS data is framed into records, and the MPC layer must reserve resources per record as well as per byte. The defaults are derived heuristically from the data limits and rarely need to be set explicitly.

The relationship between `max_recv_data` and `max_recv_data_online` is explained under [Online vs deferred decryption](#online-vs-deferred-decryption).

### Deferred decryption

| Field                          | Default | Description                                                                                                                                                   |
|--------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defer_decryption_from_start`  | `true`  | If `true`, application-data decryption is deferred until after the TLS connection closes; if `false`, decryption runs online via MPC from the first byte. |

With deferred decryption enabled, received bytes are buffered as ciphertext and decrypted by the `Prover` locally after the connection closes. `max_recv_data_online` is a preprocessing budget for the few bytes that still need online decryption: TLS protocol messages (Finished, alerts). The default of 32 bytes covers this; raise it only if the `Prover` needs to read application data mid-session. See [Online vs deferred decryption](#online-vs-deferred-decryption).

`defer_decryption_from_start` sets the initial mode. The protocol also exposes a [`ProverControl`](https://github.com/tlsnotary/tlsn/blob/main/crates/tlsn/src/prover/control.rs) handle that lets the application toggle online decryption mid-session. This is useful when only a specific window of the response needs to be inspected online. Picking the exact toggle point is currently up to the consumer.

### Network setting

| Field      | Variants                | Default    | Description                                                                                                                            |
|------------|-------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `network`  | `Bandwidth`, `Latency`  | `Latency`  | Tunes the sub-protocols (notably the PRF) for either fewer round-trips at the cost of more bytes, or lower bandwidth at more RTTs.     |

Keep the default `Latency` for typical connections. Switch to `Bandwidth` only on links that are both high-bandwidth and high-latency.

### Online vs deferred decryption

Sizing the split between `max_recv_data_online` and `max_recv_data` is easier once you separate the two roles these limits play:

**As DoS protection.** Every limit bounds what a malicious `Prover` can force the `Verifier` to do. The `Verifier` decides how much it is willing to spend on a session and refuses anything that exceeds those caps.

**As an MPC preprocessing budget.** The MPC layer needs to pre-generate cryptographic material proportional to the amount of data the session will handle. Larger limits mean more preprocessing time and bandwidth before the TLS connection even opens.

The three data limits play these roles differently:

- **`max_sent_data`**: drives MPC preprocessing for encryption. All bytes the `Prover` sends must be encrypted under MPC during the live connection (the server is waiting), so there is no "free" tier here.
- **`max_recv_data_online`**: drives MPC preprocessing for decryption. Bytes counted here are decrypted via MPC while the TLS connection is active.
- **`max_recv_data`**: the total receive cap. The portion above `max_recv_data_online` is **not** decrypted via MPC; instead, after the TLS connection closes, the `Verifier` reveals its share of the server's keys to the `Prover`, who then decrypts the buffered ciphertext locally. This is **deferred decryption**, and it is essentially free in MPC terms.

Deferred decryption is safe because revealing the key share only happens *after* the TLS connection has been authenticated and closed: the `Prover` can no longer forge anything the server would have accepted, and the ciphertext-plus-MAC is already committed.

#### Why have any online decryption at all?

Two reasons:

1. **TLS protocol traffic.** A small amount of received protocol data (Finished messages, alerts, etc.) must be decrypted online for the handshake to complete. The defaults reserve room for this.
2. **In-session logic.** If the application reads part of the response before it knows what to send next (e.g., extract a CSRF token, follow a redirect, paginate based on a cursor in the body), those bytes must be decrypted online. Set `max_recv_data_online` to cover the parts of the response your client actually inspects mid-session.

#### What changes when `defer_decryption_from_start = false`

When deferred decryption is disabled from the start, all received bytes are decrypted online via MPC. In this mode you'll typically want `max_recv_data_online = max_recv_data`; otherwise the session aborts mid-stream as soon as more bytes are received than the online budget allows. Preprocessing cost grows with the full receive limit. Only disable deferred decryption if your specific use case requires it. Online MPC decryption is slow, and on large responses the TLS connection can stay open long enough for the server to time it out.

### Sizing guidance

A quick checklist for choosing MPC-mode limits:

1. Estimate **outgoing data**: request line, headers, body. Set `max_sent_data` to that figure plus a margin. Every byte here costs preprocessing.
2. Estimate **total incoming data**: response headers + body, plus overhead. Set `max_recv_data` to that. With deferred decryption, this cap is essentially free in MPC-preprocessing terms. It just bounds the session size (and the `Verifier` will reject if it exceeds its own policy).
3. Estimate **incoming data you must read mid-session** (typically: just the parts that influence what you send next, or zero if you fire-and-forget). Set `max_recv_data_online` to that. Keep this small.
4. Leave `defer_decryption_from_start` at its default (`true`) unless you have a specific reason to disable it.
5. Pick `network` based on your link. Default `Latency` is best for most use cases.

The lower these numbers, the faster the session starts and the less bandwidth is consumed before the TLS connection opens.

## Proxy mode (`ProxyTlsConfig`)

Proxy mode requires no MPC preprocessing and no per-session resource allocation, so the configuration surface is minimal.

| Field         | Required | Description                                                                       |
|---------------|----------|-----------------------------------------------------------------------------------|
| `server_name` | yes      | The DNS name of the server the `Prover` will connect to through the proxy.        |
