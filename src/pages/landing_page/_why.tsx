import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';

import styles from '../index.module.css';

const PILLARS = [
  {
    title: 'Universal',
    body: 'No server changes needed. Works with any HTTPS website.',
  },
  {
    title: 'Open Source',
    body: 'Apache 2.0 / MIT licensed. Built as a public good, no vendor lock-in.',
  },
  {
    title: 'Private',
    body: 'Choose exactly what to reveal. Redact everything else. Zero-knowledge proofs for sensitive data.',
  },
  {
    title: 'Secure',
    body: 'Pure cryptography. No trusted hardware. Multi-party computation and state of the art cryptographic primitives.',
  },
];

export default function WhySection(): ReactNode {
  return (
    <section className={styles.whySection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          Why TLSNotary?
        </h2>
        <p className={styles.sectionSubtitle}>
          10+ years of research. Developed at the Ethereum Foundation.
        </p>
        <div className={styles.whyGrid}>
          {PILLARS.map((p) => (
            <div key={p.title} className={styles.whyCard}>
              <h3 className={styles.whyCardHeading}>{p.title}</h3>
              <p className={styles.whyCardBody}>{p.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.whyReadMore}>
          <Link to="/why">Read more about why TLSNotary &rarr;</Link>
        </p>
      </div>
    </section>
  );
}
