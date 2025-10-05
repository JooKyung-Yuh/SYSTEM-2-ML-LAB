'use client';

import { useState } from 'react';
import styles from './GridCardEditor.module.css';

interface GridCard {
  id: string;
  title: string;
  content: string;
}

interface GridCardEditorProps {
  cards: GridCard[];
  onChange: (cards: GridCard[]) => void;
}

export default function GridCardEditor({ cards, onChange }: GridCardEditorProps) {
  const handleAddCard = () => {
    const newCard: GridCard = {
      id: `card-${Date.now()}`,
      title: '새 카드',
      content: '카드 설명을 입력하세요...'
    };
    onChange([...cards, newCard]);
  };

  const handleRemoveCard = (id: string) => {
    onChange(cards.filter(card => card.id !== id));
  };

  const handleUpdateCard = (id: string, field: 'title' | 'content', value: string) => {
    onChange(cards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>그리드 카드 ({cards.length}개)</label>
        <button
          type="button"
          onClick={handleAddCard}
          className={styles.addBtn}
        >
          + 카드 추가
        </button>
      </div>

      <div className={styles.cardsContainer}>
        {cards.map((card, index) => (
          <div key={card.id} className={styles.cardEditor}>
            <div className={styles.cardHeader}>
              <span className={styles.cardNumber}>#{index + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveCard(card.id)}
                className={styles.removeBtn}
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={card.title}
              onChange={(e) => handleUpdateCard(card.id, 'title', e.target.value)}
              className={styles.cardTitle}
              placeholder="카드 제목"
            />

            <textarea
              value={card.content}
              onChange={(e) => handleUpdateCard(card.id, 'content', e.target.value)}
              className={styles.cardContent}
              placeholder="카드 설명"
              rows={3}
            />
          </div>
        ))}

        {cards.length === 0 && (
          <div className={styles.emptyState}>
            <p>그리드 카드가 없습니다</p>
            <button
              type="button"
              onClick={handleAddCard}
              className={styles.addFirstBtn}
            >
              첫 카드 추가하기
            </button>
          </div>
        )}
      </div>

      <div className={styles.preview}>
        <label className={styles.previewLabel}>미리보기</label>
        <div className={styles.previewGrid}>
          {cards.map(card => (
            <div key={card.id} className={styles.previewCard}>
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
