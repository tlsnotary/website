import React, { useState } from 'react';
import styles from './styles.module.css';

type LayerId = 'consumer' | 'adapter' | 'contracts' | 'sdk';

interface Layer {
  id: LayerId;
  title: string;
  subtitle: string;
  rows: string[];
  detail: React.ReactNode;
}

interface MobileFlowDiagramProps {
  /**
   * Which platform's adapter to highlight. Default `mobile` flips the second
   * layer to @tlsn/host-react-native. `extension` swaps it for
   * @tlsn/host-extension. Lets the same component drive future posts.
   */
  platform?: 'mobile' | 'extension' | 'cli';
}

const SDK_ROW: Layer = {
  id: 'sdk',
  title: '@tlsn/plugin-sdk',
  subtitle: 'protocol core — platform-agnostic',
  rows: ['HostCore', 'Handler · DomJson · PluginConfig', 'NativeFunctionEvaluator / QuickJS sandbox'],
  detail: (
    <>
      The protocol core. <code>HostCore</code> drives the plugin lifecycle: it
      evaluates the plugin&apos;s JavaScript inside a sandbox, manages the
      reactive <code>main()</code> loop, holds plugin state, and exposes the
      capabilities the plugin uses (<code>prove()</code>, <code>openWindow()</code>,
      <code>useHeaders()</code>, …). It owns every type the plugin and the host
      pass each other — <code>Handler</code>, <code>DomJson</code>,
      <code>PluginConfig</code>, <code>WindowMessage</code>. Nothing in here knows
      whether it&apos;s running on a phone, in a browser, or in a Node CLI.
    </>
  ),
};

const CONTRACTS_ROW: Layer = {
  id: 'contracts',
  title: '@tlsn/host-contracts',
  subtitle: 'adapter spec — what every platform must implement',
  rows: ['ProverClient · WindowManager · RequestInterceptor', 'PluginRenderer · ApprovalUi', 'translateHandler (native-bridge helper)'],
  detail: (
    <>
      Five interfaces that describe what a platform adapter must do — make a
      window, intercept its headers, render the plugin&apos;s UI, ask the user
      for approval, run a prover. <code>HostCore</code> doesn&apos;t care how
      these work; it just calls them. That&apos;s why the same plugin runs
      unchanged on three radically different platforms: the contract is the
      bridge.
    </>
  ),
};

function adapterRow(platform: 'mobile' | 'extension' | 'cli'): Layer {
  if (platform === 'extension') {
    return {
      id: 'adapter',
      title: '@tlsn/host-extension',
      subtitle: 'platform glue — Manifest V3',
      rows: [
        'WindowManager (chrome.windows + webRequest)',
        'SessionManager + ProveManager (offscreen WASM prover)',
        'PluginRenderer (content-script DOM)',
      ],
      detail: (
        <>
          Implements every contract using browser-extension primitives:
          <code>chrome.windows</code> for managed windows,
          <code>webRequest.onBeforeRequest</code> for header interception, an
          offscreen document hosting the tlsn-wasm prover, content-script DOM
          for rendering the plugin&apos;s UI. The upstream TLSN extension
          consumes this exact package.
        </>
      ),
    };
  }
  if (platform === 'cli') {
    return {
      id: 'adapter',
      title: '@tlsn/host-cli',
      subtitle: 'platform glue — Node + Playwright',
      rows: [
        'PlaywrightWindowManager (BrowserContext)',
        'RustProverClient (spawns tlsn-prover binary)',
        'PlaywrightDomRenderer · ClackApprovalUi',
      ],
      detail: (
        <>
          Implements the contracts with Playwright (windows + headers via{' '}
          <code>page.route()</code>), a Rust prover binary built from the
          native crate, and <code>@clack/prompts</code> for terminal-friendly
          approval. Doubles as the cross-platform protocol test harness.
        </>
      ),
    };
  }
  return {
    id: 'adapter',
    title: '@tlsn/host-react-native',
    subtitle: 'platform glue — Expo / React Native',
    rows: [
      'PluginWebView (header interception via injected JS)',
      'NativeProver (tlsn-native Expo module wrapping Rust)',
      'PluginRenderer (DomJson → RN primitives)',
    ],
    detail: (
      <>
        Implements every contract using React Native and Expo. A
        <code>WebView</code> with injected JavaScript wraps{' '}
        <code>fetch</code>/<code>XHR</code> to intercept headers, an Expo
        native module hosts the Rust prover (no WASM — Hermes can&apos;t run
        it), and React Native primitives (<code>View</code>,{' '}
        <code>Text</code>, <code>TouchableOpacity</code>) render the
        plugin&apos;s <code>DomJson</code> tree. The TLSN mobile app consumes
        this exact package.
      </>
    ),
  };
}

