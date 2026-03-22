'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/app/gallery/gallery.module.css';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  date: string | null;
  order: number;
  published: boolean;
}

interface Props {
  galleryItems: GalleryItem[];
}

export default function GalleryClient({ galleryItems }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(galleryItems.map(item => item.category).filter(Boolean) as string[]))];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <>
      {categories.length > 2 && (
        <div style={{ marginBottom: '3rem' }}>
          <div className={styles.filters}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.filterButtonActive : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.galleryGrid}>
        {filteredItems.map((item) => (
          <article key={item.id} className={styles.galleryItem}>
            <div className={styles.imageWrapper}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
            <div className={styles.itemContent}>
              {item.category && <div className={styles.itemCategory}>{item.category}</div>}
              <h3 className={styles.itemTitle}>{item.title}</h3>
              {item.date && (
                <div className={styles.itemDate}>
                  {item.date}
                </div>
              )}
              {item.description && (
                <p style={{ fontSize: '0.95rem', color: '#333', lineHeight: 1.5, marginTop: '0.5rem' }}>
                  {item.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '2rem', marginBottom: '2rem' }}>
        Showing {filteredItems.length} of {galleryItems.length} items
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </div>
    </>
  );
}
