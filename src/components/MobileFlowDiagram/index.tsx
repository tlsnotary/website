import React, { useState } from 'react';
import styles from './styles.module.css';

type LayerId = 'consumer' | 'adapter' | 'sdk';

interface Layer {
  id: LayerId;
  title: string;
  detail: React.ReactNode;
}

interface MobileFlowDiagramProps {
  /**
   * Which platform's adapter to highlight. Default `mobile` shows
   * @tlsn/host-react-native. `extension` swaps it for @tlsn/host-extension.
   * Lets the same component drive future posts.
   */
  platform?: 'mobile' | 'extension' | 'cli';
}

function adapterLayer(platform: 'mobile' | 'extension' | 'cli'): Layer {
  if (platform === 'extension') {
    return {
      id: 'adapter',
      title: '@tlsn/host-extension',
      detail: (
        <>
          The Manifest-V3 adapter. Implements the host primitives using
          <code>chrome.windows</code> for managed windows,
          <code>webRequest.onBeforeRequest</code> for header interception, an
          offscreen document hosting the tlsn-wasm prover, and content-script
          DOM for rendering the plugin&apos;s UI. The upstream TLSN extension
          consumes this exact package.
        </>
      ),
    };
  }
  if (platform === 'cli') {
    return {
      id: 'adapter',
      title: '@tlsn/host-cli',
      detail: (
        <>
          The Node CLI adapter. Drives Playwright for windows and headers,
          spawns a Rust prover binary, and uses{' '}
          <code>@clack/prompts</code> for terminal-friendly approval. Doubles
          as the cross-platform protocol test harness.
        </>
      ),
    };
  }
  return {
    id: 'adapter',
    title: '@tlsn/host-react-native',
    detail: (
      <>
        The mobile adapter. Ships a <code>WebView</code> with injected JS that
        intercepts <code>fetch</code> and <code>XMLHttpRequest</code>, a
        headless <code>&lt;NativeProver&gt;</code> wrapping the
        <code>tlsn-native</code> Expo module (a native Rust port of the
        TLSNotary prover — Hermes can&apos;t run the WASM build), and a{' '}
        <code>&lt;PluginRenderer&gt;</code> that maps the plugin&apos;s
        <code>DomJson</code> tree onto React Native primitives.
        The TLSN mobile app consumes this exact package.
      </>
    ),
  };
}

function consumerLayer(platform: 'mobile' | 'extension' | 'cli'): Layer {
  if (platform === 'extension') {
    return {
      id: 'consumer',
      title: 'Your browser extension',
      detail: (
        <>
          The extension you ship — manifest, popup, plugin gallery, your
          branding and UX. Everything below this line is the @tlsn/* stack
          the skill scaffolds for you.
        </>
      ),
    };
  }
  if (platform === 'cli') {
    return {
      id: 'consumer',
      title: 'Your CLI tool',
      detail: (
        <>
          The script you ship — a short program that wires{' '}
          <code>createCliAdapter()</code> to your plugin list and runs
          proofs from a terminal.
        </>
      ),
    };
  }
  return {
    id: 'consumer',
    title: 'Your Expo app',
    detail: (
      <>
        The app you ship. You own the screens (plugin gallery, runner,
        settings), the approval bottom sheets the user sees, and the
        theming. Everything below this line is the @tlsn/* stack the
        skill scaffolds for you.
      </>
    ),
  };
}

const SDK_LAYER: Layer = {
  id: 'sdk',
  title: '@tlsn/plugin-sdk',
  detail: (
    <>
      The protocol core. <code>HostCore</code> drives the plugin lifecycle:
      it evaluates the plugin&apos;s JavaScript inside a sandbox, manages
      the reactive <code>main()</code> loop, and exposes the capabilities
      a plugin uses (<code>prove()</code>, <code>openWindow()</code>,
      <code>useHeaders()</code>, …). Owns every protocol type the plugin
      and the host pass each other. Nothing in here knows whether it&apos;s
      running on a phone, in a browser, or in a Node CLI.
    </>
  ),
};

export default function MobileFlowDiagram({ platform = 'mobile' }: MobileFlowDiagramProps) {
  const layers: Layer[] = [consumerLayer(platform), adapterLayer(platform), SDK_LAYER];

  const [activeId, setActiveId] = useState<LayerId>('adapter');
  const active = layers.find((l) => l.id === activeId) ?? layers[1];

  return (
    <div className={styles.widget}>
      <div className={styles.stack}>
        {layers.map((layer, idx) => (
          <React.Fragment key={layer.id}>
            <button
              type="button"
              className={`${styles.layer} ${layer.id === activeId ? styles.active : ''} ${layer.id === 'consumer' ? styles.consumer : ''}`}
              onClick={() => setActiveId(layer.id)}
              aria-pressed={layer.id === activeId}
            >
              <span className={styles.layerTitle}>{layer.title}</span>
            </button>
            {idx < layers.length - 1 && <div className={styles.connector} aria-hidden="true" />}
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
