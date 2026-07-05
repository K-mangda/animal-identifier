"use client";

import { useState, useRef, useEffect } from "react";
import {
  Home, Clock, Heart, Settings, Camera,
  MapPin, Utensils, Globe, Clock3,
  AlertTriangle, Info, CheckCircle2, ArrowLeft,
  Scale, Activity, Leaf, ShieldAlert, Search
} from "lucide-react";
import styles from "./page.module.css";
import { AnimalCandidate, IdentifyResult } from "../types/animal";

import PawIcon from '@/components/icons/PawIcon';
import ConservationBadge from '@/components/ConservationBadge';
import ForestDecoration from '@/components/ForestDecoration';
import SpeciesThumbnail from '@/components/SpeciesThumbnail';
/* ─── Main Page ───────────────────────────────────────── */
export default function HomePage() {
  const [view, setView] = useState<"upload" | "result">("upload");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lang, setLang] = useState<"en" | "th">("en");
  const [activeNav, setActiveNav] = useState<"home" | "history" | "saved" | "settings">("home");
  const [toast, setToast] = useState<{message: string, type: "error"|"success"} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const selected: AnimalCandidate | null = result?.candidates?.[selectedIdx] ?? null;

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

  const navItems = [
    { id: "home" as const,     icon: <Home size={20} />,     label: "Home" },
    { id: "history" as const,  icon: <Clock size={20} />,    label: "History" },
    { id: "saved" as const,    icon: <Heart size={20} />,    label: "Saved" },
    { id: "settings" as const, icon: <Settings size={20} />, label: "Settings" },
  ];

  const detailItems = selected
    ? [
        { icon: <MapPin size={14} />,   label: lang === "en" ? "Habitat" : "ถิ่นที่อยู่",  value: lang === "en" ? selected.habitat_en : selected.habitat_th },
        { icon: <Utensils size={14} />, label: lang === "en" ? "Diet" : "อาหาร",     value: lang === "en" ? selected.diet_en : selected.diet_th },
        { icon: <Clock3 size={14} />,   label: lang === "en" ? "Lifespan" : "อายุขัย", value: lang === "en" ? selected.lifespan_en : selected.lifespan_th },
        { icon: <Globe size={14} />,    label: lang === "en" ? "Range" : "พื้นที่อาศัย",    value: lang === "en" ? selected.geographic_range_en : selected.geographic_range_th },
      ]
    : [];

  return (
    <div className={styles.container}>
      {/* Forest decoration layer */}
      <ForestDecoration />

      <div className={`${styles.appWindow} ${view === "result" ? styles.appWindowExpanded : ""}`}>

        {/* ── Desktop Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <svg className={styles.sidebarCorners} viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#c8a84b" />
                </linearGradient>
              </defs>
              <path d="M 16 2 L 14 2 A 12 12 0 0 0 2 14 L 2 16" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 28 2 L 30 2 A 12 12 0 0 1 42 14 L 42 16" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 16 42 L 14 42 A 12 12 0 0 1 2 30 L 2 28" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 28 42 L 30 42 A 12 12 0 0 0 42 30 L 42 28" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <PawIcon size={24} />
          </div>
          <nav className={styles.sidebarNav}>
            {navItems.map(({ id, icon }) => (
              <button
                key={id}
                id={`sidebar-nav-${id}`}
                className={`${styles.navItem} ${activeNav === id ? styles.active : ""}`}
                onClick={() => setActiveNav(id)}
                aria-label={id}
              >
                {icon}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Slide Viewport (clips the animation) ── */}
        <div className={styles.slideViewport}>

          {/* ════ Panel 1 — Upload ════ */}
          <div
            className={`${styles.slidePanel} ${styles.uploadPanel} ${view === "result" ? styles.panelSlideLeft : ""}`}
            aria-hidden={view === "result"}
          >
            {/* Logo row */}
            <div className={styles.headerRow}>
              <div className={styles.logoMark}>
                <div className={styles.logoIcon}><PawIcon size={17} /></div>
                <span className={styles.logoText}>FAUNAFY</span>
              </div>
              
              <div className={styles.langToggle}>
                <button className={`${styles.langBtn} ${lang === "en" ? styles.langActive : ""}`} onClick={() => setLang("en")}>EN</button>
                <button className={`${styles.langBtn} ${lang === "th" ? styles.langActive : ""}`} onClick={() => setLang("th")}>TH</button>
              </div>
            </div>

            {/* Title */}
            <div className={styles.header}>
              <h1 className={styles.title}>
                {lang === "en" ? "What is this animal?" : "สัตว์ตัวนี้คืออะไร?"}
              </h1>
              <p className={styles.subtitle}>
                {lang === "en" 
                  ? "Simply upload or capture an image to identify the species." 
                  : "เพียงอัปโหลดหรือถ่ายรูป เพื่อให้ AI ช่วยระบุสายพันธุ์ให้คุณ"}
              </p>
            </div>

            {/* Hidden file inputs */}
            <input id="file-upload-input" type="file" ref={fileRef} accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files && processFile(e.target.files[0])} />
            <input id="camera-capture-input" type="file" ref={cameraRef}
              accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={(e) => e.target.files && processFile(e.target.files[0])} />

            {/* Dropzone */}
            <div
              id="image-dropzone"
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
              onDragOver={(e) => { e.preventDefault(); if (!isLoading) setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                if (isLoading) return;
                setIsDragging(false);
                e.dataTransfer.files?.[0] && processFile(e.dataTransfer.files[0]);
              }}
              onClick={() => { if (!isLoading) fileRef.current?.click(); }}
              role="button" tabIndex={isLoading ? -1 : 0} aria-label="Upload animal image"
              onKeyDown={(e) => { if (!isLoading && e.key === "Enter") fileRef.current?.click(); }}
              style={{ cursor: isLoading ? "default" : "pointer" }}
            >
              {previewUrl ? (
                <div className={styles.previewWrapper}>
                  <div className={styles.previewImageContainer}>
                    <img src={previewUrl} alt="Selected preview" className={`${styles.previewImage} ${isLoading ? styles.scanningImage : ""}`} />
                    
                    {isLoading ? (
                      <>
                        <div className={styles.scanLine} />
                        <div className={`${styles.scanCorner} ${styles.tl}`} />
                        <div className={`${styles.scanCorner} ${styles.tr}`} />
                        <div className={`${styles.scanCorner} ${styles.bl}`} />
                        <div className={`${styles.scanCorner} ${styles.br}`} />
                      </>
                    ) : (
                      <div className={styles.previewOverlay}>
                        <button id="change-photo-btn" className={styles.changePhotoBtn}
                          onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                          Change Photo
                        </button>
                      </div>
                    )}
                  </div>
                  {isLoading && (
                    <div className={styles.scanTextGroup}>
                      <p className={styles.scanTitle}>
                        {lang === "en" ? "Scanning Species" : "กำลังวิเคราะห์สายพันธุ์"}
                      </p>
                      <p className={styles.scanDots}>
                        {lang === "en" ? "AI is analyzing the image…" : "AI กำลังประมวลผลรูปภาพของคุณ..."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.dropzoneEmptyContent}>
                  <div className={styles.dropzoneIconWrap}>
                    <div className={styles.dropzonePaw}><PawIcon size={44} /></div>
                    <Camera size={16} className={styles.dropzoneCamera} />
                  </div>
                  <h2 className={styles.dropzoneTitle}>
                    {lang === "en" ? "Drop an image or click to upload" : "ลากรูปมาวาง หรือคลิกเพื่ออัปโหลด"}
                  </h2>
                  <p className={styles.dropzoneText}>
                    {lang === "en" ? "Supported: JPG, PNG, WEBP · Max 10 MB" : "รองรับ: JPG, PNG, WEBP · ขนาดสูงสุด 10 MB"}
                  </p>
                </div>
              )}
            </div>

            {/* Camera / OR row */}
            <div className={styles.cameraRow}>
              <div className={styles.orDivider} />
              <span className={styles.orText}>{lang === "en" ? "or" : "หรือ"}</span>
              <button id="camera-capture-btn" className={styles.btnCamera}
                onClick={() => cameraRef.current?.click()} aria-label="Use camera">
                <Camera size={14} /> {lang === "en" ? "Use Camera" : "ถ่ายรูป"}
              </button>
              <div className={styles.orDivider} />
            </div>

            {/* Identify button */}
            <div className={styles.btnRow}>
              <button id="identify-animal-btn" className="btn-primary"
                onClick={handleIdentify} disabled={!image || isLoading}>
                {isLoading 
                  ? (lang === "en" ? "Analyzing..." : "กำลังวิเคราะห์...") 
                  : (lang === "en" ? "Identify Animal" : "ตรวจสอบสัตว์")}
              </button>
            </div>


          </div>

          {/* ════ Panel 2 — Result ════ */}
          <div
            className={`${styles.slidePanel} ${styles.resultPanel} ${view === "result" ? styles.panelSlideCenter : ""}`}
            aria-hidden={view === "upload"}
          >
            {/* Result header row */}
            <div className={styles.headerRow}>
              <button className={styles.backBtn} onClick={handleBack} aria-label="Go back">
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <div className={styles.logoMark}>
                <div className={styles.logoIcon}><PawIcon size={17} /></div>
                <span className={styles.logoText}>FAUNAFY</span>
              </div>
              {/* Spacer for symmetry */}
              <div style={{ width: 72 }} aria-hidden="true" />
            </div>

            {result && (
              <section className={styles.resultsArea} aria-label="Identification result">
                <div className={styles.resultsPanel}>
                  <div className={styles.resultsHeader}>
                    <h2 className={styles.resultsTitle}>
                      {lang === "en" ? "Species Details" : "รายละเอียดสายพันธุ์"}
                    </h2>
                    <div className={styles.headerActions}>
                      <div className={styles.langToggle}>
                        <button className={`${styles.langBtn} ${lang === "en" ? styles.langActive : ""}`} onClick={() => setLang("en")}>EN</button>
                        <button className={`${styles.langBtn} ${lang === "th" ? styles.langActive : ""}`} onClick={() => setLang("th")}>TH</button>
                      </div>
                      <button className={styles.collapseBtn} aria-label="Collapse">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {result.is_animal && selected ? (
                    <>
                      <div className={styles.detailPanel}>
                        {previewUrl && (
                          <div className={styles.detailImageWrapper}>
                            <img src={previewUrl} alt={selected.common_name_en} className={styles.detailImage} />
                          </div>
                        )}
                        <div className={styles.detailNameBlock}>
                            <h2 className={`${styles.detailNameEn} text-gradient`}>
                              {selected.common_name_en}
                            </h2>
                            {selected.common_name_th && (
                              <p className={styles.detailNameTh}>{selected.common_name_th}</p>
                            )}
                            <p className={styles.detailScientific}>{selected.scientific_name}</p>

                            <div className={styles.detailBadges}>
                              <span className={styles.confidenceBadge}>
                                <span className={styles.confidenceDot} />
                                {selected.confidence_percentage}% Match
                              </span>
                              {selected.conservation_status && (
                                <ConservationBadge status={selected.conservation_status} />
                              )}
                              {selected.animal_class && (
                                <span className={styles.classBadge}>{selected.animal_class}</span>
                              )}
                            </div>
                          </div>

                          <div className={styles.detailGrid}>
                            {detailItems.map((item) =>
                              item.value ? (
                                <div key={item.label} className={styles.detailItem}>
                                  <div className={styles.detailIconWrap}>{item.icon}</div>
                                  <div>
                                    <p className={styles.detailLabel}>{item.label}</p>
                                    <p className={styles.detailValue}>{item.value}</p>
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>

                          {(lang === "en" ? selected.physical_characteristics_en : selected.physical_characteristics_th) && (
                            <div className={styles.encyclopediaSection}>
                              <div className={styles.encyclopediaHeader}>
                                <Scale size={18} className={styles.iconTint} />
                                <h3 className={styles.encyclopediaTitle}>
                                  {lang === "en" ? "Physical Characteristics" : "ลักษณะทางกายภาพ"}
                                </h3>
                              </div>
                              <p className={styles.encyclopediaText}>
                                {lang === "en" ? selected.physical_characteristics_en : selected.physical_characteristics_th}
                              </p>
                            </div>
                          )}

                          {(lang === "en" ? selected.behavior_en : selected.behavior_th) && (
                            <div className={styles.encyclopediaSection}>
                              <div className={styles.encyclopediaHeader}>
                                <Activity size={18} className={styles.iconTint} />
                                <h3 className={styles.encyclopediaTitle}>
                                  {lang === "en" ? "Behavior & Lifestyle" : "พฤติกรรมและการใช้ชีวิต"}
                                </h3>
                              </div>
                              <p className={styles.encyclopediaText}>
                                {lang === "en" ? selected.behavior_en : selected.behavior_th}
                              </p>
                            </div>
                          )}

                          {(lang === "en" ? selected.ecological_role_en : selected.ecological_role_th) && (
                            <div className={styles.encyclopediaSection}>
                              <div className={styles.encyclopediaHeader}>
                                <Leaf size={18} className={styles.iconTint} />
                                <h3 className={styles.encyclopediaTitle}>
                                  {lang === "en" ? "Ecological Role" : "บทบาทในระบบนิเวศ"}
                                </h3>
                              </div>
                              <p className={styles.encyclopediaText}>
                                {lang === "en" ? selected.ecological_role_en : selected.ecological_role_th}
                              </p>
                            </div>
                          )}

                          {(lang === "en" ? selected.conservation_details_en : selected.conservation_details_th) && (
                            <div className={styles.encyclopediaSection}>
                              <div className={styles.encyclopediaHeader}>
                                <ShieldAlert size={18} className={styles.iconTint} />
                                <h3 className={styles.encyclopediaTitle}>
                                  {lang === "en" ? "Conservation Status Details" : "รายละเอียดสถานะการอนุรักษ์"}
                                </h3>
                              </div>
                              <p className={styles.encyclopediaText}>
                                {lang === "en" ? selected.conservation_details_en : selected.conservation_details_th}
                              </p>
                            </div>
                          )}

                          {(lang === "en" ? selected.fun_fact_en : selected.fun_fact_th) && (
                            <div className={styles.funFactBar}>
                              <div>
                                <p className={styles.funFactLabel}>{lang === "en" ? "Did you know?" : "รู้หรือไม่?"}</p>
                                <p className={styles.funFactText}>{lang === "en" ? selected.fun_fact_en : selected.fun_fact_th}</p>
                              </div>
                            </div>
                          )}

                          {result.candidates.length > 1 && (
                            <div className={styles.similarSpeciesSection}>
                              <div className={styles.similarSpeciesHeader}>
                                <h3 className={styles.similarSpeciesTitle}>
                                  {lang === "en" ? "Other Possibilities" : "สายพันธุ์อื่นที่ใกล้เคียง"}
                                </h3>
                              </div>
                              <div className={styles.similarSpeciesList}>
                                {result.candidates.map((candidate, idx) => {
                                  if (idx === selectedIdx) return null;
                                  return (
                                    <SpeciesThumbnail 
                                      key={idx} 
                                      candidate={candidate} 
                                      lang={lang} 
                                      onClick={() => {
                                        setSelectedIdx(idx);
                                        // Scroll to top of results
                                        document.querySelector(`.${styles.resultsPanel}`)?.scrollTo({ top: 0, behavior: 'smooth' });
                                      }} 
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                  ) : (
                    <div className={styles.notAnimalState}>
                      <Info size={34} color="rgba(255,255,255,0.18)" />
                      <h3 className={styles.notAnimalTitle}>
                        {lang === "en" ? "No animal detected" : "ไม่พบสัตว์ในรูปภาพ"}
                      </h3>
                      <p className={styles.notAnimalText}>
                        {lang === "en" 
                          ? "Try uploading a clearer photo of an animal." 
                          : "ลองอัปโหลดรูปภาพสัตว์ที่ชัดเจนกว่านี้อีกครั้ง"}
                      </p>
                      <button id="try-again-btn" className={styles.btnTryAgain} onClick={handleReset}>
                        {lang === "en" ? "Try Another Image" : "ลองใช้รูปภาพอื่น"}
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}


          </div>

        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className={styles.bottomNav} aria-label="Mobile navigation">
        {navItems.map(({ id, icon, label }) => (
          <button
            key={id}
            id={`bottom-nav-${id}`}
            className={`${styles.bottomNavItem} ${activeNav === id ? styles.active : ""}`}
            onClick={() => setActiveNav(id)}
            aria-label={label}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>

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
