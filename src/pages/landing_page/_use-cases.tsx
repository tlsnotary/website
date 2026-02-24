import type { ReactNode } from 'react';

import styles from '../index.module.css';

const USE_CASES = [
  {
    emoji: '\uD83E\uDEAA',
    title: 'Identity & KYC',
    body: 'Build verification flows that prove age, citizenship, or legal status from government sites \u2014 without your users sharing raw credentials with you.',
  },
  {
    emoji: '\u2B50',
    title: 'Portable Reputation',
    body: 'Let users bring their Airbnb ratings, Uber scores, or professional reviews into your platform \u2014 verified, not self-reported.',
  },
  {
    emoji: '\uD83C\uDFE6',
    title: 'Financial Proofs',
    body: 'Enable proof of balance, income, or account standing from banking sites \u2014 without exposing account numbers or transaction history.',
  },
  {
    emoji: '\uD83C\uDFE5',
    title: 'Health Records',
    body: 'Allow users to share specific medical data from health portals while keeping the rest of their history private.',
  },
  {
    emoji: '\uD83D\uDD10',
    title: 'Account Ownership',
    body: 'Verify a user controls a Google, Apple, or social media account \u2014 no OAuth integration, no password sharing.',
  },
  {
    emoji: '\uD83C\uDF93',
    title: 'Credential Verification',
    body: 'Verify degrees, certifications, or employment history directly from university and employer portals.',
  },
  {
    emoji: '\uD83C\uDF10',
    title: 'Any HTTPS Website',
    body: 'If the data source uses HTTPS, you can build on it. No API, no partnership, no server-side changes needed.',
  },
];

export default function UseCasesSection(): ReactNode {
  return (
    <section className={styles.useCasesSection}>
      <div className="container">
        <p className={styles.sectionLabel}>Use Cases</p>
        <h2 className={styles.sectionTitle}>What can you build?</h2>
        <p className={styles.sectionSubtitle}>
          TLSNotary works with any HTTPS website. Here&apos;s what developers are
          building today.
        </p>
        <div className={styles.useCasesGrid}>
          {USE_CASES.map((uc) => (
            <div key={uc.title} className={styles.useCaseCard}>
              <div className={styles.useCaseEmoji}>{uc.emoji}</div>
              <h3 className={styles.useCaseTitle}>{uc.title}</h3>
              <p className={styles.useCaseBody}>{uc.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
