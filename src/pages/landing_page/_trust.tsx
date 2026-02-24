import type { ReactNode } from 'react';

import styles from '../index.module.css';

const TRUST_ITEMS = [
  {
    icon: '\uD83D\uDD10',
    title: 'Pure Cryptography',
    body: 'No trusted hardware, no TEEs. TLSNotary relies on multi-party computation and standard cryptographic primitives — no supply chain risk.',
  },
  {
    icon: '\uD83C\uDF10',
    title: 'Server-Agnostic',
    body: 'No API integration required. If the site uses HTTPS, it works. The server never knows.',
  },
  {
    icon: '\uD83D\uDC41\uFE0F',
    title: 'Selective Disclosure',
    body: 'Reveal facts, not raw data. Zero-knowledge proofs let you prove properties of hidden data without exposing it.',
  },
  {
    icon: '\uD83D\uDCDC',
    title: 'Open Protocol',
    body: 'Apache 2.0 / MIT licensed. Built as a public good. No business model, no token, no rent-seeking.',
  },
  {
    icon: '\uD83C\uDFDB\uFE0F',
    title: 'Protocol, Not Platform',
    body: 'No token, no gatekeeper, no economic lock-in. TLSNotary is infrastructure anyone can build on.',
  },
];

export default function TrustSection(): ReactNode {
  return (
    <section className={styles.trustSection}>
      <div className="container">
        <p className={styles.sectionLabel}>Why Trust TLSNotary</p>
        <h2 className={styles.sectionTitle}>
          What Makes TLSNotary Different
        </h2>
        <p className={styles.sectionSubtitle}>
          Designed from first principles. Built as a public good.
        </p>
        <div className={styles.trustGrid}>
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className={styles.trustCard}>
              <div className={styles.trustCardIcon}>{item.icon}</div>
              <h3 className={styles.trustCardTitle}>{item.title}</h3>
              <p className={styles.trustCardBody}>{item.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.institutionalSupport}>
          Supported by Ethereum Foundation PSE
        </p>
      </div>
    </section>
  );
}
