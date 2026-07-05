"use client";

import { useEffect, useState } from "react";
import { HistoryRecord, getAllHistoryRecords } from "@/lib/history";
import styles from "@/app/page.module.css";
import { Clock, Heart, Inbox } from "lucide-react";

interface HistoryPanelProps {
  lang: "en" | "th";
  showSavedOnly: boolean;
  onSelectRecord: (record: HistoryRecord) => void;
}

export default function HistoryPanel({ lang, showSavedOnly, onSelectRecord }: HistoryPanelProps) {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const all = await getAllHistoryRecords();
        if (showSavedOnly) {
          setRecords(all.filter(r => r.isSaved));
        } else {
          setRecords(all);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
    
    // Listen for updates from other panels
    window.addEventListener("faunafy_history_updated", fetchRecords);
    return () => window.removeEventListener("faunafy_history_updated", fetchRecords);
  }, [showSavedOnly]);

  return (
    <div className={styles.slidePanel} style={{ padding: "40px 20px", display: "flex", flexDirection: "column" }}>
      <div className={styles.header}>
        <h1 className={styles.title} style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          {showSavedOnly ? <Heart size={28} /> : <Clock size={28} />} 
          {showSavedOnly ? (lang === "en" ? "Saved" : "ที่บันทึกไว้") : (lang === "en" ? "History" : "ประวัติ")}
        </h1>
        <p className={styles.subtitle}>
          {showSavedOnly 
            ? (lang === "en" ? "Your favorite animal identifications" : "สัตว์ที่คุณชื่นชอบและบันทึกไว้")
            : (lang === "en" ? "Past identifications" : "ประวัติการค้นหาสายพันธุ์สัตว์ของคุณ")}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", marginTop: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.6)" }}>
            Loading...
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.4)" }}>
            <Inbox size={48} strokeWidth={1.5} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <p>{lang === "en" ? "No records found." : "ไม่พบประวัติ"}</p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", 
            gap: "16px",
            padding: "10px"
          }}>
            {records.map((r) => {
              const mainCandidate = r.result.candidates?.[0];
              const dateObj = new Date(r.timestamp);
              const dateStr = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "th-TH", {
                month: "short", day: "numeric"
              });
              const imgUrl = URL.createObjectURL(r.imageBlob);

              return (
                <div 
                  key={r.id} 
                  onClick={() => onSelectRecord(r)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s, background 0.2s",
                    border: "1px solid rgba(255,255,255,0.1)",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <img src={imgUrl} alt="History" style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                  {r.isSaved && (
                    <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: "4px" }}>
                      <Heart size={14} color="#ef4444" fill="#ef4444" />
                    </div>
                  )}
                  <div style={{ padding: "12px" }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {mainCandidate ? (lang === "en" ? mainCandidate.common_name_en : mainCandidate.common_name_th) : "Unknown"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                      {dateStr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
