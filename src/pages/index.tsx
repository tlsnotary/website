import type { ReactNode } from 'react';
import Layout from '@theme/Layout';

import HeroSection from './landing_page/_hero';
import ExplainerSection from './landing_page/_explainer';
import WhySection from './landing_page/_why';
import UseCasesSection from './landing_page/_use-cases';
import EcosystemSection from './landing_page/_ecosystem';
import TrustSection from './landing_page/_trust';
import CtaSection from './landing_page/_cta';

export default function Home(): ReactNode {
  return (
    <Layout
      title="TLSNotary — Trusted data from anywhere on the internet"
      description="TLSNotary lets users securely share verified data from any website — without APIs, without sharing passwords, and without compromising privacy.">
      <HeroSection />
      <main>
        <ExplainerSection />
        <WhySection />
        <UseCasesSection />
        <EcosystemSection />
        <TrustSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
