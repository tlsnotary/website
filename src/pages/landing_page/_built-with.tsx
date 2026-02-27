import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';

import styles from '../index.module.css';

const PROJECTS = [
  'Peer',
  'Opacity Labs',
  'vlayer',
  'Kapwork',
  'Keyring Network',
  'Usher Labs',
];

export default function BuiltWithSection(): ReactNode {
  return (
    <section className={styles.builtWithSection}>
      <div className="container">
        <p className={styles.builtWithLabel}>Teams building with TLSNotary</p>
        <div className={styles.builtWithLogos}>
          {PROJECTS.map((name) => (
            <span key={name} className={styles.builtWithName}>{name}</span>
          ))}
        </div>
        <p className={styles.builtWithLink}>
          <Link to="/use-cases">See more use cases details &rarr;</Link>
        </p>
      </div>
    </section>
  );
}
