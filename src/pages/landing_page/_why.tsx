import type { ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../index.module.css';

interface Approach {
  name: string;
  verifiable: string;
  private: string;
  permissionless: string;
  highlight?: boolean;
}

const APPROACHES: Approach[] = [
  {
    name: 'Screenshots',
    verifiable: '✗ easily faked',
    private: '✓ Redaction possible',
    permissionless: '✓ Yes',
  },
  {
    name: 'OAuth',
    verifiable: '✓ Yes',
    private: '✗ platform sees everything',
    permissionless: '✗ requires server integration',
  },
  {
    name: 'TLSNotary',
    verifiable: '✓ cryptographic proof',
    private: '✓ selective disclosure (redaction or zero knowledge proofs)',
    permissionless: '✓ any HTTPS site',
    highlight: true,
  },
];

export default function WhySection(): ReactNode {
  return (
    <section className={styles.whySection}>
      <div className="container">
        <p className={styles.sectionLabel}>Why It Matters</p>
        <h2 className={styles.sectionTitle}>
          Existing approaches force tradeoffs
        </h2>

        <div className={styles.whyRow}>
          {/* Desktop table */}
          <div className={styles.whyTable}>
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Verifiable</th>
                  <th>Private</th>
                  <th>Permissionless</th>
                </tr>
              </thead>
              <tbody>
                {APPROACHES.map((a) => (
                  <tr
                    key={a.name}
                    className={clsx(a.highlight && styles.whyTableHighlight)}>
                    <td className={styles.whyTableApproach}>{a.name}</td>
                    <td><span>{a.verifiable}</span></td>
                    <td><span>{a.private}</span></td>
                    <td><span>{a.permissionless}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className={styles.whyCards}>
            {APPROACHES.map((a) => (
              <div
                key={a.name}
                className={clsx(
                  styles.whyCard,
                  a.highlight && styles.whyCardHighlight,
                )}>
                <div className={styles.whyCardTitle}>{a.name}</div>
                <div className={styles.whyCardRow}>
                  <span>Verifiable</span>
                  <span>{a.verifiable}</span>
                </div>
                <div className={styles.whyCardRow}>
                  <span>Private</span>
                  <span>{a.private}</span>
                </div>
                <div className={styles.whyCardRow}>
                  <span>Permissionless</span>
                  <span>{a.permissionless}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.whyTriangle}>
            <img
              src="/img/diagrams/tlsnotary_trilemma_triangle_light.svg#gh-light-mode-only"
              alt="TLSNotary satisfies all three: Verifiable, Private, Permissionless"
            />
            <img
              src="/img/diagrams/tlsnotary_trilemma_triangle_dark.svg#gh-dark-mode-only"
              alt="TLSNotary satisfies all three: Verifiable, Private, Permissionless"
            />
          </div>
        </div>
        <p className={styles.whyPunchline}>
          TLSNotary makes it possible to satisfy all three.
        </p>
      </div>
    </section>
  );
}
