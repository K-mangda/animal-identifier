"use client";

import { useState, useRef, useEffect } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";
import { IdentifyResult } from "../types/animal";

import ForestDecoration from '@/components/ForestDecoration';
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import UploadPanel from "@/components/UploadPanel";
import ResultPanel from "@/components/ResultPanel";

type NavId = "home" | "history" | "saved" | "settings";

export default function HomePage() {
  const [view, setView] = useState<"upload" | "result">("upload");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
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

  const handleBack = () => setView("upload");

  const handleReset = () => {
    setImage(null);
    setPreviewUrl(null);
    setResult(null);
    setView("upload");
  };

  return (
    <div className={styles.container}>
      {/* Forest decoration layer */}
      <ForestDecoration />

      <div className={`${styles.appWindow} ${view === "result" ? styles.appWindowExpanded : ""}`}>
        
        {/* ── Desktop Sidebar ── */}
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* ── Slide Viewport (clips the animation) ── */}
        <div className={styles.slideViewport}>
          
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
            handleBack={handleBack}
            handleReset={handleReset}
          />

        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`${styles.toastNotification} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {toast.type === "error" ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
