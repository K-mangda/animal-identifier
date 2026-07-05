import { ArrowLeft, MapPin, Utensils, Globe, Clock3, Scale, Activity, Leaf, ShieldAlert, Info, Heart } from "lucide-react";
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
        <div style={{ width: 72 }} aria-hidden="true">
          {historyId && (
            <button 
              onClick={onToggleSave} 
              style={{
                background: "transparent", border: "none", cursor: "pointer", 
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "40px", height: "40px", borderRadius: "50%",
                backgroundColor: isSaved ? "rgba(239, 68, 68, 0.1)" : "rgba(255,255,255,0.05)"
              }}
              title={isSaved ? "Remove from saved" : "Save this result"}
            >
              <Heart size={20} color={isSaved ? "#ef4444" : "#fff"} fill={isSaved ? "#ef4444" : "none"} />
            </button>
          )}
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
  );
}
