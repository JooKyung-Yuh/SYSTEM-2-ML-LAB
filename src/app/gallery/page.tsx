'use client';

import { useState } from 'react';
import styles from './gallery.module.css';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const galleryItems = [
    {
      id: 1,
      title: "Research Team Meeting",
      description: "Weekly research discussion and brainstorming session with team members discussing latest findings in System 2 ML",
      category: "Lab Activities",
      date: "2024-03-15",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 2,
      title: "ICML 2024 Conference Presentation",
      description: "Presenting our groundbreaking research on System 2 reasoning at the International Conference on Machine Learning",
      category: "Conferences",
      date: "2024-07-21",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 3,
      title: "System 2 ML Workshop",
      description: "International workshop featuring renowned speakers discussing the future of deliberate reasoning in AI",
      category: "Events",
      date: "2024-05-10",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 4,
      title: "High-Performance Computing Lab",
      description: "State-of-the-art GPU clusters and computing infrastructure supporting our advanced research",
      category: "Facilities",
      date: "2024-01-20",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 5,
      title: "Best Paper Award Ceremony",
      description: "Recognition for outstanding research achievements and contributions to the field of AI",
      category: "Awards",
      date: "2024-06-05",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 6,
      title: "PhD Graduation Celebration",
      description: "Celebrating our graduates' successful defense and their contributions to advancing AI research",
      category: "Milestones",
      date: "2024-02-28",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 7,
      title: "AI Ethics and Society Symposium",
      description: "Interdisciplinary discussion on responsible AI development and its impact on society",
      category: "Events",
      date: "2024-04-12",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 8,
      title: "Global Research Collaboration Summit",
      description: "Meeting with partner laboratories from leading universities worldwide to discuss joint research initiatives",
      category: "Collaborations",
      date: "2024-08-18",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 9,
      title: "Student Research Showcase",
      description: "Annual event where students present their research projects and findings to faculty and peers",
      category: "Lab Activities",
      date: "2024-04-20",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 10,
      title: "Industry Partnership Signing",
      description: "Formal collaboration agreement with leading tech companies for joint research projects",
      category: "Collaborations",
      date: "2024-03-08",
      imageUrl: "/api/placeholder/400/300"
    }
  ];

  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const sortedItems = filteredItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            Gallery
          </h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>
            Capturing moments of discovery, collaboration, and achievement in our research journey.
          </p>
        </header>

        {/* Category Filter */}
        <div style={{
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 500,
            color: '#222',
            marginBottom: '1rem'
          }}>
            Filter by Category:
          </h2>
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

        {/* Gallery Grid */}
        <div className={styles.galleryGrid}>
          {sortedItems.map((item) => (
            <article key={item.id} className={styles.galleryItem}>
              {/* Image Placeholder */}
              <div className={styles.imageWrapper}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: '#999'
                }}>
                  📷
                </div>
              </div>

              {/* Content */}
              <div className={styles.itemContent}>
                <div className={styles.itemCategory}>
                  {item.category}
                </div>
                <h3 className={styles.itemTitle}>
                  {item.title}
                </h3>
                <div className={styles.itemDate}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#333',
                  lineHeight: 1.5,
                  marginTop: '0.5rem'
                }}>
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Results Info */}
        <div style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem',
          marginTop: '2rem',
          marginBottom: '2rem'
        }}>
          Showing {sortedItems.length} of {galleryItems.length} items
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>

        <JoinUs />

      </div>

      <Footer />
    </div>
  );
}
