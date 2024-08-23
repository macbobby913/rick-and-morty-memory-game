"use client";
import styles from "./styles.module.scss";
import { RotateCcw } from "lucide-react";

function index() {
  return (
    <button
      className={styles.outer}
      onClick={() => {
        window.location.reload();
      }}
    >
      <div className={styles.inner}>
        <RotateCcw className={styles.icon} strokeWidth={3} size={30} />
        <RotateCcw className={styles.icon_shadow} strokeWidth={6} size={30} />
      </div>
    </button>
  );
}

export default index;
