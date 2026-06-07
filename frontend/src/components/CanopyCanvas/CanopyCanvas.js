"use client";

import CornerAccent from "../CornerAccent/CornerAccent";
import DummyTree from "../DummyTree/DummyTree";
import styles from "./CanopyCanvas.module.css";

export default function CanopyCanvas({ onCommitClick }) {
  return (
    <section className={styles.canvas}>
      <CornerAccent position="top-left" />
      <CornerAccent position="top-right" />
      <CornerAccent position="bottom-left" />
      <CornerAccent position="bottom-right" />

      <div className={styles.tree}>
        <DummyTree onCommitClick={onCommitClick} />
      </div>
    </section>
  );
}
