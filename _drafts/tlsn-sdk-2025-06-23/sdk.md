---
theme: gaia
class: invert
paginate: true
marp: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---
<!-- _class: lead invert -->
# TLSNotary SDK

A modular SDK for private web data verification  
without compromising flexibility, privacy, or security.

---
<!-- Speaker notes go here. -->

## From Breakthrough to SDK

- ✅ TLSNotary: zkTLS **0 → 1**
- 🔓 Censorship-resistant, open source, private, and secure
- ⚠️ Next challenge: safe & flexible developer experience

---

## What Does TLSNotary Proving Involve?

![](https://tlsnotary.org/assets/images/overview_prover_verifier-d1c5dd944ba01e3fe8983375aad61c1e.svg#gh-dark-mode-only)

1. **Prover** creates request (with headers, cookies, payload)
2. **Prover** redacts/zkps sensitive parts
3. **Verifier** validates the revealed data
4. **Verifier** performs a follow-up action (e.g., attestation)

---

## Challenge: How to Use TLSNotary in Practice?

- TLSNotary is a Rust library 🦀 (+WASM 🌍)
- Clone getting started examples (low level)
- Clone our browser extension (requires access to **all data on all sites** 😱)

How to ensure that:
- it is secure?
- user privacy is truly protected?

---

## Insight: App Logic Is "Same But Different"

- Wide variety of integration patterns across **web, mobile, and server environments**
- A structured solution is required to handle diverse use cases safely and allow for independent **audits**

---

## Solution: SDK with Plugin System

- App-specific logic lives in isolated plugins  
- TLSNotary runtime handles the rest  
  Web, Mobile, Desktop, Server runtimes (wasm/native bindings)

_Plugin-style architecture, running in a secure sandbox._

![bg vertical 80%](./none)
![bg vertical 80%](./plugins.svg)

---
<!-- - Plugins allow for independent inspection
-->

## What Exactly Is a Plugin?
- Small WebAssembly module defining app-specific logic
- Called by the TLSNotary runtime during proof or verification
- Written in Rust, TypeScript, or any WASM-compatible language
- Compiled, auditable, and sandboxed

_(We currently use [Extism](https://extism.org/) to handle this.)_

![bg vertical 80%](./none)
![bg vertical 80%](./plugins.svg)

---

## Why Not Simple Templates?

- **Templates** cover common cases but break under edge-case needs
- Rigid approaches lead to workarounds and **security** risks

A simple template engine could be added as a plugin (e.g., to support Reclaim templates).

---

## Prover Plugins: Creating proofs

- Developed by app developer (often also the verifier)
- Should be open source
- Balance between:
    - user privacy
    - verifiability (valid JSON with "holes")
    - ease of development
- Handles 2 major application specific tasks:
  - Creating requests requires input: headers, cookies, etc.
  - Redaction (more complicated than it sounds)

---

## Verifier Plugins: Interpreting Proofs Safely

- Can be closed source
- Verification on multiple levels:
  - TLSNotary checks protocol and commitments
  - Plugins verify structure of revealed data...
  - ...and process the data for higher-level app consumption

---

## Performance and Security Considerations

- Performance-critical operations reside in core runtime
- Plugin execution (control logic) incurs negligible WASM overhead
- Sandboxed plugins reduce risk of misconfiguration and simplify auditing
- SDK defines a clear API → low level development also fully supported

---
## What About Generic Notaries?

A **blind notary** is a verifier plugin:

- Verifies commitments only, without inspecting revealed data
- Issues signed attestation for downstream verification

→ Plugins enable both public attestations and fully private verification flows

---

## Closing: Enabling the Next Wave of Use Cases

- Modular integrations without modifying TLSNotary internals
- Safer, more consistent developer experience
- Foundation for broader adoption across Web2 and Web3 applications
