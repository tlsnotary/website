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

## How the app is built

The mobile app is one consumer of a four-layer stack we shipped alongside it. Tap a layer to see what lives in it:

<MobileFlowDiagram platform="mobile" />

The protocol core (`@tlsn/plugin-sdk`) is the same code the browser extension runs. It owns the `HostCore` engine that evaluates a plugin's JavaScript inside a sandbox, drives the reactive `main()` loop, manages plugin state, and exposes the capabilities a plugin uses (`prove()`, `openWindow()`, `useHeaders()`, …). Nothing in there knows whether it's running in a service worker, a phone, or a Node CLI.

Below it sits `@tlsn/host-contracts` — five interfaces every platform adapter implements. There's a `ProverClient` (how do I run a TLS prover on this platform?), a `WindowManager` (how do I open a tab/window/WebView and track it?), a `RequestInterceptor` (how do I capture the headers that fire inside it?), a `PluginRenderer` (how do I turn `DomJson` into UI?), and an `ApprovalUi` (how do I ask the user before doing something?). The contract is the bridge — it's why the same plugin runs on three radically different platforms unchanged.

`@tlsn/host-react-native` is the mobile-specific glue that implements those five contracts. The window manager wraps `react-native-webview`. The request interceptor uses injected JavaScript inside the WebView to wrap `fetch` and `XMLHttpRequest`. The prover client is a thin shim over `tlsn-native`, an Expo native module that hosts a Rust port of the TLSNotary prover (Hermes can't run the WASM build, so we built the prover natively for iOS and Android). The renderer maps the plugin's `DomJson` tree onto React Native primitives — `<View>`, `<Text>`, `<TouchableOpacity>` — with style adapters that translate browser CSS to React Native's `StyleSheet`. The approval UI is your app's responsibility: the adapter exposes hooks; you bring the bottom sheet.

The top layer is **your app**. The mobile app at `app/mobile/` in the monorepo is one example — Expo Router screens, a plugin registry, the approval sheets you saw above, a theme. You can fork it or you can start from scratch, depending on how much UX you want to own.

---

## Build your own

There are three paths a developer can take into TLSNotary, and we ship a Claude Code skill for each of them.

**Build a plugin.** If you want to prove data from a specific API — your bank, a SaaS dashboard, anything you can hit with `fetch` — write a plugin. Plugins are platform-agnostic: the same `swissbank.plugin.ts` runs on the mobile app, the browser extension, and the CLI. The `create-plugin` skill walks you through it.

**Build your own extension.** If you want a Chrome / Firefox / Safari extension with your own branding and plugin curation, scaffold a new project on top of `@tlsn/host-extension`. You own the manifest, the popup, the gallery — the adapter brings the WindowManager, the offscreen WASM prover, the request interception, and the content-script renderer. The upstream TLSNotary extension is the canonical reference.

**Build your own mobile app.** If you want TLSN on iOS or Android, scaffold on top of `@tlsn/host-react-native`. You own the screens, the gallery, and the theming; the adapter brings the WebView, the native prover, and the renderer. The TLSN mobile app at `app/mobile/` is the canonical reference.

For all three paths, the canonical entry point is the **`tlsnotary` Claude Code skill** that lives in the monorepo at `.claude/skills/tlsnotary/SKILL.md`. Clone it into your own project under `.claude/skills/` and ask Claude something like *"add TLSNotary to my Expo app"* — Claude reads the skill, picks the right path, and walks you through scaffolding the consumer files. The skill is the canonical, auto-discoverable entry point so you don't have to remember any slash commands.

The packages and the skill are all in the monorepo at [tlsnotary/tlsn-extension](https://github.com/tlsnotary/tlsn-extension). The mobile app lives under `app/mobile/`, the adapters under `packages/host-*`, and the skills under `.claude/skills/`.

---

## What's next

The mobile app is the first ship of the new host-adapter platform — there will be a CLI cut, an Electron adapter, and more reference plugins to follow. If you're building something with TLSNotary and the tooling has a sharp edge, please file an issue on GitHub or join us on Discord. We want to hear it.

Install the app, run a proof, and let us know what you build.
