"use client";
import styles from "./styles.module.scss";
import { RotateCcw } from "lucide-react";

function ReloadButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles.button} {...props}>
      <div className={styles.inner}>
        <RotateCcw strokeWidth={3} className={styles.icon_shadow_1} size={31} />
        <div className={styles.icon_shadow_2} />
        <RotateCcw strokeWidth={3} className={styles.icon} size={28} />
      </div>
    </button>
  );
}

export default ReloadButton;
