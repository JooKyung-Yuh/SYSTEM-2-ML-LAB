'use client';

import { useState, useMemo } from 'react';
import styles from './publications.module.css';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';

export default function Publications() {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publications = [
    {
      title: "Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning",
      authors: "Dong Bok Lee, Hae Beom Lee, et al.",
      venue: "NeurIPS",
      year: "2025",
      type: "Conference",
      topics: ["AutoML", "Bayesian Inference"],
      abstract: "We propose a cost-sensitive approach to freeze-thaw Bayesian optimization that efficiently tunes hyperparameters by considering computational cost in the optimization process.",
      link: "https://arxiv.org/abs/2405.17918"
    },
    {
      title: "Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks",
      authors: "Dongwoo Lee*, Dong Bok Lee*, Hae Beom Lee, et al. (*equal contribution)",
      venue: "ICML",
      year: "2025",
      type: "Conference",
      topics: ["Bayesian Inference", "LLM"],
      abstract: "This work develops Bayesian methods for extrapolating neural scaling laws using prior-fitted networks to predict performance at larger scales.",
      link: "https://arxiv.org/abs/2505.23032"
    },
    {
      title: "Delta-AI: Local Objectives for Amortized Inference in Sparse Graphical Models",
      authors: "Jean-Pierre René Falet*, Hae Beom Lee*, Nikolay Malkin* (*equal contribution)",
      venue: "ICLR",
      year: "2024",
      type: "Conference",
      topics: ["Bayesian Inference", "GFlowNets"],
      abstract: "We introduce Delta-AI, a method for efficient amortized inference in sparse graphical models using local objectives that scale to large networks.",
      link: "https://arxiv.org/abs/2310.02423"
    },
    {
      title: "Online Hyperparameter Meta-Learning with Hypergradient Distillation",
      authors: "Hae Beom Lee, Hayeon Lee, Dongyoon Hwang, Sung Ju Hwang",
      venue: "ICLR",
      year: "2022",
      type: "Conference (Spotlight)",
      topics: ["Meta-Learning", "AutoML"],
      abstract: "We propose an online meta-learning approach for hyperparameter optimization that uses hypergradient distillation to efficiently adapt to new tasks.",
      link: "https://arxiv.org/abs/2110.02508"
    },
    {
      title: "Sequential Reptile: Inter-Task Gradient Alignment for Multilingual Learning",
      authors: "Seanie Lee, Hae Beom Lee, et al.",
      venue: "ICLR",
      year: "2022",
      type: "Conference (Oral)",
      topics: ["Meta-Learning"],
      abstract: "This work extends the Reptile algorithm to sequential learning scenarios with inter-task gradient alignment for improved multilingual performance.",
      link: "https://arxiv.org/abs/2110.02600"
    },
    {
      title: "Meta-Learning Low Rank Covariance Factors for Energy-Based Deterministic Uncertainty",
      authors: "Jeffrey Ryan, Hae Beom Lee, et al.",
      venue: "ICLR",
      year: "2022",
      type: "Conference",
      topics: ["Meta-Learning", "Bayesian Inference"],
      abstract: "We develop a meta-learning approach for learning low-rank covariance factors in energy-based models to improve uncertainty estimation.",
      link: "https://arxiv.org/abs/2110.02381"
    }
  ];

  // Extract unique values for filters
  const years = useMemo(() => ['All', ...Array.from(new Set(publications.map(p => p.year))).sort((a, b) => parseInt(b) - parseInt(a))], [publications]);
  const venues = useMemo(() => ['All', ...Array.from(new Set(publications.map(p => p.venue))).sort()], [publications]);
  const topics = useMemo(() => ['All', ...Array.from(new Set(publications.flatMap(p => p.topics))).sort()], [publications]);

  // Filter publications
  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const matchesYear = selectedYear === 'All' || pub.year === selectedYear;
      const matchesVenue = selectedVenue === 'All' || pub.venue === selectedVenue;
      const matchesTopic = selectedTopic === 'All' || pub.topics.includes(selectedTopic);
      const matchesSearch = searchQuery === '' ||
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.abstract.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesYear && matchesVenue && matchesTopic && matchesSearch;
    });
  }, [publications, selectedYear, selectedVenue, selectedTopic, searchQuery]);

  // Group by year
  const groupedByYear = filteredPublications.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = [];
    }
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<string, typeof publications>);

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // Clear all filters
  const clearFilters = () => {
    setSelectedYear('All');
    setSelectedVenue('All');
    setSelectedTopic('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedYear !== 'All' || selectedVenue !== 'All' || selectedTopic !== 'All' || searchQuery !== '';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
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

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filter Menu Bar */}
        <div className={styles.filterMenuBar}>
          {/* Year Filter */}
          <div className={styles.filterDropdown}>
            <label className={styles.filterLabel}>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={styles.filterSelect}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Venue Filter */}
          <div className={styles.filterDropdown}>
            <label className={styles.filterLabel}>Venue:</label>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className={styles.filterSelect}
            >
              {venues.map(venue => (
                <option key={venue} value={venue}>{venue}</option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div className={styles.filterDropdown}>
            <label className={styles.filterLabel}>Topic:</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className={styles.filterSelect}
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters} className={styles.clearButton}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Publications by Year */}
        {sortedYears.map((year) => (
          <section key={year} className={styles.yearSection}>
            <h2 className={styles.yearTitle}>{year}</h2>
            <div>
              {groupedByYear[year].map((pub, index) => (
                <div key={index} className={styles.publicationCard}>
                  <h3 className={styles.publicationTitle}>{pub.title}</h3>
                  <p className={styles.authors}>{pub.authors}</p>
                  <p className={styles.venue}>
                    <strong>{pub.venue} {pub.year}</strong>
                    {pub.type.includes('Spotlight') && <em> (Spotlight)</em>}
                    {pub.type.includes('Oral') && <em> (Oral)</em>}
                  </p>
                  <div className={styles.topicTags}>
                    {pub.topics.map(topic => (
                      <span key={topic} className={styles.topicTag}>{topic}</span>
                    ))}
                  </div>
                  <p className={styles.abstract}>{pub.abstract}</p>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      View Paper
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <JoinUs />
      </div>

      <Footer />
    </div>
  );
}
