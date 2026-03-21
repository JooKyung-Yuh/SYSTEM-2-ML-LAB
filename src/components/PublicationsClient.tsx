'use client';

import { useState, useMemo } from 'react';
import styles from '@/app/publications/publications.module.css';

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  url: string | null;
  pdfUrl: string | null;
  codeUrl: string | null;
  abstract: string | null;
  topics: string | null;
  type: string | null;
  category: string;
  order: number;
  published: boolean;
}

interface Props {
  publications: Publication[];
}

function parseTopics(topics: string | null): string[] {
  if (!topics) return [];
  try {
    const parsed = JSON.parse(topics);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PublicationsClient({ publications }: Props) {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const years = useMemo(() => [
    'All',
    ...Array.from(new Set(publications.map(p => String(p.year)))).sort((a, b) => parseInt(b) - parseInt(a))
  ], [publications]);

  const venues = useMemo(() => [
    'All',
    ...Array.from(new Set(publications.map(p => p.venue))).sort()
  ], [publications]);

  const topics = useMemo(() => [
    'All',
    ...Array.from(new Set(publications.flatMap(p => parseTopics(p.topics)))).sort()
  ], [publications]);

  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const pubTopics = parseTopics(pub.topics);
      const matchesYear = selectedYear === 'All' || String(pub.year) === selectedYear;
      const matchesVenue = selectedVenue === 'All' || pub.venue === selectedVenue;
      const matchesTopic = selectedTopic === 'All' || pubTopics.includes(selectedTopic);
      const matchesSearch = searchQuery === '' ||
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.abstract || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesVenue && matchesTopic && matchesSearch;
    });
  }, [publications, selectedYear, selectedVenue, selectedTopic, searchQuery]);

  const groupedByYear = filteredPublications.reduce((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = [];
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);

  const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  const clearFilters = () => {
    setSelectedYear('All');
    setSelectedVenue('All');
    setSelectedTopic('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedYear !== 'All' || selectedVenue !== 'All' || selectedTopic !== 'All' || searchQuery !== '';

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Publications</h1>
        <div className={styles.divider}></div>
        <p className={styles.subtitle}>
          Our research contributions to the field of artificial intelligence and machine learning.
        </p>
        <div className={styles.statsBar}>
          <span className={styles.totalCount}>
            Total <strong>{publications.length}</strong> Publications
          </span>
          {hasActiveFilters && (
            <span className={styles.filteredCount}>
              (Showing <strong>{filteredPublications.length}</strong>)
            </span>
          )}
        </div>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by title, author, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterMenuBar}>
        <div className={styles.filterDropdown}>
          <label className={styles.filterLabel}>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={styles.filterSelect}>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div className={styles.filterDropdown}>
          <label className={styles.filterLabel}>Venue:</label>
          <select value={selectedVenue} onChange={(e) => setSelectedVenue(e.target.value)} className={styles.filterSelect}>
            {venues.map(venue => <option key={venue} value={venue}>{venue}</option>)}
          </select>
        </div>
        <div className={styles.filterDropdown}>
          <label className={styles.filterLabel}>Topic:</label>
          <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className={styles.filterSelect}>
            {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearButton}>Clear Filters</button>
        )}
      </div>

      {sortedYears.map((year) => (
        <section key={year} className={styles.yearSection}>
          <h2 className={styles.yearTitle}>{year}</h2>
          <div>
            {groupedByYear[year].map((pub) => {
              const pubTopics = parseTopics(pub.topics);
              return (
                <div key={pub.id} className={styles.publicationCard}>
                  <h3 className={styles.publicationTitle}>{pub.title}</h3>
                  <p className={styles.authors}>{pub.authors}</p>
                  <p className={styles.venue}>
                    <strong>{pub.venue} {pub.year}</strong>
                    {pub.type?.includes('Spotlight') && <em> (Spotlight)</em>}
                    {pub.type?.includes('Oral') && <em> (Oral)</em>}
                    {pub.type === 'Preprint' && <em> (Preprint)</em>}
                  </p>
                  {pubTopics.length > 0 && (
                    <div className={styles.topicTags}>
                      {pubTopics.map(topic => (
                        <span key={topic} className={styles.topicTag}>{topic}</span>
                      ))}
                    </div>
                  )}
                  {pub.abstract && <p className={styles.abstract}>{pub.abstract}</p>}
                  <div className={styles.linkContainer}>
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className={styles.link}>Paper</a>
                    )}
                    {pub.pdfUrl && (
                      <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>PDF</a>
                    )}
                    {pub.codeUrl && (
                      <a href={pub.codeUrl} target="_blank" rel="noopener noreferrer" className={styles.codeLink}>Code</a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {filteredPublications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
          <p>No publications found matching your criteria.</p>
        </div>
      )}
    </>
  );
}
