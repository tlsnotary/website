import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import IconChrome from '@site/src/icons/IconChrome';

import styles from '../index.module.css';

/* --- Icons (lucide-style, stroke 2) --- */

function IconGlobe(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconLandmark(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

function IconHeartPulse(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}

function IconMessageCircle(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function IconBuilding(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2" />
    </svg>
  );
}

function IconMoreHorizontal(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function IconLock(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconShieldCheck(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconCheckCircle(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconCheck(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const SOURCES = [
  { label: 'Banking', icon: <IconLandmark /> },
  { label: 'Healthcare', icon: <IconHeartPulse /> },
  { label: 'Social media', icon: <IconMessageCircle /> },
  { label: 'Gov portals', icon: <IconBuilding /> },
  { label: 'and more...', icon: <IconMoreHorizontal /> },
];

const CLAIMS = [
  { label: 'Account balance', icon: <IconCheck /> },
  { label: 'Proof of identity', icon: <IconCheck /> },
  { label: 'Member since 2019', icon: <IconCheck /> },
  { label: 'and more...', icon: <IconMoreHorizontal /> },
];

export default function HeroSection(): ReactNode {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <Heading as="h1" className="hero__title">
              Verify user data from any website, with their consent.
            </Heading>
            <p className={styles.heroSubtext}>
              TLSNotary is an open-source library that uses cryptography to let users
              prove facts about their web data to third parties, with full control
              over what is shared.
            </p>
            <div className={styles.buttons}>
              <Link
                className={clsx('button button--lg', styles.heroPrimaryButton)}
                to="/docs/quick_start">
                Quick Start
              </Link>
              <a
                className={clsx('button button--lg', styles.heroGhostButton, styles.heroHideOnMobile)}
                href="https://demo.tlsnotary.org"
                rel="noopener noreferrer"
                target="_blank">
                <span>Try Demo</span>
                <IconChrome />
              </a>
              <Link
                className={styles.heroTextButton}
                to="/docs/intro">
                Documentation
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

          <div
            className={styles.heroDiagram}
            role="img"
            aria-label="TLSNotary proof flow: a user's data on any website flows through a TLS session and a cryptographic proof, producing verifiable claims the user can share.">
            <div className={styles.flowStage} aria-hidden="true">
              {/* Left card — Any Website */}
              <div className={styles.flowCard}>
                <div className={styles.flowIconCircle}><IconGlobe /></div>
                <h3 className={styles.flowCardTitle}>Any Website</h3>
                <ul className={styles.flowRows}>
                  {SOURCES.map((s) => (
                    <li key={s.label} className={styles.flowRow}>
                      <span className={styles.flowRowIcon}>{s.icon}</span>
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector: left card -> proof circle */}
              <div className={clsx(styles.flowConnector, styles.flowConnectorBlue)} />

              {/* Center — TLS session label + proof circle + caption */}
              <div className={styles.flowCenter}>
                <div className={styles.flowSessionLabel}>
                  <IconLock />
                  <span>TLS Session</span>
                </div>
                <div className={styles.flowVerticalTick} />
                <div className={styles.flowProofCircle}>
                  <IconShieldCheck />
                </div>
                <p className={styles.flowProofCaption}>Cryptographic Proof Generated</p>
              </div>

              {/* Connector: proof circle -> right card */}
              <div className={clsx(styles.flowConnector, styles.flowConnectorGreen)} />

              {/* Right card — Verifiable Claims */}
              <div className={clsx(styles.flowCard, styles.flowCardGreen)}>
                <div className={clsx(styles.flowIconCircle, styles.flowIconCircleGreen)}>
                  <IconCheckCircle />
                </div>
                <h3 className={styles.flowCardTitle}>Verifiable Claims</h3>
                <ul className={styles.flowRows}>
                  {CLAIMS.map((c) => (
                    <li key={c.label} className={clsx(styles.flowRow, styles.flowRowGreen)}>
                      <span className={styles.flowRowIcon}>{c.icon}</span>
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
                <p className={styles.flowCaptionLine1}>Share proofs, not raw data.</p>
                <p className={styles.flowCaptionLine2}>You stay in control.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
