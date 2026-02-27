import type { ReactNode } from 'react';

import styles from '../index.module.css';

const STEPS = [
  {
    number: 1,
    title: 'Connect',
    body: 'User browses any HTTPS website normally. A Verifier participates via MPC. The server sees a standard TLS connection and is unaware.',
  },
  {
    number: 2,
    title: 'Prove',
    body: 'User selectively reveals chosen data. Redactions supported. Zero-knowledge proofs can prove properties of hidden data.',
  },
  {
    number: 3,
    title: 'Verify',
    body: 'Verifier validates the proof. No trust in the user required.',
  },
];

export default function ExplainerSection(): ReactNode {
  return (
    <section className={styles.explainerSection}>
      <div className="container">
        <p className={styles.sectionLabel}>How It Works</p>
        <h2 className={styles.sectionTitle}>
          Three steps. Any website. No server changes.
        </h2>
        <p className={styles.sectionSubtitle}>
          A Prover, a Verifier, and any HTTPS server<br/>no server
          modifications, no API keys, no cooperation required.
        </p>
        <div className={styles.explainerVisual}>
          <img
            src="/img/diagrams/overview_prover_verifier_light.svg#gh-light-mode-only"
            alt="TLSNotary protocol: Prover, Server, and Verifier"
          />
          <img
            src="/img/diagrams/overview_prover_verifier_dark.svg#gh-dark-mode-only"
            alt="TLSNotary protocol: Prover, Server, and Verifier"
          />
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.explainerBridge}>
          Integrate as a Rust library, run the Verifier as a server, or embed in
          a browser extension.{' '}
          <a href="/docs/quick_start">See the Quick Start &rarr;</a>
        </p>
      </div>
    </section>
  );
}
