import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import actioncard_styles from "../components/ActionCard/styles.module.css";
import IconChrome from '@site/src/icons/IconChrome';
import TLSNotaryTable from './landing_page/_table.md';
import Why from './landing_page/_why.md';
import Build from './landing_page/_build.md';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
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
        <div className="margin-top--xl">
          <p>TLSNotary is an open-source protocol that can verify the authenticity of TLS data while protecting privacy. If you're looking for a way to make data portable without compromising on security, check out the protocol and integrate it into your applications!</p>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Secure Data Verification`}
      description="TLSNotary - Verify the authenticity of TLS data while protecting privacy. Make data portable without compromising security.">
      <HomepageHeader />

      <main>
        <section className={styles.introduction}>
          <div className="container text--center">
            <Heading as="h2" className="text--center margin-bottom--xl">Why use TLSNotary?</Heading>
            <Why />
          </div>
        </section>

        <section className={styles.introduction}>
          <div className="container text--center">
            <img
              src="img/infographic.svg"
              alt="TLSNotary Infographic"
              className="margin-bottom--lg"
            />
          </div>
        </section>

        <section className={styles.introduction}>
          <div className="container text--center">
            <Build />
            <div className="margin-top--lg">
              <Link
                className="button button--primary button--lg"
                to="/docs/intro">
                <span>Start Building</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
