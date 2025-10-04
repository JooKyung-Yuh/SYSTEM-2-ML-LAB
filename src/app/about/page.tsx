'use client';

import { useState, useEffect } from 'react';
import styles from './about.module.css';

interface PageSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  sections: PageSection[];
}

export default function About() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const pages = await response.json();
        const aboutPage = pages.find((p: PageData) => p.slug === 'about');
        if (aboutPage) {
          setPageData(aboutPage);
        }
      }
    } catch (error) {
      console.error('Failed to fetch page data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {pageData?.title || 'About Us'}
          </h1>
          <div className={styles.divider}></div>
        </header>

        {/* Page Content */}
        {pageData?.content && (
          <div className={styles.section}>
            <p className={styles.paragraph}>{pageData.content}</p>
          </div>
        )}

        {/* Dynamic Sections */}
        <div>
          {pageData?.sections && pageData.sections.length > 0 ? (
            pageData.sections.sort((a, b) => a.order - b.order).map((section) => (
              <section key={section.id} className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {section.title}
                </h2>
                <div
                  dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br>') }}
                />
              </section>
            ))
          ) : (
            // Default content when no sections exist
            <>
              {/* Lab Director */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Lab Director</h2>
                <div className={styles.directorCard}>
                  <h3 className={styles.directorName}>Hae Beom Lee</h3>
                  <p className={styles.directorTitle}>
                    Assistant Professor, School of Electrical Engineering, Korea University
                  </p>
                  <p className={styles.paragraph}>
                    Professor Lee leads our research group focusing on System 2 thinking and deliberate reasoning in AI systems.
                    He brings extensive experience from his postdoctoral work at Mila (Université de Montréal) with Prof. Yoshua
                    Bengio and at KAIST with Prof. Juho Lee.
                  </p>
                  <div className={styles.paragraph}>
                    <strong>Education & Career:</strong>
                    <ul className={styles.list}>
                      <li>2021: Ph.D. in Computer Science, KAIST (advised by Prof. Sung Ju Hwang)</li>
                      <li>2021-2022: Postdoctoral Researcher, KAIST</li>
                      <li>2022-2023: Postdoctoral Researcher, Mila & Université de Montréal</li>
                      <li>2023-Present: Assistant Professor, Korea University</li>
                    </ul>
                  </div>
                  <p>
                    <a href="https://haebeom-lee.github.io/" target="_blank" rel="noopener noreferrer"
                       className={styles.link}>
                      Personal Website
                    </a> |{' '}
                    <a href="mailto:haebeomlee@korea.ac.kr" className={styles.link}>
                      Email
                    </a>
                  </p>
                </div>
              </section>

              {/* Mission */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Our Mission</h2>
                <p className={styles.paragraph}>
                  Our lab at Korea University&apos;s School of Electrical Engineering is dedicated to advancing
                  the frontiers of artificial intelligence through innovative research in System 2 deep learning
                  and large language model reasoning.
                </p>
                <p className={styles.paragraph}>
                  We strive to develop AI systems that can perform complex reasoning, meta-learning, and deliberate
                  thinking processes, bridging the gap between current machine learning capabilities and human-like
                  cognitive abilities.
                </p>
              </section>

              {/* Research Philosophy */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Research Philosophy</h2>
                <p className={styles.paragraph}>
                  We emphasize both theoretical understanding and practical applications of machine learning,
                  fostering interdisciplinary collaboration to solve real-world problems through innovative research.
                </p>
                <p className={styles.paragraph}>Our approach focuses on:</p>
                <ul className={styles.list}>
                  <li><strong>Theoretical Rigor:</strong> Building solid mathematical foundations for AI systems</li>
                  <li><strong>Practical Impact:</strong> Developing solutions that address real-world challenges</li>
                  <li><strong>Interdisciplinary Approach:</strong> Collaborating across cognitive science, neuroscience, and computer science</li>
                  <li><strong>Open Research:</strong> Contributing to the global AI research community through publications and open-source projects</li>
                </ul>
              </section>

              {/* Research Areas */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Research Areas</h2>
                <p className={styles.paragraph}>
                  Our research spans multiple areas at the intersection of machine learning and cognitive science:
                </p>
                <div className={styles.researchGrid}>
                  <div className={styles.researchCard}>
                    <h3>Large Language Model Reasoning</h3>
                    <p>Advancing reasoning capabilities in large language models for complex problem solving.</p>
                  </div>
                  <div className={styles.researchCard}>
                    <h3>System 2 Deep Learning</h3>
                    <p>Developing deliberate, slow, and logical thinking processes in neural networks.</p>
                  </div>
                  <div className={styles.researchCard}>
                    <h3>Meta-Learning</h3>
                    <p>Learning to learn: algorithms that can quickly adapt to new tasks and domains.</p>
                  </div>
                  <div className={styles.researchCard}>
                    <h3>AutoML</h3>
                    <p>Automated machine learning for efficient model design and hyperparameter optimization.</p>
                  </div>
                  <div className={styles.researchCard}>
                    <h3>Bayesian Inference</h3>
                    <p>Principled uncertainty quantification and probabilistic reasoning in machine learning.</p>
                  </div>
                  <div className={styles.researchCard}>
                    <h3>Generative Flow Networks</h3>
                    <p>Novel generative models for sampling from complex probability distributions.</p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
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
