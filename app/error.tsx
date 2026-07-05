"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import styles from "./page.module.css";
import ForestDecoration from "@/components/ForestDecoration";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.container}>
      <ForestDecoration />
      <div className={styles.appWindow}>
        <div className={styles.notAnimalState} style={{ height: "100%", justifyContent: "center" }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: "20px" }} />
          <h2 className={styles.notAnimalTitle} style={{ fontSize: "24px" }}>Oops! Something went wrong</h2>
          <p className={styles.notAnimalText} style={{ maxWidth: "400px", margin: "0 auto 20px" }}>
            We encountered an unexpected error while processing your request. Please check your connection and try again.
          </p>
          <button className={styles.btnTryAgain} onClick={() => reset()} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 auto" }}>
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
