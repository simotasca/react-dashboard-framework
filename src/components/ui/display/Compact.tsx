import styles from "./Compact.module.css";

export function Compact({ children }: React.PWC) {
  return <div data-slot="control" className={styles.compact}>{children}</div>;
}
