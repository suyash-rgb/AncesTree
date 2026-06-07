import styles from "./Astrolabe.module.css";

export default function Astrolabe() {
  return (
    <header className={styles.astrolabe}>
      <h1 className={styles.brand}>AncesTree</h1>

      <div className={styles.ingestGroup}>
        <label className={styles.ingestLabel} htmlFor="repo-input">
          Repository Ingestion
        </label>
        <input
          id="repo-input"
          type="text"
          placeholder="git@github.com:owner/repo.git"
          className={styles.ingestInput}
        />
      </div>

      <div className={styles.controls}>
        <label className={styles.tokenToggle}>
          <input type="checkbox" />
          Auth Token
        </label>
        <button className={styles.syncButton} type="button">
          Refresh &amp; Sync Tree
        </button>
      </div>
    </header>
  );
}
