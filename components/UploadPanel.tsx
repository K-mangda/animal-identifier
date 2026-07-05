import { Camera } from "lucide-react";
import styles from "@/app/page.module.css";
import PawIcon from "@/components/icons/PawIcon";

interface UploadPanelProps {
  view: "upload" | "result";
  lang: "en" | "th";
  setLang: (lang: "en" | "th") => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  isLoading: boolean;
  previewUrl: string | null;
  image: File | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
  cameraRef: React.RefObject<HTMLInputElement | null>;
  processFile: (file: File | undefined) => void;
  handleIdentify: () => void;
}

export default function UploadPanel({
  view,
  lang,
  setLang,
  isDragging,
  setIsDragging,
  isLoading,
  previewUrl,
  image,
  fileRef,
  cameraRef,
  processFile,
  handleIdentify
}: UploadPanelProps) {
  return (
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
        
        <div className={styles.langToggle} data-active={lang}>
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
        onChange={(e) => { if (e.target.files) processFile(e.target.files[0]); }} />
      <input id="camera-capture-input" type="file" ref={cameraRef}
        accept="image/*" capture="environment" style={{ display: "none" }}
        onChange={(e) => { if (e.target.files) processFile(e.target.files[0]); }} />

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
          if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
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
  );
}
