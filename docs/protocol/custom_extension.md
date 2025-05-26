---
sidebar_position: 5
---

# Custom Extensions

Notary attestations can be extended with custom fields defined by the `Prover` or the `Notary`. This allows applications to attach additional data to attestations in a verifiable way.

For now, the default notary server implementation only supports including custom data requested by the `Prover` in the attestation without any validation. In the future, a plugin system will allow developers to add custom logic to the notary server for adding or validating these data, without needing to modify the notary server code.

## Use Cases

- The `Prover` includes their public key to bind the attestation to their identity.
- The `Notary` includes a TEE (Trusted Execution Environment) attestation to prove code integrity.
- The `Prover` includes a nullifier to prevent reuse of the attestation.

## Example

The following demonstrates how to modify the [attestation example](https://github.com/tlsnotary/tlsn/blob/main/crates/examples/attestation/README.md) to include the `Prover`'s public key as a custom extension.

### Prover

The [attestation prover](https://github.com/tlsnotary/tlsn/blob/main/crates/examples/attestation/prove.rs) is modified as follows:

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

Note that the `Extension`'s `id` and `value` are both `Vec<u8>`, giving full control over the encoding format.

### Notary

The [Notary server](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server) must be started with `allow_extensions` enabled:

```bash
NS_NOTARIZATION__ALLOW_EXTENSIONS=true cargo run --release
```

Currently, the notary server does not support adding its own extensions or performing validations on extensions requested by the `Prover` out of the box. To do so, you’ll need to extend the notary server using the APIs outlined in the [API docs](https://tlsnotary.github.io/tlsn/tlsn_core/attestation/index.html#extensions).

### Verifier

The [attestation verifier](https://github.com/tlsnotary/tlsn/blob/main/crates/examples/attestation/verify.rs) can be modified to inspect extensions:

```rust
...

let PresentationOutput {
    server_name,
    connection_info,
    transcript,
    mut extensions, // Optionally, verify any custom extensions from the prover or notary.
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

This allows the `Verifier` to confirm that the attestation is bound to the identity associated with the specified public key.
