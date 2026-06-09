import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles.module.css';

type ActorId = 'sandbox' | 'window' | 'prover' | 'server' | 'verifier';
type ArrowId =
  | 'sandbox-window' // openWindow()
  | 'window-server' // real user HTTPS in the managed window
  | 'window-sandbox' // captured headers handed to the plugin
  | 'sandbox-prover' // prove() call
  | 'prover-server' // Prover's TLS connection to the server (during step 7)
  | 'prover-verifier-mpc' // 2PC TLS handshake
  | 'prover-verifier-reveal'; // selective disclosure

interface Step {
  num: number;
  title: string;
  detail: React.ReactNode;
  active: ActorId[];
  arrows: ArrowId[];
}

const STEPS: Step[] = [
  {
    num: 1,
    title: 'Plugin loads into a sandbox',
    detail: (
      <>
        The extension starts the plugin code inside a <strong>QuickJS WebAssembly sandbox</strong>.
        The plugin can&apos;t reach the network or filesystem on its own — every capability it
        has (open a window, read headers, call <code>prove()</code>) is something the extension
        explicitly hands it.
      </>
    ),
    active: ['sandbox'],
    arrows: [],
  },
  {
    num: 2,
    title: 'Plugin opens a managed window',
    detail: (
      <>
        The plugin calls <code>openWindow()</code>. The extension spawns a real browser window
        pointed at the target site — this is where the user signs in or navigates as they
        normally would.
      </>
    ),
    active: ['sandbox', 'window'],
    arrows: ['sandbox-window'],
  },
  {
    num: 3,
    title: 'Extension intercepts the window’s headers',
    detail: (
      <>
        For every HTTP request <em>inside that managed window only</em>, the extension uses{' '}
        <code>webRequest</code> to capture the headers — cookies, <code>Authorization</code>,
        CSRF tokens, anything Chrome would otherwise hide. Tabs the extension didn&apos;t open
        are untouched.
      </>
    ),
    active: ['window'],
    arrows: ['window-server'],
  },
  {
    num: 4,
    title: 'Captured headers flow back to the plugin',
    detail: (
      <>
        The plugin&apos;s <code>useHeaders()</code> / <code>useRequests()</code> hooks receive
        the intercepted data, so the plugin code can decide which request it wants to attest.
      </>
    ),
    active: ['window', 'sandbox'],
    arrows: ['window-sandbox'],
  },
  {
    num: 5,
    title: 'Plugin builds the request to prove',
    detail: (
      <>
        Armed with the live auth headers, the plugin constructs the exact request whose
        response it wants to attest — e.g.{' '}
        <code>GET https://api.x.com/users/show.json</code> with the user&apos;s real cookie
        attached.
      </>
    ),
    active: ['sandbox'],
    arrows: [],
  },
  {
    num: 6,
    title: 'Plugin calls prove() — the Prover takes over',
    detail: (
      <>
        Invoking <code>prove()</code> hands the request to the <strong>Prover</strong> — a
        WebAssembly implementation of the TLSNotary protocol that runs inside the extension&apos;s
        offscreen document.
      </>
    ),
    active: ['sandbox', 'prover'],
    arrows: ['sandbox-prover'],
  },
  {
    num: 7,
    title: 'Prover speaks TLS to the server, jointly with the Verifier',
    detail: (
      <>
        The <strong>Prover</strong> holds the actual connection to the server (raw TCP on
        mobile; a WebSocket-to-TCP proxy in the browser, since browsers can&apos;t open raw
        sockets). The Verifier participates in the TLS handshake under{' '}
        <strong>two-party computation</strong> — it co-signs each TLS record without ever
        seeing the plaintext. The server sees a normal TLS handshake on the wire.
      </>
    ),
    active: ['prover', 'verifier', 'server'],
    arrows: ['prover-server', 'prover-verifier-mpc'],
  },
  {
    num: 8,
    title: 'Prover selectively discloses the chosen bytes',
    detail: (
      <>
        The plugin&apos;s handlers chose which bytes to <strong>REVEAL</strong> (plaintext) and
        which to <strong>HASH</strong> (commitment only). The Prover opens just those byte
        ranges to the Verifier; everything else stays committed but unreadable.
      </>
    ),
    active: ['prover', 'verifier'],
    arrows: ['prover-verifier-reveal'],
  },
  {
    num: 9,
    title: 'Verifier accepts the attestation',
    detail: (
      <>
        The Verifier checks the disclosed bytes against the TLS transcript it co-signed back in
        step 7 and accepts them as authentic. It never had to trust the Prover, and it never
        saw the bytes the plugin didn&apos;t reveal.
      </>
    ),
    active: ['verifier'],
    arrows: [],
  },
];

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export default function ExtensionFlowDiagram(): JSX.Element {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const next = useCallback(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const isActor = (id: ActorId) => current.active.includes(id);
  const isArrow = (id: ArrowId) => current.arrows.includes(id);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>How a TLSNotary plugin makes a proof</h3>
        <p className={styles.subtitle}>
          Step through the flow with the buttons below (or ← / →).
        </p>
      </div>

      {/* Architecture diagram — fixed pixel layout for predictable arrow alignment. */}
      <div className={styles.architecture}>
        <div className={styles.arch}>
          {/* Extension umbrella (positioned absolutely to span the three left-column boxes) */}
          <div className={styles.extFrame}>
            <span className={styles.extLabel}>TLSNotary extension</span>
          </div>

          {/* Actor boxes — all absolutely positioned */}
          <div className={cx(styles.actor, styles.sandbox, isActor('sandbox') && styles.actorActive)}>
            <div className={styles.actorTitle}>
              <span className={styles.actorBadge}>sandbox</span>
              <span>Plugin code</span>
            </div>
            <p className={styles.actorMeta}>QuickJS WASM · no direct network or fs</p>
          </div>

          <div className={cx(styles.actor, styles.window, isActor('window') && styles.actorActive)}>
            <div className={styles.actorTitle}>
              <span className={styles.actorBadge}>window</span>
              <span>Managed window</span>
            </div>
            <p className={styles.actorMeta}>Real browser tab · user signs in here</p>
          </div>

          <div className={cx(styles.actor, styles.prover, isActor('prover') && styles.actorActive)}>
            <div className={styles.actorTitle}>
              <span className={styles.actorBadge}>prover</span>
              <span>Prover</span>
            </div>
            <p className={styles.actorMeta}>WASM · runs MPC-TLS</p>
          </div>

          <div className={cx(styles.actor, styles.server, isActor('server') && styles.actorActive)}>
            <div className={styles.actorTitle}>
              <span>Target server</span>
            </div>
            <p className={styles.actorMeta}>api.x.com · bank.com · …</p>
          </div>

          <div className={cx(styles.actor, styles.verifier, isActor('verifier') && styles.actorActive)}>
            <div className={styles.actorTitle}>
              <span>Verifier</span>
            </div>
            <p className={styles.actorMeta}>Co-signs TLS · checks revealed bytes</p>
          </div>

          {/* SVG arrows overlay — matches the 640×320 arch box pixel-for-pixel.
              Geometry: extension umbrella x=20-310; left-column boxes at x=70-270;
              right-column boxes at x=370-570. Sandbox y=24-94, Window y=120-190,
              Prover y=216-286 (Server/Verifier mirror Window/Prover y). */}
          <svg className={styles.arrows} viewBox="0 0 640 320" aria-hidden="true">
            <defs>
              <marker
                id="ext-arrow"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L9,4.5 L0,9 z" className={styles.arrowFill} />
              </marker>
              <marker
                id="ext-arrow-active"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L9,4.5 L0,9 z" className={styles.arrowFillActive} />
              </marker>
            </defs>

            {/* sandbox ↓ window (openWindow), x=140 in the 26px gap (y=94-120) */}
            <path
              d="M140 94 L140 120"
              className={cx(styles.line, isArrow('sandbox-window') && styles.lineActive)}
              markerEnd={isArrow('sandbox-window') ? 'url(#ext-arrow-active)' : 'url(#ext-arrow)'}
            />
            <text
              x="130"
              y="111"
              className={cx(styles.arrowLabel, isArrow('sandbox-window') && styles.arrowLabelActive)}
              textAnchor="end"
            >
              openWindow()
            </text>

            {/* window ↑ sandbox (headers handed to plugin), x=200 in the same gap */}
            <path
              d="M200 120 L200 94"
              className={cx(styles.line, isArrow('window-sandbox') && styles.lineActive)}
              markerEnd={isArrow('window-sandbox') ? 'url(#ext-arrow-active)' : 'url(#ext-arrow)'}
            />
            <text
              x="210"
              y="111"
              className={cx(styles.arrowLabel, isArrow('window-sandbox') && styles.arrowLabelActive)}
              textAnchor="start"
            >
              headers
            </text>

            {/* sandbox ↓ prover (prove()), routed on the LEFT margin (x≈30) so it skips
                around the window box without crossing any actor. */}
            <path
              d="M70 59 C 30 59, 30 251, 70 251"
              className={cx(styles.line, isArrow('sandbox-prover') && styles.lineActive)}
              markerEnd={isArrow('sandbox-prover') ? 'url(#ext-arrow-active)' : 'url(#ext-arrow)'}
              fill="none"
            />
            <text
              x="34"
              y="155"
              className={cx(styles.arrowLabel, isArrow('sandbox-prover') && styles.arrowLabelActive)}
              textAnchor="middle"
              transform="rotate(-90 34 155)"
            >
              prove()
            </text>

            {/* window ↔ server (bidirectional HTTPS in the user's managed tab). One line
                with arrowheads at both ends; label "HTTPS" sits above it in the gap. */}
            <path
              d="M272 155 L368 155"
              className={cx(styles.line, isArrow('window-server') && styles.lineActive)}
              markerStart={isArrow('window-server') ? 'url(#ext-arrow-active)' : 'url(#ext-arrow)'}
              markerEnd={isArrow('window-server') ? 'url(#ext-arrow-active)' : 'url(#ext-arrow)'}
            />
            <text
              x="320"
              y="147"
              className={cx(styles.arrowLabel, isArrow('window-server') && styles.arrowLabelActive)}
              textAnchor="middle"
            >
              HTTPS
            </text>

            {/* prover → server (diagonal). The Prover holds the actual TLS connection.
                Drawn always, but only highlighted in step 7. */}
            <path
              d="M272 220 L368 192"
              className={cx(styles.line, isArrow('prover-server') && styles.lineActive)}
              markerEnd={isArrow('prover-server') ? 'url(#ext-arrow-active)' : 'url(#ext-arrow)'}
            />
            <text
              x="320"
              y="200"
              className={cx(styles.arrowLabel, isArrow('prover-server') && styles.arrowLabelActive)}
              textAnchor="middle"
            >
              TLS
            </text>

            {/* prover ↔ verifier (MPC). Label flips to "REVEAL / HASH" during step 8. */}
            <path
              d="M272 251 L368 251"
              className={cx(
                styles.line,
                (isArrow('prover-verifier-mpc') || isArrow('prover-verifier-reveal')) &&
                  styles.lineActive,
              )}
              markerStart={
                isArrow('prover-verifier-mpc')
                  ? 'url(#ext-arrow-active)'
                  : isArrow('prover-verifier-reveal')
                    ? undefined
                    : 'url(#ext-arrow)'
              }
              markerEnd={
                isArrow('prover-verifier-mpc') || isArrow('prover-verifier-reveal')
                  ? 'url(#ext-arrow-active)'
                  : 'url(#ext-arrow)'
              }
            />
            <text
              x="320"
              y="243"
              className={cx(
                styles.arrowLabel,
                (isArrow('prover-verifier-mpc') || isArrow('prover-verifier-reveal')) &&
                  styles.arrowLabelActive,
              )}
              textAnchor="middle"
            >
              {isArrow('prover-verifier-reveal') ? 'REVEAL / HASH' : 'MPC'}
            </text>
          </svg>
        </div>
      </div>

      {/* Step description card */}
      <div className={styles.stepCard}>
        <div className={styles.stepHead}>
          <span className={styles.stepNum}>
            Step {current.num} <span className={styles.stepOf}>of {STEPS.length}</span>
          </span>
          <strong className={styles.stepTitle}>{current.title}</strong>
        </div>
        <p className={styles.stepDetail}>{current.detail}</p>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={prev}
          disabled={step === 0}
          aria-label="Previous step"
        >
          ← Prev
        </button>

        <div className={styles.dots} role="tablist" aria-label="Step navigation">
          {STEPS.map((s, i) => (
            <button
              key={s.num}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`Step ${s.num}: ${s.title}`}
              className={cx(styles.dot, i === step && styles.dotActive)}
              onClick={() => setStep(i)}
            >
              {s.num}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={next}
          disabled={step === STEPS.length - 1}
          aria-label="Next step"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
