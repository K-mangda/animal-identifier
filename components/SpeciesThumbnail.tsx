"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import styles from "@/app/page.module.css";
import { AnimalCandidate } from "@/types/animal";

export default function SpeciesThumbnail({ 
  candidate, 
  lang, 
  onClick 
}: { 
  candidate: AnimalCandidate, 
  lang: "en"|"th", 
  onClick: () => void 
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWiki = async () => {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(candidate.scientific_name)}&prop=pageimages&format=json&pithumbsize=200&origin=*`);
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const firstPage = Object.values(pages)[0] as any;
          if (firstPage?.thumbnail?.source) {
            setImgUrl(firstPage.thumbnail.source);
          }
        }
      } catch (e) { console.error(e); }
    };
    fetchWiki();
  }, [candidate.scientific_name]);

  return (
    <div className={styles.candidateCard} onClick={onClick}>
      {imgUrl ? (
        <img src={imgUrl} alt={candidate.scientific_name} className={styles.candidateImg} />
      ) : (
        <div className={styles.candidateImgPlaceholder}><Search size={20} opacity={0.5} /></div>
      )}
      <div className={styles.candidateInfo}>
        <div className={styles.candidateHeader}>
          <span className={styles.candidateName}>{lang === "en" ? candidate.common_name_en : candidate.common_name_th}</span>
          <span className={styles.candidateScore}>{candidate.confidence_percentage}%</span>
        </div>
        <div className={styles.candidateScientific}>{candidate.scientific_name}</div>
      </div>
    </div>
  );
}
