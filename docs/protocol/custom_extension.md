---
sidebar_position: 5
---
# Custom Extension

The attestation signed by the `Notary` can be extended with custom extensions to support application specific requirements. Both the `Prover` and `Notary` can be configured to include custom data, which can later be verified by the third-party `Verifier`. The `Notary` can also be configured to validate any extensions requested by the `Prover`.

## Use Cases
- `Prover` includes their public key to bind it to their identity.
- `Notary` includes their TEE (trusted execution environment) attestation to prove code integrity.
- `Prover` includes a nullifier to prevent reuse of the attestation.

## Example
The following modifies the [attestation example](https://github.com/tlsnotary/tlsn/blob/main/crates/examples/attestation/README.md) to include the `Prover`'s public key as a custom extension.

### Prover
The [attestation prover](https://github.com/tlsnotary/tlsn/blob/main/crates/examples/attestation/prove.rs) is modified as follows. 
```rust
...
    
let builder = RequestConfig::builder();

builder.extension(Extension {
    id: b"prover_public_key".to_vec(),
    value: b"PUBLIC_KEY_PEM".to_vec(),
});

let request_config = builder.build()?;

...
```
Note that `Extension`'s `id` and `value` are of `Vec<u8>`, which means one is free to choose their encoding format.

### Notary
The [notary server](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server) is run with `allow_extensions` turned on.
```bash
NS_NOTARIZATION__ALLOW_EXTENSIONS=true cargo run --release
```
Note that the notary server currently doesn't support adding its own extension, or performing custom validations on extensions from the `Prover`. To do that, the notary server needs to be modified by using the relevant APIs outlined in the [API docs](https://tlsnotary.github.io/tlsn/tlsn_core/attestation/index.html#extensions).

### Verifier
The [attestation verifier](https://github.com/tlsnotary/tlsn/blob/main/crates/examples/attestation/verify.rs) is modified as follows.
```rust
...

let PresentationOutput {
    server_name,
    connection_info,
    transcript,
    mut extensions, // Optionally, verify any custom extensions from prover/notary.
    ..
} = presentation.verify(&crypto_provider).unwrap();

let Extension { id, value } = extensions.pop().unwrap();
// Check the prover's public key.
if id.as_slice() == b"prover_public_key" {
    let public_key_pem = String::from_utf8(value).unwrap();
    ...
}

...
```
The `Verifier` can now be confident that the attestation is binded to the identity associated with this public key.

