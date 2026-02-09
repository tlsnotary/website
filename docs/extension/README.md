---
sidebar_label: Browser Extension
---
# TLSNotary Web Ecosystem

The TLSNotary Web Ecosystem brings zero-knowledge proofs to the browser. It consists of three core components that work together to let users generate cryptographic proofs of any web data — without exposing credentials or sensitive information.

| Component | Role |
|-----------|------|
| **[Browser Extension](#installation)** | Runs in the user's browser. Intercepts requests, executes plugins, and drives the MPC-TLS prover. |
| **[Plugin System](./plugins.md)** | JavaScript plugins that define *what* to prove — which site, which API call, and which fields to reveal. |
| **[Verifier Server](./verifier.md)** | An independent server that participates in the MPC-TLS handshake, validates proofs, and optionally forwards results via webhooks. |

```
┌─────────────────┐                  ┌──────────────────┐                  ┌─────────────────┐
│                 │                  │                  │                  │                 │
│  Browser        │ ◄──WebSocket──►  │  Verifier Server │ ◄──TCP/TLS──►    │  Target Server  │
│  Extension      │                  │                  │                  │  (api.x.com,    │
│  (Prover)       │                  │                  │                  │   etc.)         │
│                 │                  │                  │                  │                 │
└─────────────────┘                  └──────────────────┘                  └─────────────────┘
```

---

## Why a Browser Extension?

While TLSNotary's core protocol can work in various environments, the browser extension solves three critical challenges:

### Safe Header and Cookie Interception

Web applications rely on HTTP headers and cookies for authentication. The extension:

- Intercepts requests in a **sandboxed environment** before they leave the browser
- **Never sends credentials to external servers** — everything happens locally
- Uses Chrome's `webRequest` API to safely capture headers without exposing them
- Gives the user **full control** over exactly what to reveal in proofs

### Isolated Plugin Execution

Plugins define *what* to prove (e.g. "prove my X.com username" or "prove my bank balance exceeds $10,000"). The extension provides a secure execution environment:

- **QuickJS WebAssembly sandbox** isolates plugin code from the browser process
- **No network access** — plugins cannot exfiltrate data
- **Limited API surface** — plugins only access designed capabilities (`prove()`, `openWindow()`, etc.)
- **User approval required** — plugins cannot execute without explicit consent

### CORS-Compatible Architecture

Browsers enforce Same-Origin Policy and CORS, which prevents regular web pages from intercepting cross-origin requests. The extension runs with elevated permissions, allowing it to:

- Intercept any HTTPS request the browser makes
- Capture full request and response data (headers, body, etc.)
- Generate proofs for cross-origin API calls (X.com, GitHub, banks, etc.)

---

## Installation

### Chrome Web Store (Recommended)

1. Visit the [TLSNotary Extension on Chrome Web Store](https://chromewebstore.google.com/detail/gnoglgpcamodhflknhmafmjdahcejcgg)
2. Click **Add to Chrome**
3. Grant the required permissions
4. The extension icon will appear in the toolbar

**Supported browsers:** Google Chrome, Microsoft Edge, Brave, and any Chromium-based browser.

### Build from Source

```bash
git clone https://github.com/tlsnotary/tlsn-extension.git
cd tlsn-extension
npm install
npm run build
```

Then load the extension in Chrome:

1. Open `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `packages/extension/build/` directory

For a production-optimized build:

```bash
NODE_ENV=production npm run build
```

---

## Getting Started

### Demo Site

The [demo site](https://demo.tlsnotary.org) provides pre-built plugins you can try immediately — no code required. It demonstrates end-to-end proof generation for popular services.

### Interactive Tutorial

The interactive tutorial walks you through the full development workflow:

1. **Concepts** — MPC-TLS, handlers, and selective disclosure
2. **Running Your First Plugin** — See a complete example in action (X.com proof)
3. **Writing Custom Handlers** — Add your own handler to prove bank balances
4. **Advanced Challenges** — Nested JSON paths, header revelation, request/response handling
5. **Breaking the Verifier** — Understand why proper verification logic matters

[**Start the Tutorial**](https://github.com/tlsnotary/tlsn-extension/tree/main/packages/tutorial) (requires a local verifier server — see [Verifier: Local Development](./verifier.md#local-development))

---

## What's Next

- **[Plugin System](./plugins.md)** — Architecture, capabilities API, handler reference, and a full example plugin
- **[Verifier Server](./verifier.md)** — Deployment, API endpoints, webhook integration, and configuration
- **[Plugin SDK](https://github.com/tlsnotary/tlsn-extension/tree/main/packages/plugin-sdk)** — Source for `@tlsn/plugin-sdk`
- **[Report Issues](https://github.com/tlsnotary/tlsn-extension/issues)** — Bug reports and feature requests
