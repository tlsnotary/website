import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="">
          <p>TLSNotary is an open-source protocol that can verify the authenticity of TLS data while protecting privacy. If you're looking for a way to make data portable without compromising on security, check out the protocol and integrate it into your applications!</p>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Check out our documentation
          </Link>
        </div>
        <br />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://demo.tlsnotary.org">
            Try TLSNotary (Chrome Browser)
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <section className={styles.introduction}>
          <div className="container">
            <h2 className={styles.borderBlue}>Why use TLSNotary?</h2>
            <p>TLS (Transport Layer Security), also known as the "s" in "https" 🔐, can secure communication between a server and a user. But what if you want to credibly share data with others without compromising security, privacy, or control?
            </p>
            <p>TLSNotary solves this by adding a Verifier to the TLS connection using secure Multi-Party Computation (MPC). MPC provides cryptographic guarantees, allowing the Verifier to authenticate the TLS transcript without requiring external trust or revealing the complete data to anyone. TLSNotary can sign (aka notarize) data and make it portable in a privacy preserving way.
            </p>
            <p>With TLSNotary, users are in full control over the data they choose to share.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
