'use client';

import { useState } from 'react';
import styles from './RecruitmentBanner.module.css';

interface RecruitmentBannerProps {
  isLoaded: boolean;
}

export default function RecruitmentBanner({ isLoaded }: RecruitmentBannerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.location.href = 'mailto:haebeomlee@korea.ac.kr';
  };

  return (
    <div
      className={`${styles.banner} ${isLoaded ? styles.loaded : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label="Join our team - Contact us about open positions"
    >
      <div className={styles.content}>
        <span className={styles.icon}>🎓</span>
        <span className={styles.text}>
          <span className={styles.title}>We&apos;re Hiring</span>
          <span className={styles.separator}>•</span>
          <span className={styles.positions}>
            Open Positions: PhD · MS · Postdoc · Undergraduate Research Interns
          </span>
        </span>
        <span className={`${styles.arrow} ${isHovered ? styles.arrowHovered : ''}`}>
          →
        </span>
      </div>
    </div>
  );
}
