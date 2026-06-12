---
title: "TLSNotary on Mobile: A New App and a Path for Building Your Own"
authors: [tsukino]
description: "We just shipped TLSNotary for iOS and Android — both as a demo of selective-disclosure proofs on a phone, and as a reference implementation for developers who want to build their own TLSN-powered mobile app on top of the new @tlsn/host-react-native adapter."
---

import MobileAppShowcase from '@site/src/components/MobileAppShowcase';
import MobileFlowDiagram from '@site/src/components/MobileFlowDiagram';

A few months ago, TLSNotary was a browser extension and a protocol. Today it's also a mobile app — iOS and Android, with the same plugin gallery you know from the extension, the same selective-disclosure guarantees, and a brand-new development story for anyone who wants to ship their own TLSN-powered app.

The app itself is a **demo**: install it, browse the gallery, and produce a real proof against the public verifier. But it's also a **reference implementation**. Everything the app does on top of the TLSNotary protocol — the WebView that intercepts headers, the bottom sheet that asks for your approval, the native module that runs the Rust prover — is packaged so you can build the same stack into your own app without reading 2,000 lines of source.

<!-- truncate -->

---

## A walk through the app

The mobile app's flow mirrors the extension's, but reorganized for a phone-sized screen. Four states matter:

<MobileAppShowcase />

**Browse plugins.** Each plugin is a small piece of TypeScript that knows how to prove something specific — your Spotify top artist, your bank balance above a threshold, your Twitter handle. The gallery is curated, but a developer can swap in their own registry.

**Approve the plugin.** Before any code runs, the app shows you exactly which hosts the plugin will hit, what data it will request, and asks you to choose how strictly you want to gate it: approve every reveal one-by-one, or approve everything for the session. Rejecting at this point means the plugin never executes.

**Approve the reveal.** After the prover has built the protocol up to the moment of disclosure, the app stops and shows you the actual bytes that will leave your device — every range, with REVEAL or HASH badges so you can tell what's plaintext and what's a commitment. This is the same gate the extension's strict-mode flow uses, ported to a mobile-native bottom sheet.

**See the verified result.** The proof completes against the verifier, and the app shows you the value you proved (your top artist, your follower count) along with which host signed it. The full proof transcript is collapsible — most users don't need it, but it's there if you want to inspect or share it.

The whole flow runs locally except for the TLS prover's outbound connection (to the target server) and its multi-party computation handshake (with the verifier). Your session cookie never leaves the device.

---

## How the app uses the libraries

The mobile app is one consumer of a four-layer stack: your app on top, `@tlsn/host-react-native` underneath it, `@tlsn/host-contracts` describing what every adapter implements, and `@tlsn/plugin-sdk` at the bottom — the same protocol core the browser extension runs.

<MobileFlowDiagram platform="mobile" />

What that looks like in code is short. Every screen the user sees is a thin wrapper over four primitives the adapter ships. Here's how `PluginScreen.tsx` — the file that orchestrates a whole prove session — wires them together.

**1. Set up the host.** `MobilePluginHost` wraps the SDK's `HostCore` and asks you for a handful of callbacks: how to run the native prover, how to render UI, how to open a WebView. The user-approval bottom sheets are *your* component; the host calls into them when it needs a decision.

```tsx
const host = new MobilePluginHost({
  onProveUntilReveal: async (request, options) => {
    // Run the protocol up to compute_reveal, before the user has approved
    // anything — the result includes the byte ranges that *would* be revealed.
    return await proverRef.current.prepareReveal({ ...request, proverOptions: options });
  },
  onProveFinalize: async (sessionId, approved) => {
    // After the user approves the reveal bottom sheet, finalize the proof.
    return await proverRef.current.finalizeReveal(sessionId, approved);
  },
  onRevealApproval: ({ descriptors, approve, reject }) => {
    setRevealApproval({ descriptors, approve, reject });  // shows <RevealApprovalSheet>
  },
  onRenderPluginUi: (windowId, domJson) => setDomJson(domJson),
  onOpenWindow: async (url) => {
    setWebViewUrl(url);                                    // mounts <PluginWebView>
    return { windowId, uuid: `mobile-${windowId}`, tabId: 0 };
  },
  onCloseWindow: () => { setWebViewUrl(null); setDomJson(null); },
});
```