function consumerRow(platform: 'mobile' | 'extension' | 'cli'): Layer {
  if (platform === 'extension') {
    return {
      id: 'consumer',
      title: 'Your browser extension',
      subtitle: 'user-owned UI · manifest · plugin gallery',
      rows: ['Popup, background service worker, content scripts', 'Plugin registry', 'Your branding + UX'],
      detail: (
        <>
          The extension you ship. You own the manifest, the popup UI, the
          gallery of plugins you curate, and the styling. Everything below this
          line is the @tlsn/* stack the skill scaffolds for you.
        </>
      ),
    };
  }
  if (platform === 'cli') {
    return {
      id: 'consumer',
      title: 'Your CLI tool / script',
      subtitle: 'user-owned · CI / batch / local',
      rows: ['Plugin runner script', 'Storage-state / cookie cache', 'Your prompts + logging'],
      detail: (
        <>
          The CLI you ship. A short script that wires <code>createCliAdapter()</code>
          to your plugin list and lets users run proofs from a terminal —
          interactively the first time, headlessly thereafter from a saved
          Playwright storage state.
        </>
      ),
    };
  }
  return {
    id: 'consumer',
    title: 'Your Expo / React Native app',
    subtitle: 'user-owned UI · screens · plugin gallery',
    rows: ['PluginGalleryScreen, PluginRunnerScreen, SettingsScreen', 'Plugin registry + theming', 'PluginApprovalSheet · RevealApprovalSheet'],
    detail: (
      <>
        The mobile app you ship. You own the screens, the gallery of plugins
        you curate, the approval sheets your users see, and the theming.
        Everything below this line is the @tlsn/* stack the skill scaffolds
        for you.
      </>
    ),
  };
}

export default function MobileFlowDiagram({ platform = 'mobile' }: MobileFlowDiagramProps) {
  const layers: Layer[] = [
    consumerRow(platform),
    adapterRow(platform),
    CONTRACTS_ROW,
    SDK_ROW,
  ];

  const [activeId, setActiveId] = useState<LayerId>('adapter');
  const active = layers.find((l) => l.id === activeId) ?? layers[1];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>How the {platformLabel(platform)} integration stacks up</h3>
        <p className={styles.subtitle}>Tap a layer to see what lives in it.</p>
      </div>

      <div className={styles.stack}>
        {layers.map((layer, idx) => (
          <React.Fragment key={layer.id}>
            <button
              type="button"
              className={`${styles.layer} ${layer.id === activeId ? styles.active : ''} ${layer.id === 'consumer' ? styles.consumer : ''}`}
              onClick={() => setActiveId(layer.id)}
              aria-pressed={layer.id === activeId}
            >
              <div className={styles.layerHeader}>
                <span className={styles.layerTitle}>{layer.title}</span>
                <span className={styles.layerSubtitle}>{layer.subtitle}</span>
              </div>
              <ul className={styles.layerRows}>
                {layer.rows.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </button>
            {idx < layers.length - 1 && (
              <div className={styles.connector} aria-hidden="true">
                <span className={styles.connectorLine} />
                <span className={styles.connectorLabel}>{connectorLabel(idx)}</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.detailPanel} role="region" aria-live="polite">
        <div className={styles.detailHeader}>{active.title}</div>
        <div className={styles.detailBody}>{active.detail}</div>
      </div>
    </div>
  );
}

function platformLabel(platform: 'mobile' | 'extension' | 'cli'): string {
  if (platform === 'extension') return 'extension';
  if (platform === 'cli') return 'CLI';
  return 'mobile';
}

function connectorLabel(idx: number): string {
  // Between consumer (0) and adapter (1) → imports.
  // Between adapter (1) and contracts (2) → implements.
  // Between contracts (2) and sdk (3) → built on.
  if (idx === 0) return 'imports';
  if (idx === 1) return 'implements';
  return 'built on';
}
