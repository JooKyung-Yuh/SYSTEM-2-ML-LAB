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
    // === 2025 ===
    {
      title: "Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning",
      authors: "Dong Bok Lee, Aoxuan Silvia Zhang, Byungjoo Kim, Junhyeon Park, Steven Adriaensen, Juho Lee, Sung Ju Hwang, Hae Beom Lee",
      venue: "NeurIPS",
      year: "2025",
      type: "Conference",
      topics: ["AutoML", "Bayesian Optimization"],
      abstract: "We propose a cost-sensitive approach to freeze-thaw Bayesian optimization that efficiently tunes hyperparameters by considering computational cost in the optimization process.",
      link: "https://arxiv.org/abs/2405.17918"
    },
    {
      title: "Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks",
      authors: "Dongwoo Lee*, Dong Bok Lee*, Steven Adriaensen, Juho Lee, Sung Ju Hwang, Frank Hutter, Seon Joo Kim, Hae Beom Lee (*equal contribution)",
      venue: "ICML",
      year: "2025",
      type: "Conference",
      topics: ["Bayesian Inference", "Neural Scaling Laws"],
      abstract: "This work develops Bayesian methods for extrapolating neural scaling laws using prior-fitted networks to predict performance at larger scales.",
      link: "https://arxiv.org/abs/2505.23032"
    },
    // === 2024 ===
    {
      title: "Delta-AI: Local Objectives for Amortized Inference in Sparse Graphical Models",
      authors: "Jean-Pierre Falet*, Hae Beom Lee*, Nikolay Malkin*, Chen Sun, Dragos Secrieru, Dinghuai Zhang, Guillaume Lajoie, Yoshua Bengio (*equal contribution)",
      venue: "ICLR",
      year: "2024",
      type: "Conference",
      topics: ["Bayesian Inference", "GFlowNets"],
      abstract: "We introduce Delta-AI, a method for efficient amortized inference in sparse graphical models using local objectives that scale to large networks.",
      link: "https://arxiv.org/abs/2310.02423"
    },
    // === 2022 ===
    {
      title: "Online Hyperparameter Meta-Learning with Hypergradient Distillation",
      authors: "Hae Beom Lee, Hayeon Lee, Jaewoong Shin, Eunho Yang, Timothy M. Hospedales, Sung Ju Hwang",
      venue: "ICLR",
      year: "2022",
      type: "Conference (Spotlight)",
      topics: ["Meta-Learning", "AutoML"],
      abstract: "We propose an online meta-learning approach for hyperparameter optimization that uses hypergradient distillation to efficiently adapt to new tasks.",
      link: "https://arxiv.org/abs/2110.02508"
    },
    {
      title: "Sequential Reptile: Inter-Task Gradient Alignment for Multilingual Learning",
      authors: "Seanie Lee*, Hae Beom Lee*, Juho Lee, Sung Ju Hwang (*equal contribution)",
      venue: "ICLR",
      year: "2022",
      type: "Conference",
      topics: ["Meta-Learning", "Multilingual Learning"],
      abstract: "This work extends the Reptile algorithm to sequential learning scenarios with inter-task gradient alignment for improved multilingual performance.",
      link: "https://arxiv.org/abs/2110.02600"
    },
    {
      title: "Meta-Learning Low Rank Covariance Factors for Energy-Based Deterministic Uncertainty",
      authors: "Jeffrey Ryan Willette, Hae Beom Lee, Juho Lee, Sung Ju Hwang",
      venue: "ICLR",
      year: "2022",
      type: "Conference",
      topics: ["Meta-Learning", "Uncertainty Estimation"],
      abstract: "We develop a meta-learning approach for learning low-rank covariance factors in energy-based models to improve uncertainty estimation.",
      link: "https://arxiv.org/abs/2110.06381"
    },
    // === 2021 ===
    {
      title: "Large-Scale Meta-Learning with Continual Trajectory Shifting",
      authors: "Jaewoong Shin*, Hae Beom Lee*, Boqing Gong, Sung Ju Hwang (*equal contribution)",
      venue: "ICML",
      year: "2021",
      type: "Conference",
      topics: ["Meta-Learning", "Continual Learning"],
      abstract: "We propose a continual trajectory shifting method that enables large-scale meta-learning by efficiently managing task distributions over time.",
      link: "https://arxiv.org/abs/2102.07215",
      code: "https://github.com/JWoong148/ContinualTrajectoryShifting"
    },
    // === 2020 ===
    {
      title: "MetaPerturb: Transferable Regularizer for Heterogeneous Tasks and Architectures",
      authors: "Jeongun Ryu*, Jaewoong Shin*, Hae Beom Lee*, Sung Ju Hwang (*equal contribution)",
      venue: "NeurIPS",
      year: "2020",
      type: "Conference (Spotlight)",
      topics: ["Meta-Learning", "Transfer Learning"],
      abstract: "We introduce MetaPerturb, a transferable regularization method that can be applied across heterogeneous tasks and neural network architectures.",
      link: "https://papers.nips.cc/paper/2020/file/84ddfb34126fc3a48ee38d7044e87276-Paper.pdf",
      code: "https://github.com/JWoong148/metaperturb"
    },
    {
      title: "Meta-Learning for Short Utterance Speaker Recognition with Imbalance Length Pairs",
      authors: "Seong Min Kye, Youngmoon Jung, Hae Beom Lee, Sung Ju Hwang, Hoirin Kim",
      venue: "Interspeech",
      year: "2020",
      type: "Conference",
      topics: ["Meta-Learning", "Speech Recognition"],
      abstract: "We apply meta-learning techniques to speaker recognition with short utterances, addressing the challenge of imbalanced length pairs in training data.",
      link: "https://arxiv.org/abs/2004.02863",
      code: "https://github.com/seongmin-kye/meta-SR"
    },
    {
      title: "Meta Variance Transfer: Learning to Augment from the Others",
      authors: "Seong Jin Park, Seungju Han, Ji-won Baek, Insoo Kim, Juhwan Song, Hae Beom Lee, Jae-Joon Han, Sung Ju Hwang",
      venue: "ICML",
      year: "2020",
      type: "Conference",
      topics: ["Meta-Learning", "Data Augmentation"],
      abstract: "We propose Meta Variance Transfer, a method that learns to augment data by transferring variance information from related tasks.",
      link: "https://proceedings.icml.cc/static/paper_files/icml/2020/2222-Paper.pdf"
    },
    {
      title: "Learning to Balance: Bayesian Meta-Learning for Imbalanced and Out-of-distribution Tasks",
      authors: "Hae Beom Lee*, Hayeon Lee*, Donghyun Na*, Saehoon Kim, Minseop Park, Eunho Yang, Sung Ju Hwang (*equal contribution)",
      venue: "ICLR",
      year: "2020",
      type: "Conference (Oral)",
      topics: ["Meta-Learning", "Bayesian Inference", "Imbalanced Learning"],
      abstract: "We propose a Bayesian meta-learning framework that learns to balance between tasks with imbalanced class distributions and out-of-distribution samples.",
      link: "https://openreview.net/pdf?id=rkeZIJBYvr",
      code: "https://github.com/haebeom-lee/l2b"
    },
    {
      title: "Meta Dropout: Learning to Perturb Latent Features for Generalization",
      authors: "Hae Beom Lee, Taewook Nam, Eunho Yang, Sung Ju Hwang",
      venue: "ICLR",
      year: "2020",
      type: "Conference",
      topics: ["Meta-Learning", "Regularization"],
      abstract: "We introduce Meta Dropout, a method that meta-learns optimal perturbation patterns for latent features to improve model generalization.",
      link: "https://openreview.net/pdf?id=BJgd81SYwr",
      code: "https://github.com/haebeom-lee/metadrop"
    },
    // === 2018 ===
    {
      title: "DropMax: Adaptive Variational Softmax",
      authors: "Hae Beom Lee, Juho Lee, Saehoon Kim, Eunho Yang, Sung Ju Hwang",
      venue: "NeurIPS",
      year: "2018",
      type: "Conference",
      topics: ["Bayesian Inference", "Deep Learning"],
      abstract: "We propose DropMax, an adaptive variational method for softmax that improves classification by learning to drop irrelevant classes during training.",
      link: "https://arxiv.org/abs/1712.07834",
      code: "https://github.com/haebeom-lee/dropmax"
    },
    {
      title: "Uncertainty-Aware Attention for Reliable Interpretation and Prediction",
      authors: "Jay Heo*, Hae Beom Lee*, Saehoon Kim, Juho Lee, Kwang Joon Kim, Eunho Yang, Sung Ju Hwang (*equal contribution)",
      venue: "NeurIPS",
      year: "2018",
      type: "Conference",
      topics: ["Uncertainty Estimation", "Attention Mechanism"],
      abstract: "We develop an uncertainty-aware attention mechanism that provides reliable interpretations while maintaining prediction accuracy.",
      link: "https://arxiv.org/abs/1805.09653",
      code: "https://github.com/jayheo/UA"
    },
    {
      title: "Deep Asymmetric Multi-task Feature Learning",
      authors: "Hae Beom Lee, Eunho Yang, Sung Ju Hwang",
      venue: "ICML",
      year: "2018",
      type: "Conference",
      topics: ["Multi-Task Learning", "Deep Learning"],
      abstract: "We propose an asymmetric multi-task learning framework that allows flexible knowledge sharing between tasks with different complexities.",
      link: "https://arxiv.org/abs/1708.00260",
      code: "https://github.com/haebeom-lee/amtfl"
    },
    // === Preprints ===
    {
      title: "Dataset Condensation with Latent Space Knowledge Factorization and Sharing",
      authors: "Hae Beom Lee*, Dong Bok Lee*, Sung Ju Hwang (*equal contribution)",
      venue: "arXiv",
      year: "2022",
      type: "Preprint",
      topics: ["Meta-Learning", "Data Augmentation"],
      abstract: "We propose a dataset condensation method that factorizes and shares knowledge in latent space for efficient dataset distillation.",
      link: "https://arxiv.org/abs/2208.10494"
    },
    {
      title: "Meta-Learned Confidence for Few-shot Learning",
      authors: "Sung Min Kye, Hae Beom Lee, Hoirin Kim, Sung Ju Hwang",
      venue: "arXiv",
      year: "2020",
      type: "Preprint",
      topics: ["Meta-Learning", "Few-Shot Learning"],
      abstract: "We propose a meta-learning approach that learns to generate confidence scores for few-shot learning predictions, improving reliability and calibration.",
      link: "https://arxiv.org/abs/2002.12017",
      code: "https://github.com/seongmin-kye/MCT"
    },
    {
      title: "Adaptive Network Sparsification with Dependent Variational Beta-Bernoulli Dropout",
      authors: "Juho Lee, Saehoon Kim, Jaehong Yoon, Hae Beom Lee, Eunho Yang, Sung Ju Hwang",
      venue: "arXiv",
      year: "2018",
      type: "Preprint",
      topics: ["Bayesian Inference", "Network Pruning"],
      abstract: "We introduce a dependent variational Beta-Bernoulli dropout method for adaptive network sparsification that learns structured sparsity patterns.",
      link: "https://arxiv.org/abs/1805.10896",
      code: "https://github.com/OpenXAIProject/Variational_Dropouts"
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
                  <div className={styles.linkContainer}>
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        Paper
                      </a>
                    )}
                    {pub.code && (
                      <a
                        href={pub.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.codeLink}
                      >
                        Code
                      </a>
                    )}
                  </div>
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
