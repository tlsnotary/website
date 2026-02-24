import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import IconChrome from '@site/src/icons/IconChrome';

import styles from '../index.module.css';

const TRUST_CHIPS = [
  'Open Source',
  'Cryptography',
  '10+ Years',
  'Audit-friendly',
];

export default function HeroSection(): ReactNode {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Prove and verify web data.
        </Heading>
        <p className="hero__subtitle">
          TLSNotary is an open protocol for generating verifiable, private,
          permissionless proofs from any HTTPS website, without sharing passwords, without asking for permission<Link to="/disclaimer" className={styles.asterisk}>*</Link>{' '},
           and without exposing more than necessary.
        </p>
        <p className={styles.categoryFraming}>
          
          <strong>Verifiable &middot; Private &middot; Permissionless</strong>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            <span>Get Started</span>
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
        <div className={styles.trustChips}>
          {TRUST_CHIPS.map((chip) => (
            <span key={chip} className={styles.trustChip}>
              {chip}
            </span>
          ))}
        </div>
        <div className={styles.heroDiagram}>
          <img
            src="/img/screenshot_to_proof.png"
            alt="From screenshot to cryptographic proof with TLSNotary"
          />
        </div>
        <p className={styles.heroDiagramCaption}>
          An open protocol with a performant Rust implementation.
        </p>
      </div>
    </header>
  );
}
