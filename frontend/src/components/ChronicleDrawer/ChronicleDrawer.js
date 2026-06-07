"use client";

import styles from "./ChronicleDrawer.module.css";

export default function ChronicleDrawer({ isOpen, commitData, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close drawer"
          className={styles.backdrop}
          onClick={() => onClose && onClose()}
        />
      )}

      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Chronicle</h2>
          <p className={styles.drawerSubtitle}>commit details</p>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={() => onClose && onClose()}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.drawerBody}>
          {commitData ? (
            <>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Commit</h3>
                <span className={styles.hash}>{commitData.hash}</span>
                <span className={styles.message}>{commitData.message}</span>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Author</h3>
                <span className={styles.message}>{commitData.author}</span>
                <span className={styles.meta}>{commitData.date}</span>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>References</h3>
                <span className={styles.emptyDash}>—</span>
              </div>
            </>
          ) : (
            <p className={styles.emptyState}>
              Click a commit node in the canvas
              <br />
              to reveal its chronicle.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
