import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from '../index.module.css';

function UniversalVisual(): ReactNode {
  return (
    <div className={styles.whySites} aria-hidden="true">
      <div className={styles.whySite} />
      <div className={styles.whySite} />
      <div className={clsx(styles.whySite, styles.whySiteActive)} />
      <div className={styles.whySite} />
      <div className={styles.whySite} />
    </div>
  );
}

function OpenSourceVisual(): ReactNode {
  return (
    <span className={styles.whyBraces} aria-hidden="true">
      {'{\u00A0\u00A0}'}
    </span>
  );
}

function PrivateVisual(): ReactNode {
  return (
    <div className={styles.whyRedactMini} aria-hidden="true">
      <div className={clsx(styles.whyRedactMiniRow, styles.whyRedactMiniRowHidden)} />
      <div className={clsx(styles.whyRedactMiniRow, styles.whyRedactMiniRowHidden)} />
      <div className={clsx(styles.whyRedactMiniRow, styles.whyRedactMiniRowShown)}>
        <span className={styles.whyRedactMiniTick}>✓</span>
      </div>
      <div className={clsx(styles.whyRedactMiniRow, styles.whyRedactMiniRowHidden)} />
    </div>
  );
}

function SecureVisual(): ReactNode {
  return (
    <svg
      className={styles.whyKeySvg}
      viewBox="0 0 100 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="18" cy="20" r="10" />
      <circle cx="18" cy="20" r="3" fill="currentColor" stroke="none" />
      <line x1="28" y1="20" x2="92" y2="20" />
      <line x1="70" y1="20" x2="70" y2="28" />
      <line x1="82" y1="20" x2="82" y2="26" />
    </svg>
  );
}

function PortableVisual(): ReactNode {
  return (
    <svg
      className={styles.whyPortableSvg}
      viewBox="0 0 50 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M28 20 L20 20 L20 38 L38 38 L38 30" />
      <line x1="24" y1="34" x2="42" y2="16" />
      <polyline points="32 16 42 16 42 26" />
    </svg>
  );
}

const PILLARS: Array<{
  title: string;
  body: string;
  wide: boolean;
  visual: ReactNode;
}> = [
  {
    title: 'Universal',
    body: 'No server changes needed. Works with any HTTPS website.',
    wide: true,
    visual: <UniversalVisual />,
  },
  {
    title: 'Open Source',
    body: 'Apache 2.0 / MIT licensed. Built as a public good, no vendor lock-in.',
    wide: false,
    visual: <OpenSourceVisual />,
  },
  {
    title: 'Private',
    body: 'Choose exactly what to reveal. Redact everything else. Zero-knowledge proofs for sensitive data.',
    wide: false,
    visual: <PrivateVisual />,
  },
  {
    title: 'Secure',
    body: 'Pure cryptography. No trusted hardware. Multi-party computation and state of the art cryptographic primitives.',
    wide: false,
    visual: <SecureVisual />,
  },
  {
    title: 'Portable',
    body: 'Your data moves with you. Break free from walled gardens while keeping your history and reputation.',
    wide: false,
    visual: <PortableVisual />,
  },
];

export default function WhySection(): ReactNode {
  return (
    <section className={styles.whySection}>
      <div className="container">
        <p className={styles.sectionLabel}>Why TLSNotary?</p>
        <h2 className={styles.sectionTitle}>
          10+ years of research. Developed at the Ethereum Foundation
        </h2>
        <div className={styles.whyGrid}>
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className={clsx(styles.whyCard, p.wide ? styles.whyCardWide : styles.whyCardNarrow)}>
              {p.wide ? (
                <>
                  <div className={styles.whyCardText}>
                    <h3 className={styles.whyCardHeading}>{p.title}</h3>
                    <p className={styles.whyCardBody}>{p.body}</p>
                  </div>
                  <div className={styles.whyCardVisual}>{p.visual}</div>
                </>
              ) : (
                <>
                  <div className={styles.whyCardVisual}>{p.visual}</div>
                  <div className={styles.whyCardText}>
                    <h3 className={styles.whyCardHeading}>{p.title}</h3>
                    <p className={styles.whyCardBody}>{p.body}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className={styles.whyCta}>
          <Link to="/why" className={styles.whyCtaLink}>
            Read more about why TLSNotary
            <svg
              className={styles.whyCtaLinkArrow}
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
