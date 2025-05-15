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

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="766" height="112" viewBox="0 0 766 112" fill="none" >
          <path
            d="M7.08083 111.735C2.43838 111.735 -0.529098 106.775 1.65739 102.67L34.4815 41.045C35.5504 39.0382 37.6354 37.7849 39.9049 37.7849H82.9012V6.97233C82.9012 3.56887 85.6537 0.809822 89.0492 0.809822H187.417L175.121 19.2973H101.345V37.7849H704.221C705.276 37.7849 706.313 38.057 707.233 38.5749L761.94 69.3875C766.121 71.7428 766.121 77.7771 761.94 80.1324L707.233 110.945C706.313 111.463 705.276 111.735 704.221 111.735H7.08083Z"
            fill="#243F5F"
          />
        </svg>
      </div>
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

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              Check out our documentation
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="https://demo.tlsnotary.org">
              Try TLSNotary (Chrome Browser)
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="img/infographic.svg" />
          {/* <Image className="hidden md:block" src="/images/infographic.svg" alt="infographic" fill />
          <Image className="block md:hidden" src="/images/infographic-mobile.svg" alt="infographic mobile" fill /> */}
        </div>


        <section className={styles.introduction}>
          <div className="container">
            <h2 className={styles.borderBlue}>Build with us</h2>
            <p>
              Interested in using TLSNotary, contributing, or just learning more about how it works? Join the conversation on our Discord server, check out our Github, or use our Quick Start guide to try it out!
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="https://discord.gg/9XwESXtcN7">
                Join our Discord
              </Link>
            </div>
          </div>
        </section>

      </main>
    </Layout >
  );
}
