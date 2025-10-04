'use client';

import styles from './publications.module.css';

export default function Publications() {
  const publications = [
    {
      title: "Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning",
      authors: "Dong Bok Lee, Hae Beom Lee, et al.",
      venue: "NeurIPS 2025",
      year: "2025",
      type: "Conference",
      abstract: "We propose a cost-sensitive approach to freeze-thaw Bayesian optimization that efficiently tunes hyperparameters by considering computational cost in the optimization process.",
      link: "https://arxiv.org/abs/2405.17918"
    },
    {
      title: "Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks",
      authors: "Dongwoo Lee*, Dong Bok Lee*, Hae Beom Lee, et al. (*equal contribution)",
      venue: "ICML 2025",
      year: "2025",
      type: "Conference",
      abstract: "This work develops Bayesian methods for extrapolating neural scaling laws using prior-fitted networks to predict performance at larger scales.",
      link: "https://arxiv.org/abs/2505.23032"
    },
    {
      title: "Delta-AI: Local Objectives for Amortized Inference in Sparse Graphical Models",
      authors: "Jean-Pierre René Falet*, Hae Beom Lee*, Nikolay Malkin* (*equal contribution)",
      venue: "ICLR 2024",
      year: "2024",
      type: "Conference",
      abstract: "We introduce Delta-AI, a method for efficient amortized inference in sparse graphical models using local objectives that scale to large networks.",
      link: "https://arxiv.org/abs/2310.02423"
    },
    {
      title: "Online Hyperparameter Meta-Learning with Hypergradient Distillation",
      authors: "Hae Beom Lee, Hayeon Lee, Dongyoon Hwang, Sung Ju Hwang",
      venue: "ICLR 2022",
      year: "2022",
      type: "Conference (Spotlight)",
      abstract: "We propose an online meta-learning approach for hyperparameter optimization that uses hypergradient distillation to efficiently adapt to new tasks.",
      link: "https://arxiv.org/abs/2110.02508"
    },
    {
      title: "Sequential Reptile: Inter-Task Gradient Alignment for Multilingual Learning",
      authors: "Seanie Lee, Hae Beom Lee, et al.",
      venue: "ICLR 2022",
      year: "2022",
      type: "Conference (Oral)",
      abstract: "This work extends the Reptile algorithm to sequential learning scenarios with inter-task gradient alignment for improved multilingual performance.",
      link: "https://arxiv.org/abs/2110.02600"
    },
    {
      title: "Meta-Learning Low Rank Covariance Factors for Energy-Based Deterministic Uncertainty",
      authors: "Jeffrey Ryan, Hae Beom Lee, et al.",
      venue: "ICLR 2022",
      year: "2022",
      type: "Conference",
      abstract: "We develop a meta-learning approach for learning low-rank covariance factors in energy-based models to improve uncertainty estimation.",
      link: "https://arxiv.org/abs/2110.02381"
    }
  ];

  const groupedByYear = publications.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = [];
    }
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<string, typeof publications>);

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

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
        </header>

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
                    <strong>{pub.venue}</strong>
                    {pub.type.includes('Spotlight') && <em> (Spotlight)</em>}
                    {pub.type.includes('Oral') && <em> (Oral)</em>}
                  </p>
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

        {/* Research Areas */}
        <section style={{
          marginTop: '4rem',
          padding: 'clamp(1.5rem, 3vw, 2rem)',
          backgroundColor: '#f8f9fa',
          borderLeft: '3px solid #0066cc'
        }}>
          <h2 className={styles.yearTitle}>Research Areas</h2>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: '#333', marginBottom: '1rem' }}>
            Our publications span several key areas in machine learning and artificial intelligence:
          </p>
          <ul style={{
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            color: '#333',
            paddingLeft: 'clamp(1rem, 2vw, 1.5rem)',
            lineHeight: 1.8
          }}>
            <li>Large Language Model Reasoning</li>
            <li>System 2 Deep Learning</li>
            <li>Meta-Learning and Few-Shot Learning</li>
            <li>AutoML and Hyperparameter Optimization</li>
            <li>Bayesian Inference and Uncertainty Quantification</li>
            <li>Generative Flow Networks</li>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 className={styles.footerTitle}>KU SYSTEM 2 ML LAB</h3>
            <p className={styles.footerText}>
              School of Electrical Engineering, Korea University
            </p>
            <p className={styles.footerAddress}>
              Student Lab: Engineering Hall 238, Professor Office: Engineering Hall 501<br/>
              145 Anam-ro, Seongbuk-gu, Seoul 02841, Republic of Korea
            </p>
            <p className={styles.footerText}>
              <a href="mailto:haebeomlee@korea.ac.kr" className={styles.footerLink}>
                haebeomlee@korea.ac.kr
              </a>
            </p>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2025 KU System 2 ML Lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
