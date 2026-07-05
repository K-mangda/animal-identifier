"use client";

import { useState, useRef, useEffect } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";
import { IdentifyResult } from "../types/animal";
import { addHistoryRecord, toggleSaveStatus, HistoryRecord } from "@/lib/history";

import ForestDecoration from '@/components/ForestDecoration';
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import UploadPanel from "@/components/UploadPanel";
import ResultPanel from "@/components/ResultPanel";
import SettingsPanel from "@/components/SettingsPanel";
import HistoryPanel from "@/components/HistoryPanel";

type NavId = "home" | "history" | "saved" | "settings";

export default function HomePage() {
  const [view, setView] = useState<"upload" | "result">("upload");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  
  // History states
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [lang, setLang] = useState<"en" | "th">("en");
  const [activeNav, setActiveNav] = useState<NavId>("home");
  const [toast, setToast] = useState<{message: string, type: "error"|"success"} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setSelectedIdx(0);
    setCurrentHistoryId(null);
    setIsSaved(false);
  };

  const handleIdentify = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const res = await fetch("/api/identify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64, mimeType: image.type }),
          });
          if (!res.ok) throw new Error(`${res.status}`);
          const data: IdentifyResult = await res.json();
          setResult(data);
          
          // Save to localforage immediately
          if (data.is_animal && data.candidates.length > 0) {
            try {
              const id = await addHistoryRecord(image, data);
              setCurrentHistoryId(id);
              setIsSaved(false);
              window.dispatchEvent(new Event("faunafy_history_updated"));
            } catch (saveErr) {
              console.error("Failed to save history", saveErr);
            }
          }

          setView("result"); // ← triggers the slide!
        } catch (e) {
          console.error(e);
          if (e instanceof Error && e.message === "429") {
            setToast({ 
              message: lang === "th" 
                ? "ระบบประมวลผลถูกจำกัดชั่วคราว (Rate Limit) รอสัก 10 วินาทีแล้วลองใหม่ครับ"
                : "Rate Limit Exceeded. Please wait 10 seconds and try again.", 
              type: "error" 
            });
          } else {
            setToast({ 
              message: lang === "th"
                ? "ไม่สามารถเชื่อมต่อ AI ได้ กรุณาตรวจสอบ GEMINI_API_KEY"
                : "Could not connect to AI. Please check your GEMINI_API_KEY.", 
              type: "error" 
            });
          }
        } finally {
          setIsLoading(false);
        }
      };
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!currentHistoryId) return;
    try {
      const updated = await toggleSaveStatus(currentHistoryId);
      if (updated) {
        setIsSaved(updated.isSaved);
        setToast({
          message: updated.isSaved ? "Saved to favorites!" : "Removed from favorites",
          type: "success"
        });
        window.dispatchEvent(new Event("faunafy_history_updated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectHistoryRecord = (record: HistoryRecord) => {
    setResult(record.result);
    setPreviewUrl(URL.createObjectURL(record.imageBlob));
    setImage(null); // It's from history, no need to re-identify
    setSelectedIdx(0);
    setCurrentHistoryId(record.id);
    setIsSaved(record.isSaved);
    setView("result");
    setActiveNav("home"); // Switch back to main view to see results
  };

  const handleBack = () => setView("upload");

  const handleReset = () => {
    setImage(null);
    setPreviewUrl(null);
    setResult(null);
    setCurrentHistoryId(null);
    setIsSaved(false);
    setView("upload");
  };

  // Determine what is currently visible inside the slideViewport
  // If activeNav isn't "home", we show a full-width panel covering the viewport.
  return (
    <div className={styles.container}>
      <ForestDecoration />

      <div className={`${styles.appWindow} ${view === "result" && activeNav === "home" ? styles.appWindowExpanded : ""}`}>
        
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        <div className={styles.slideViewport}>
          {activeNav === "home" && (
            <>
              <UploadPanel 
                view={view}
                lang={lang}
                setLang={setLang}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                isLoading={isLoading}
                previewUrl={previewUrl}
                image={image}
                fileRef={fileRef}
                cameraRef={cameraRef}
                processFile={processFile}
                handleIdentify={handleIdentify}
              />

              <ResultPanel 
                view={view}
                lang={lang}
                setLang={setLang}
                result={result}
                selectedIdx={selectedIdx}
                setSelectedIdx={setSelectedIdx}
                previewUrl={previewUrl}
                historyId={currentHistoryId}
                isSaved={isSaved}
                onToggleSave={handleToggleSave}
                handleBack={handleBack}
                handleReset={handleReset}
              />
            </>
          )}

          {activeNav === "history" && (
            <HistoryPanel lang={lang} showSavedOnly={false} onSelectRecord={handleSelectHistoryRecord} />
          )}

          {activeNav === "saved" && (
            <HistoryPanel lang={lang} showSavedOnly={true} onSelectRecord={handleSelectHistoryRecord} />
          )}

          {activeNav === "settings" && (
            <SettingsPanel lang={lang} />
          )}
        </div>
      </div>

      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

      {toast && (
        <div className={`${styles.toastNotification} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {toast.type === "error" ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
