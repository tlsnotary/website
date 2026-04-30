import type { ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../index.module.css';

export default function HowItWorksSection(): ReactNode {
  return (
    <section className={styles.howSection}>
      <div className="container">
        <div className={styles.howHead}>
          <p className={styles.sectionLabel}>How it works</p>
          <h2 className={styles.sectionTitle}>
            Simple for the user, cryptographically sound under the hood
          </h2>
        </div>

        <div className={styles.howFrames} role="list" aria-label="Three protocol frames for the TLSNotary flow">
          {/* Frame 01 — user browsing a normal site */}
          <div className={styles.howFrame} role="listitem">
            <div className={styles.howCopy}>
              <h3 className={styles.howFrameTitle}>
                <span className={styles.howFrameTitleNum}>1.</span> User browses normally
              </h3>
              <p className={styles.howFrameBody}>
                The user visits any web server: banking, social media, government portals. Nothing changes for the server.
              </p>
            </div>
            <div className={styles.howStage}>
              <div className={styles.howBrowser} aria-hidden="true">
                <div className={styles.howBrowserBar}>
                  <span className={styles.howBrowserTl} />
                  <span className={styles.howBrowserTl} />
                  <span className={styles.howBrowserTl} />
                  <span className={styles.howBrowserUrl}>bank.example.com</span>
                </div>
                <div className={styles.howBrowserPage}>
                  <div className={clsx(styles.howBrowserLine, styles.howBrowserLine60)} />
                  <div className={clsx(styles.howBrowserLine, styles.howBrowserLine85)} />
                  <div className={clsx(styles.howBrowserLine, styles.howBrowserLine40)} />
                  <div className={clsx(styles.howBrowserLine, styles.howBrowserLineTall)} />
                  <div className={clsx(styles.howBrowserLine, styles.howBrowserLine75)} />
                </div>
              </div>
            </div>
          </div>

          {/* Frame 02 — three-node witness handshake */}
          <div className={styles.howFrame} role="listitem">
            <div className={styles.howCopy}>
              <h3 className={styles.howFrameTitle}>
                <span className={styles.howFrameTitleNum}>2.</span> The verifier witnesses the encrypted data
              </h3>
              <p className={styles.howFrameBody}>
                With TLSNotary the verifier makes sure the user can not cheat.
              </p>
            </div>
            <div className={styles.howStage}>
              <svg
                className={styles.howWitnessSvg}
                viewBox="0 0 260 150"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                {/* encrypted wires */}
                <line x1="48" y1="94" x2="212" y2="94" strokeDasharray="3 4" />
                <line x1="48" y1="94" x2="130" y2="36" strokeDasharray="3 4" />
                <line x1="130" y1="36" x2="212" y2="94" strokeDasharray="3 4" />

                {/* user node */}
                <circle cx="48" cy="94" r="18" className={styles.howWitnessMask} />
                <circle cx="48" cy="86" r="5" />
                <path d="M36 104 C 38 95, 58 95, 60 104" />
                <text x="48" y="128" fill="currentColor" stroke="none" fontFamily="ui-monospace, monospace" fontSize="8" textAnchor="middle" letterSpacing="0.8">USER</text>

                {/* verifier node (accented) */}
                <circle cx="130" cy="36" r="18" className={styles.howWitnessMask} stroke="#3B82F6" strokeWidth="1.4" />
                <path d="M122 36 L128 42 L138 30" stroke="#3B82F6" strokeWidth="1.4" />
                <text x="130" y="14" fill="#3B82F6" stroke="none" fontFamily="ui-monospace, monospace" fontSize="8" textAnchor="middle" letterSpacing="0.8">VERIFIER</text>

                {/* server node */}
                <circle cx="212" cy="94" r="18" className={styles.howWitnessMask} />
                <rect x="202" y="86" width="20" height="14" rx="1.5" />
                <line x1="205" y1="90" x2="209" y2="90" />
                <line x1="205" y1="94" x2="219" y2="94" />
                <text x="212" y="128" fill="currentColor" stroke="none" fontFamily="ui-monospace, monospace" fontSize="8" textAnchor="middle" letterSpacing="0.8">SERVER</text>

                {/* witness halo */}
                <circle cx="130" cy="36" r="22" stroke="#3B82F6" strokeOpacity="0.35" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>

          {/* Frame 03 — redacted transcript with one revealed line */}
          <div className={styles.howFrame} role="listitem">
            <div className={styles.howCopy}>
              <h3 className={styles.howFrameTitle}>
                <span className={styles.howFrameTitleNum}>3.</span> Share only what you choose
              </h3>
              <p className={styles.howFrameBody}>
                The user is in full control of what is shared. The verifier knows it is authentic.
              </p>
            </div>
            <div className={styles.howStage}>
              <div className={styles.howRedact} aria-hidden="true">
                <div className={styles.howRedactRow}>
                  <span className={styles.howRedactKey}>name</span>
                  <span className={clsx(styles.howRedactValue, styles.howRedactHidden)} />
                </div>
                <div className={styles.howRedactRow}>
                  <span className={styles.howRedactKey}>acct_no</span>
                  <span className={clsx(styles.howRedactValue, styles.howRedactHidden)} />
                </div>
                <div className={styles.howRedactRow}>
                  <span className={styles.howRedactKey}>balance</span>
                  <span className={clsx(styles.howRedactValue, styles.howRedactShown)}>
                    <span className={styles.howRedactTick}>✓</span>
                    &gt; $80,000
                  </span>
                </div>
                <div className={styles.howRedactRow}>
                  <span className={styles.howRedactKey}>since</span>
                  <span className={clsx(styles.howRedactValue, styles.howRedactHidden)} />
                </div>
                <div className={styles.howRedactRow}>
                  <span className={styles.howRedactKey}>address</span>
                  <span className={clsx(styles.howRedactValue, styles.howRedactHidden)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
