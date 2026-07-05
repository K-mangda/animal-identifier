"use client";

import styles from "./page.module.css";
import PawIcon from "@/components/icons/PawIcon";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.appWindow} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div className={styles.dropzonePaw} style={{ animation: "pulse 1.5s infinite" }}>
            <PawIcon size={48} />
          </div>
          <h2 className={styles.notAnimalTitle}>Loading Faunafy...</h2>
        </div>
      </div>
    </div>
  );
}
