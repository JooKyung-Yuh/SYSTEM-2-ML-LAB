'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/app/about/about.module.css';

interface ResearchCard {
  id: string;
  title: string;
  content: string;
  details?: string;
}

interface ResearchAreasGridProps {
  cards: ResearchCard[];
  description?: string;
}

export default function ResearchAreasGrid({ cards, description }: ResearchAreasGridProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [detailHeight, setDetailHeight] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleCard = (cardId: string) => {
    const newSelection = selectedCard === cardId ? null : cardId;
    setSelectedCard(newSelection);

    // Auto-scroll to details panel when a card is selected
    if (newSelection && panelRef.current) {
      setTimeout(() => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          // Mobile: scroll to top of panel
          panelRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // Desktop: scroll to center the panel better
          const panelTop = panelRef.current?.getBoundingClientRect().top || 0;
          const offset = window.innerHeight * 0.3; // 화면 상단에서 30% 위치

          window.scrollBy({
            top: panelTop - offset,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  };

  useEffect(() => {
    if (selectedCard && detailRef.current) {
      setDetailHeight(detailRef.current.scrollHeight);
    } else {
      setDetailHeight(0);
    }
  }, [selectedCard]);

  const selectedCardData = cards.find((card) => card.id === selectedCard);

  return (
    <>
      {description && (
        <p className={styles.paragraph}>{description}</p>
      )}
      <div className={styles.researchGrid}>
        {cards.map((card) => {
          const isSelected = selectedCard === card.id;

          return (
            <div
              key={card.id}
              className={`${styles.researchCard} ${isSelected ? styles.researchCardSelected : ''}`}
              onClick={() => card.details && toggleCard(card.id)}
              style={{
                cursor: card.details ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
              }}
            >
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          );
        })}
      </div>

      {/* Details Panel Below Grid */}
      <div
        ref={panelRef}
        className={styles.detailsPanel}
        style={{
          maxHeight: detailHeight,
          opacity: selectedCard ? 1 : 0,
          marginTop: selectedCard ? '2rem' : 0,
          transition: 'all 0.4s ease-in-out',
        }}
      >
        <div ref={detailRef} className={styles.detailsContent}>
          {selectedCardData && (
            <>
              <h3 className={styles.detailsTitle}>{selectedCardData.title}</h3>
              <div
                className={styles.detailsText}
                dangerouslySetInnerHTML={{ __html: selectedCardData.details || '' }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
