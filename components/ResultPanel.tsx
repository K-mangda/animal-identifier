import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, MapPin, Utensils, Globe, Clock3, Scale, Activity, Leaf, ShieldAlert, Info, Heart, Play, Pause, SkipForward, SkipBack, X, Headphones } from "lucide-react";
import styles from "@/app/page.module.css";
import PawIcon from "@/components/icons/PawIcon";
import ConservationBadge from "@/components/ConservationBadge";
import SpeciesThumbnail from "@/components/SpeciesThumbnail";
import { AnimalCandidate, IdentifyResult } from "@/types/animal";

interface ResultPanelProps {
  view: "upload" | "result";
  lang: "en" | "th";
  setLang: (lang: "en" | "th") => void;
  result: IdentifyResult | null;
  selectedIdx: number;
  setSelectedIdx: (idx: number) => void;
  previewUrl: string | null;
  historyId: string | null;
  isSaved: boolean;
  onToggleSave: () => void;
  handleBack: () => void;
  handleReset: () => void;
}

export default function ResultPanel({
  view,
  lang,
  setLang,
  result,
  selectedIdx,
  setSelectedIdx,
  previewUrl,
  historyId,
  isSaved,
  onToggleSave,
  handleBack,
  handleReset,
}: ResultPanelProps) {
  const selected: AnimalCandidate | null = result?.candidates?.[selectedIdx] ?? null;

  const tracks = useMemo(() => {
    if (!selected) return [];
    const arr = [
      { id: "name", title: lang === "en" ? "Name & Overview" : "ชื่อและข้อมูลทั่วไป", text: lang === "en" ? `${selected.common_name_en}. ${selected.scientific_name}` : `${selected.common_name_th}. ${selected.scientific_name}` },
      { id: "physical", title: lang === "en" ? "Physical Characteristics" : "ลักษณะทางกายภาพ", text: lang === "en" ? selected.physical_characteristics_en : selected.physical_characteristics_th },
      { id: "behavior", title: lang === "en" ? "Behavior & Lifestyle" : "พฤติกรรมและการใช้ชีวิต", text: lang === "en" ? selected.behavior_en : selected.behavior_th },
      { id: "ecology", title: lang === "en" ? "Ecological Role" : "บทบาทในระบบนิเวศ", text: lang === "en" ? selected.ecological_role_en : selected.ecological_role_th },
      { id: "conservation", title: lang === "en" ? "Conservation Status Details" : "รายละเอียดสถานะการอนุรักษ์", text: lang === "en" ? selected.conservation_details_en : selected.conservation_details_th },
      { id: "funfact", title: lang === "en" ? "Did you know?" : "รู้หรือไม่?", text: lang === "en" ? selected.fun_fact_en : selected.fun_fact_th },
    ];
    return arr.filter(t => t.text);
  }, [selected, lang]);

  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (currentUtteranceRef.current) currentUtteranceRef.current.onend = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const playTrack = (index: number) => {
    // Clear previous utterance's onend to prevent skip-chaining
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current.onend = null;
      currentUtteranceRef.current.onerror = null;
    }
    
    window.speechSynthesis.cancel();
    setIsPaused(false);
    
    if (index < 0 || index >= tracks.length) {
      setIsPlaying(false);
      return;
    }
    
    // Crucial workaround for Chrome bug: 
    // Calling speak() immediately after cancel() can make the audio un-pausable.
    setTimeout(() => {
      const track = tracks[index];
      const utterance = new SpeechSynthesisUtterance(track.text);
      utterance.lang = lang === "en" ? "en-US" : "th-TH";
      
      utterance.onend = () => {
        // Handle auto-play next track
        setTimeout(() => {
          if (index + 1 < tracks.length) {
            setCurrentTrackIdx(index + 1);
            playTrack(index + 1);
          } else {
            setIsPlaying(false);
          }
        }, 500); // slight pause between sections
      };
      
      utterance.onerror = (e) => {
        // Ignore cancel errors
        if (e.error !== "canceled") setIsPlaying(false);
      };
      
      currentUtteranceRef.current = utterance;
      setCurrentTrackIdx(index);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      // Use instant cancel instead of pause for immediate stopping
      if (currentUtteranceRef.current) currentUtteranceRef.current.onend = null;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    } else {
      // Always restart from the beginning of the current track
      playTrack(currentTrackIdx);
    }
  };

  const handleNext = () => {
    if (currentTrackIdx + 1 < tracks.length) {
      playTrack(currentTrackIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrackIdx - 1 >= 0) {
      playTrack(currentTrackIdx - 1);
    } else {
      playTrack(0); // Restart from beginning
    }
  };

  const handleStartPlayer = () => {
    setShowPlayer(true);
    if (!isPlaying) {
      playTrack(0);
    }
  };

  const handleClosePlayer = () => {
    if (currentUtteranceRef.current) currentUtteranceRef.current.onend = null;
    window.speechSynthesis.cancel();
    
    setShowPlayer(false);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTrackIdx(0);
  };

  const detailItems = selected
    ? [
        { icon: <MapPin size={14} />,   label: lang === "en" ? "Habitat" : "ถิ่นที่อยู่",  value: lang === "en" ? selected.habitat_en : selected.habitat_th },
        { icon: <Utensils size={14} />, label: lang === "en" ? "Diet" : "อาหาร",     value: lang === "en" ? selected.diet_en : selected.diet_th },
        { icon: <Clock3 size={14} />,   label: lang === "en" ? "Lifespan" : "อายุขัย", value: lang === "en" ? selected.lifespan_en : selected.lifespan_th },
        { icon: <Globe size={14} />,    label: lang === "en" ? "Range" : "พื้นที่อาศัย",    value: lang === "en" ? selected.geographic_range_en : selected.geographic_range_th },
      ]
    : [];

  return (
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
        <div style={{ width: 76, display: "flex", justifyContent: "flex-end" }}>
          <div className={styles.langToggle} data-active={lang}>
            <button className={`${styles.langBtn} ${lang === "en" ? styles.langActive : ""}`} onClick={() => setLang("en")}>EN</button>
            <button className={`${styles.langBtn} ${lang === "th" ? styles.langActive : ""}`} onClick={() => setLang("th")}>TH</button>
          </div>
        </div>
      </div>

      {result && (
        <section className={styles.resultsArea} aria-label="Identification result">
          <div className={styles.resultsPanel}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                {lang === "en" ? "Species Details" : "รายละเอียดสายพันธุ์"}
              </h2>
              <div className={styles.headerActions}>
                {historyId && (
                  <button 
                    className={styles.resultFavBtn}
                    data-saved={isSaved ? "true" : "false"}
                    onClick={onToggleSave} 
                    title={isSaved ? "Remove from saved" : "Save this result"}
                  >
                    <Heart size={18} color={isSaved ? "#ef4444" : "#fff"} fill={isSaved ? "#ef4444" : "none"} className={styles.resultFavIcon} />
                  </button>
                )}
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h2 className={`${styles.detailNameEn} text-gradient`}>
                          {selected.common_name_en}
                        </h2>
                        {selected.common_name_th && (
                          <p className={styles.detailNameTh}>{selected.common_name_th}</p>
                        )}
                        <p className={styles.detailScientific}>{selected.scientific_name}</p>
                      </div>
                      <button 
                        onClick={handleStartPlayer}
                        style={{
                          background: showPlayer ? "rgba(34, 197, 94, 0.2)" : "rgba(255,255,255,0.1)",
                          border: `1px solid ${showPlayer ? "rgba(34, 197, 94, 0.5)" : "rgba(255,255,255,0.2)"}`,
                          borderRadius: "50%",
                          width: "44px",
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: showPlayer ? "#4ade80" : "#fff",
                          transition: "all 0.2s",
                          boxShadow: showPlayer ? "0 0 15px rgba(34, 197, 94, 0.3)" : "none"
                        }}
                        title={lang === "en" ? "Listen to Details" : "ฟังรายละเอียด"}
                      >
                        <Play size={22} style={{ marginLeft: "3px" }} />
                      </button>
                    </div>

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

                  {/* Similar Species section removed to optimize API speed */}
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

      {showPlayer && tracks.length > 0 && typeof document !== "undefined" && createPortal(
        <div style={{
          position: "fixed",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: "420px",
          background: "rgba(20, 20, 20, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
          zIndex: 99999,
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ 
                width: "36px", height: "36px", 
                borderRadius: "8px", 
                background: "linear-gradient(135deg, #4ade80, #c8a84b)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Headphones size={20} color="#111" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {lang === "en" ? "Now Playing" : "กำลังเล่น"}
                </span>
                <span style={{ fontSize: "14px", color: "#fff", fontWeight: "500", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: "200px" }}>
                  {tracks[currentTrackIdx]?.title}
                </span>
              </div>
            </div>
            <button onClick={handleClosePlayer} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px" }}>
            <button 
              onClick={handlePrev} 
              disabled={currentTrackIdx === 0}
              style={{ background: "none", border: "none", color: currentTrackIdx === 0 ? "rgba(255,255,255,0.2)" : "#fff", cursor: currentTrackIdx === 0 ? "default" : "pointer" }}
            >
              <SkipBack size={24} />
            </button>
            <button 
              onClick={handleTogglePlay}
              style={{ 
                width: "48px", height: "48px", 
                borderRadius: "50%", 
                background: "#fff", 
                border: "none", 
                color: "#000", 
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(255,255,255,0.2)"
              }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: "3px" }} />}
            </button>
            <button 
              onClick={handleNext}
              disabled={currentTrackIdx === tracks.length - 1}
              style={{ background: "none", border: "none", color: currentTrackIdx === tracks.length - 1 ? "rgba(255,255,255,0.2)" : "#fff", cursor: currentTrackIdx === tracks.length - 1 ? "default" : "pointer" }}
            >
              <SkipForward size={24} />
            </button>
          </div>
          <div style={{ display: "flex", gap: "4px", width: "100%", height: "4px", marginTop: "4px" }}>
            {tracks.map((_, idx) => (
              <div key={idx} style={{ 
                flex: 1, 
                background: idx === currentTrackIdx ? "#4ade80" : "rgba(255,255,255,0.2)",
                borderRadius: "2px",
                transition: "background 0.3s"
              }} />
            ))}
          </div>
        </div>
      , document.body)}
    </div>
  );
}
