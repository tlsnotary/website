---
sidebar_label: Browser

---
# Browser Quick Start

Get started with TLSNotary in the browser using the TLSNotary browser extension.

> **Recommended:** Try the [interactive tutorial](https://demo.tlsnotary.org/tutorial/) for a guided walkthrough with a pre-configured verifier server.

## Install Browser Extension {#install}

### Chrome Web Store (Recommended)

1. Visit the [TLSNotary Extension on Chrome Web Store](https://chromewebstore.google.com/detail/gnoglgpcamodhflknhmafmjdahcejcgg)
2. Click **Add to Chrome**
3. Grant the required permissions

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

## Try the Demo {#demo}

The quickest way to see TLSNotary in action:

1. Visit the [TLSNotary Demo](https://demo.tlsnotary.org)
2. Pick a plugin and follow the instructions
3. When finished you can view the attestation and transcript in the extension

## Interactive Tutorial {#tutorial}

The [interactive tutorial](https://demo.tlsnotary.org/tutorial/) walks you through the full development workflow:

1. **Concepts** — MPC-TLS, handlers, and selective disclosure
2. **Running Your First Plugin** — See a complete example in action (X.com proof)
3. **Writing Custom Handlers** — Add your own handler to prove bank balances
4. **Advanced Challenges** — Nested JSON paths, header revelation, request/response handling
5. **Breaking the Verifier** — Understand why proper verification logic matters

You can also [run the tutorial locally](https://github.com/tlsnotary/tlsn-extension/tree/main/packages/tutorial) with your own verifier server (see [Verifier: Local Development](/docs/extension/verifier#local-development)).

## What's Next

- **[Extension Documentation](/docs/extension/)** — Architecture overview, plugin system, and verifier server
- **[Plugin System](/docs/extension/plugins)** — Capabilities API, handler reference, and a full example plugin
- **[Verifier Server](/docs/extension/verifier)** — Deployment, API endpoints, webhook integration, and configuration
- **[Plugin SDK](https://github.com/tlsnotary/tlsn-extension/tree/main/packages/plugin-sdk)** — Source for `@tlsn/plugin-sdk`
