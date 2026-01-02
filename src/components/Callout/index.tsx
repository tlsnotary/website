import styles from './styles.module.css';

export default function Callout({ children }) {
  return (
    <div className={styles.callout}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
