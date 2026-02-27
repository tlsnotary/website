import type { ReactNode } from 'react';

import styles from '../index.module.css';

const STEPS = [
  {
    number: '1',
    icon: '🔒',
    title: 'User browses normally',
    body: 'The user visits any web server: banking, social media, government portals. Nothing changes for the server.',
  },
  {
    number: '2',
    icon: '🤝',
    title: 'The verifier witnesses the encrypted data',
    body: 'Behind the scenes, TLSNotary splits the cryptographic keys between the user and a verifier. Neither side can cheat.',
  },
  {
    number: '3',
    icon: '✅',
    title: 'Share only what you choose',
    body: 'The user proves specific facts, like "my balance is over $1,000", without revealing their full statement. The verifier knows it\'s authentic.',
  },
];

export default function HowItWorksSection(): ReactNode {
  return (
    <section className={styles.howSection}>
      <div className="container">
        <p className={styles.sectionLabel}>How it works</p>
        <h2 className={styles.sectionTitle}>
          Simple for the user, cryptographically sound under the hood
        </h2>
        <div className={styles.howGrid}>
          {STEPS.map((step) => (
            <div key={step.number} className={styles.howStep}>
              <div className={styles.howStepIcon}>{step.icon}</div>
              <div className={styles.howStepNumber}>Step {step.number}</div>
              <h3 className={styles.howStepTitle}>{step.title}</h3>
              <p className={styles.howStepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
