"use client";

import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import { Settings, Leaf } from "lucide-react";

export default function SettingsPanel({ lang }: { lang: "en" | "th" }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("faunafy_animations");
    if (saved !== null) {
      setAnimationsEnabled(saved === "true");
    }
  }, []);

  const toggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem("faunafy_animations", newValue.toString());
    // Dispatch a custom event so ForestDecoration can pick it up immediately
    window.dispatchEvent(new Event("faunafy_settings_changed"));
  };

  return (
    <div className={styles.slidePanel} style={{ padding: "40px 20px" }}>
      <div className={styles.header}>
        <h1 className={styles.title} style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <Settings size={28} /> {lang === "en" ? "Settings" : "การตั้งค่า"}
        </h1>
        <p className={styles.subtitle}>
          {lang === "en" ? "Customize your Faunafy experience" : "ปรับแต่งการใช้งาน Faunafy ของคุณ"}
        </p>
      </div>

      <div style={{ maxWidth: "500px", margin: "40px auto", background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Leaf size={24} className={styles.iconTint} />
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#fff", margin: 0 }}>
                {lang === "en" ? "Background Animations" : "แอนิเมชันพื้นหลัง"}
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>
                {lang === "en" ? "Toggle fireflies and falling leaves (saves battery)" : "เปิด/ปิด หิ่งห้อยและใบไม้ร่วง (ช่วยประหยัดแบตเตอรี่)"}
              </p>
            </div>
          </div>
          
          <button 
            onClick={toggleAnimations}
            style={{
              width: "48px",
              height: "28px",
              background: animationsEnabled ? "#4ade80" : "rgba(255,255,255,0.2)",
              borderRadius: "20px",
              position: "relative",
              cursor: "pointer",
              border: "none",
              transition: "background 0.3s ease"
            }}
          >
            <div style={{
              width: "24px",
              height: "24px",
              background: "#fff",
              borderRadius: "50%",
              position: "absolute",
              top: "2px",
              left: animationsEnabled ? "22px" : "2px",
              transition: "left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }} />
          </button>
        </div>
      </div>
    </div>
  );
}
