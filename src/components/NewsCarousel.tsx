'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './NewsCarousel.module.css';

interface NewsLink { id: string; text: string; url: string; }
interface NewsItem { id: string; date: string; title: string; description: string; links?: NewsLink[]; }
interface NewsCarouselProps { newsItems: NewsItem[]; }

function useItemsPerView() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 600) setCount(1);
      else if (w < 900) setCount(2);
      else if (w < 1200) setCount(3);
      else setCount(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className={styles.slideEntryBg}>
      <div className={styles.slideEntry}>
        <div className={styles.newsDate}>{item.date}</div>
        <h4 className={styles.newsTitle}>{item.title}</h4>
        <p className={styles.newsDescription}>
          {item.description}
          {item.links && item.links.length > 0 && (
            <>
              {' ('}
              {item.links.map((link, index) => (
                <span key={link.id || index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.newsLink}>
                    {link.text}
                  </a>
                  {index < item.links!.length - 1 && ', '}
                </span>
              ))}
              {')'}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
  const itemsPerView = useItemsPerView();
  const total = newsItems.length;
  if (total === 0) return null;

  const isScrollable = total > itemsPerView;
  const gap = 20;
  const cloneCount = isScrollable ? itemsPerView : 0;

  const slides = isScrollable
    ? [...newsItems.slice(-cloneCount), ...newsItems, ...newsItems.slice(0, cloneCount)]
    : newsItems;

  const [index, setIndex] = useState(cloneCount);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isLocked = useRef(false); // locked during ANY animation or jump

  const slideWidthCalc = `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`;

  // Move track to a position (with or without animation)
  const moveTo = useCallback((pos: number, animated: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animated ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(calc(-${pos} * (${slideWidthCalc} + ${gap}px)))`;
  }, [slideWidthCalc, gap]);

  // Go to next/prev with animation
  const goTo = useCallback((newIndex: number) => {
    if (isLocked.current) return;
    isLocked.current = true; // lock during animation
    setIndex(newIndex);
    moveTo(newIndex, true);
  }, [moveTo]);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // Handle wrap-around after animation completes
  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.propertyName !== 'transform') return;

    const realStart = cloneCount;
    const realEnd = cloneCount + total - 1;

    if (index > realEnd) {
      // Past end → silent jump to real start
      const jumpTo = realStart + (index - realEnd - 1);
      setIndex(jumpTo);
      moveTo(jumpTo, false);
      trackRef.current?.offsetHeight; // eslint-disable-line - force reflow
      requestAnimationFrame(() => { isLocked.current = false; });
    } else if (index < realStart) {
      // Before start → silent jump to real end
      const jumpTo = realEnd + (index - realStart + 1);
      setIndex(jumpTo);
      moveTo(jumpTo, false);
      trackRef.current?.offsetHeight; // eslint-disable-line
      requestAnimationFrame(() => { isLocked.current = false; });
    } else {
      // Normal slide, just unlock
      isLocked.current = false;
    }
  }, [index, cloneCount, total, moveTo]);

  // Set initial position on mount
  useEffect(() => {
    moveTo(cloneCount, false);
  }, [cloneCount, moveTo]);

  // Autoplay
  useEffect(() => {
    if (isHovered || !isScrollable) return;
    const timer = setInterval(() => {
      if (!isLocked.current) goTo(index + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, isScrollable, index, goTo]);

  // Dot index mapped to real items (0..total-1)
  const dotIndex = ((index - cloneCount) % total + total) % total;

  return (
    <div
      className={styles.newsCarouselContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          style={{ gap: `${gap}px` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((item, i) => (
            <div
              key={`slide-${i}`}
              className={styles.slide}
              style={{ minWidth: slideWidthCalc, maxWidth: slideWidthCalc }}
            >
              <NewsCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {isScrollable && (
        <>
          <button className={styles.navPrev} onClick={prev} aria-label="Previous">‹</button>
          <button className={styles.navNext} onClick={next} aria-label="Next">›</button>
          <div className={styles.dots}>
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === dotIndex ? styles.dotActive : ''}`}
                onClick={() => goTo(cloneCount + i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
