import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import IconChrome from '@site/src/icons/IconChrome';

import styles from '../index.module.css';

import DiagramLight from '@site/diagrams/light/tlsnotary_what.svg';
import DiagramDark from '@site/diagrams/dark/tlsnotary_what.svg';

export default function HeroSection(): ReactNode {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <p className={styles.heroQuestion}>
          How do you access verified user data from existing websites in your app?
        </p>
        <Heading as="h1" className="hero__title">
          Verify user data from any website,<br />with their consent.
        </Heading>
        <p className={styles.heroSubtext}>
          TLSNotary is an open-source library that uses cryptography to let users
          prove facts about their web data to third parties, with full control
          over what is shared.
        </p>
        <div className={styles.heroDiagram}>
          <DiagramLight
            className="light-mode-only"
            role="img"
            aria-label="TLSNotary: verify user data from existing websites into your app"
          />
          <DiagramDark
            className="dark-mode-only"
            role="img"
            aria-label="TLSNotary: verify user data from existing websites into your app"
          />
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/quick_start">
            Quick Start
          </Link>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Documentation
          </Link>
          <a
            className="button button--primary button--lg"
            href="https://demo.tlsnotary.org"
            rel="noopener noreferrer"
            target="_blank">
            <span>Try Demo</span>
            <IconChrome />
          </a>
        </div>
      </div>
    </header>
  );
}
