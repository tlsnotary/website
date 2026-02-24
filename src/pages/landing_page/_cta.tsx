import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import IconDiscord from '@site/src/icons/IconDiscord';

import styles from '../index.module.css';

export default function CtaSection(): ReactNode {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Start Building with TLSNotary</h2>
        <p className={styles.sectionSubtitle}>
          Explore the documentation, run the Quick Start, or join the community.
        </p>
        <div className={styles.ctaButtons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the Docs
          </Link>
          <Link
            className="button button--primary button--lg"
            to="/docs/quick_start">
            Quick Start
          </Link>
          <a
            className="button button--primary button--lg"
            href="https://discord.com/invite/9XwESXtcN7"
            rel="noopener noreferrer"
            target="_blank">
            <span>Join Discord</span>
            <IconDiscord />
          </a>
        </div>
        <div className={styles.ctaSecondaryLinks}>
          <a
            href="https://tlsnotary.github.io/tlsn/tlsn/"
            rel="noopener noreferrer"
            target="_blank">
            API Reference
          </a>
          <a
            href="https://github.com/tlsnotary"
            rel="noopener noreferrer"
            target="_blank">
            GitHub
          </a>
          <a
            href="https://github.com/tlsnotary/tlsn/releases"
            rel="noopener noreferrer"
            target="_blank">
            Release Notes
          </a>
        </div>
      </div>
    </section>
  );
}
