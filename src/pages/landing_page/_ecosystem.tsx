import type { ReactNode } from 'react';

import ProjectList from '@site/src/components/ProjectList';
import styles from '../index.module.css';

export default function EcosystemSection(): ReactNode {
  return (
    <section className={styles.ecosystemSection}>
      <div className="container">
        <p className={styles.sectionLabel}>Ecosystem</p>
        <h2 className={styles.sectionTitle}>Built on an Open Protocol</h2>
        <p className={styles.sectionSubtitle}>
          TLSNotary is an open protocol. Independent teams build SDKs, networks,
          and applications on top of it.
        </p>
        <ProjectList />
      </div>
    </section>
  );
}
