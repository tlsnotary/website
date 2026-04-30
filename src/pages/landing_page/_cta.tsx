import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import styles from '../index.module.css';

export default function CtaSection(): ReactNode {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Start Building with TLSNotary</h2>
        <div className={styles.ctaButtons}>
          <Link
            className={clsx('button button--lg', styles.heroPrimaryButton)}
            to="/docs/quick_start">
            Quick Start
          </Link>
          <Link className={styles.heroTextButton} to="/docs/intro">
            Read the docs
            <svg
              className={styles.heroTextButtonArrow}
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