**2. Mount the native prover.** `<NativeProver>` is a headless component that wraps the `tlsn-native` Expo module — a Rust port of the TLSNotary prover packaged as an iOS / Android native library (Hermes can't run the WASM build the extension uses, so we shipped one natively). The `ref` is what `MobilePluginHost` calls `prepareReveal()` and `finalizeReveal()` against.

```tsx
<NativeProver
  ref={proverRef}
  onReady={() => setProverReady(true)}
  onError={(err) => setError(err.message)}
  onProgress={handleProveProgress}
/>
```

**3. Intercept headers in a WebView.** When the plugin calls `openWindow()`, your app mounts `<PluginWebView>`, which loads the URL and runs injected JavaScript to wrap `fetch` and `XMLHttpRequest`. Every request fires `onHeaderIntercepted`, and your app routes that into the running plugin via `host.emitHeaderIntercepted()`.

```tsx
<PluginWebView
  url={webViewUrl}
  targetHosts={pluginConfig.urls}
  onHeaderIntercepted={(header) => {
    host.emitHeaderIntercepted(eventEmitter, windowId, header);
  }}
/>
```

**4. Render the plugin's UI.** Plugins describe their UI as `DomJson` — a JSON tree of `div` / `button` / `text` nodes. `<PluginRenderer>` walks that tree and renders it as React Native primitives (`<View>`, `<Text>`, `<TouchableOpacity>`), translating any CSS the plugin emits to RN's `StyleSheet`. Click handlers route back to the host so the plugin can react.

```tsx
<PluginRenderer
  domJson={domJson}
  onPluginAction={(handlerName) => host.emitPluginAction(eventEmitter, windowId, handlerName)}
/>
```

**5. Run the plugin.** Everything above is plumbing. The actual entry point is one line:

```tsx
await host.executePlugin(pluginCode, { eventEmitter });
```

That's the whole integration. The approval sheets, the plugin gallery, the theming, the settings — those are yours to design. The TLSN-specific machinery is the snippets above plus the components that render them. The reference implementation at [`app/mobile/`](https://github.com/tlsnotary/tlsn-extension/tree/main/app/mobile) is around 600 lines on top of the adapter; you can fork it or start from scratch depending on how much UX you want to own.

---

## Build your own

There are three paths a developer can take into TLSNotary, and we ship a Claude Code skill for each of them.

**Build a plugin.** If you want to prove data from a specific API — your bank, a SaaS dashboard, anything you can hit with `fetch` — write a plugin. Plugins are platform-agnostic: the same `swissbank.plugin.ts` runs on the mobile app, the browser extension, and the CLI. The `create-plugin` skill walks you through it.

**Build your own extension.** If you want a Chrome / Firefox / Safari extension with your own branding and plugin curation, scaffold a new project on top of `@tlsn/host-extension`. You own the manifest, the popup, the gallery — the adapter brings the WindowManager, the offscreen WASM prover, the request interception, and the content-script renderer. The upstream TLSNotary extension is the canonical reference.

**Build your own mobile app.** If you want TLSN on iOS or Android, scaffold on top of `@tlsn/host-react-native`. You own the screens, the gallery, and the theming; the adapter brings the WebView, the native prover, and the renderer. The TLSN mobile app at `app/mobile/` is the canonical reference.

For all three paths, the canonical entry point is the **`tlsnotary` Claude Code skill** that lives in the monorepo at [`skills/tlsnotary/SKILL.md`](https://github.com/tlsnotary/tlsn-extension/blob/main/skills/tlsnotary/SKILL.md). Copy the `skills/` directory into your own project, point Claude Code at it, and ask something like *"add TLSNotary to my Expo app"* — Claude reads the skill, picks the right path, and walks you through scaffolding the consumer files. The skill is the canonical, auto-discoverable entry point so you don't have to remember any slash commands.

The packages and the skill are all in the monorepo at [tlsnotary/tlsn-extension](https://github.com/tlsnotary/tlsn-extension). The mobile app lives under `app/mobile/`, the adapters under `packages/host-*`, and the skills under `skills/`.

---

## What's next

The mobile app is the first ship of the new host-adapter platform — there will be a CLI cut, an Electron adapter, and more reference plugins to follow. If you're building something with TLSNotary and the tooling has a sharp edge, please file an issue on GitHub or join us on Discord. We want to hear it.

Install the app, run a proof, and let us know what you build.
