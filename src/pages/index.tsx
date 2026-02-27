import type { ReactNode } from 'react';
import Layout from '@theme/Layout';

import HeroSection from './landing_page/_hero';
import HowItWorksSection from './landing_page/_how-it-works';
import WhySection from './landing_page/_why';
import BuiltWithSection from './landing_page/_built-with';
import CtaSection from './landing_page/_cta';

export default function Home(): ReactNode {
  return (
    <Layout
      title="TLSNotary — Verify any web data"
      description="A Rust library for creating cryptographic proofs of HTTPS content. Works with any website. Nothing to install on the server.">
      <HeroSection />
      <main>
        <HowItWorksSection />
        <WhySection />
        <BuiltWithSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
