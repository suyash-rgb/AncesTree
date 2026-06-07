import styles from "./CornerAccent.module.css";

const positionMap = {
  "top-left": "tl",
  "top-right": "tr",
  "bottom-left": "bl",
  "bottom-right": "br",
};

export default function CornerAccent({ position = "top-left" }) {
  const pos = positionMap[position] || "tl";
  return (
    <div className={`${styles.corner} ${styles[pos]}`}>
      <div className={styles.vine} />
    </div>
  );
}
