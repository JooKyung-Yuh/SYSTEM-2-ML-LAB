'use client';

export default function About() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      paddingTop: '8rem'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem',
        lineHeight: 1.6
      }}>
        {/* Header */}
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 400,
            color: '#222',
            marginBottom: '1rem',
            fontFamily: 'Georgia, serif'
          }}>
            About Us
          </h1>
          <div style={{
            width: '60px',
            height: '2px',
            background: '#0066cc',
            marginBottom: '2rem'
          }}></div>
        </header>

        {/* Main Content */}
        <div style={{ fontSize: '1rem', color: '#333' }}>

          {/* Lab Director */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#222',
              marginBottom: '1.5rem',
              fontFamily: 'Georgia, serif'
            }}>
              Lab Director
            </h2>

            <div style={{
              borderLeft: '3px solid #0066cc',
              paddingLeft: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#222',
                marginBottom: '0.5rem'
              }}>
                Hae Beom Lee
              </h3>
              <p style={{
                color: '#666',
                marginBottom: '1rem',
                fontSize: '1rem'
              }}>
                Assistant Professor, School of Electrical Engineering, Korea University
              </p>

              <p style={{ marginBottom: '1rem' }}>
                Professor Lee leads our research group focusing on System 2 thinking and deliberate reasoning in AI systems.
                He brings extensive experience from his postdoctoral work at Mila (Université de Montréal) with Prof. Yoshua
                Bengio and at KAIST with Prof. Juho Lee.
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Education & Career:</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  <li>2021: Ph.D. in Computer Science, KAIST (advised by Prof. Sung Ju Hwang)</li>
                  <li>2021-2022: Postdoctoral Researcher, KAIST</li>
                  <li>2022-2023: Postdoctoral Researcher, Mila & Université de Montréal</li>
                  <li>2023-Present: Assistant Professor, Korea University</li>
                </ul>
              </div>

              <p>
                <a href="https://haebeom-lee.github.io/" target="_blank" rel="noopener noreferrer"
                   style={{ color: '#0066cc', textDecoration: 'underline' }}>
                  Personal Website
                </a> |
                <a href="mailto:haebeomlee@korea.ac.kr"
                   style={{ color: '#0066cc', textDecoration: 'underline', marginLeft: '0.5rem' }}>
                  Email
                </a>
              </p>
            </div>
          </section>

          {/* Mission */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#222',
              marginBottom: '1.5rem',
              fontFamily: 'Georgia, serif'
            }}>
              Our Mission
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Our lab at Korea University's School of Electrical Engineering is dedicated to advancing
              the frontiers of artificial intelligence through innovative research in System 2 deep learning
              and large language model reasoning.
            </p>
            <p>
              We strive to develop AI systems that can perform complex reasoning, meta-learning, and deliberate
              thinking processes, bridging the gap between current machine learning capabilities and human-like
              cognitive abilities.
            </p>
          </section>

          {/* Research Philosophy */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#222',
              marginBottom: '1.5rem',
              fontFamily: 'Georgia, serif'
            }}>
              Research Philosophy
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We emphasize both theoretical understanding and practical applications of machine learning,
              fostering interdisciplinary collaboration to solve real-world problems through innovative research.
            </p>
            <p>Our approach focuses on:</p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li><strong>Theoretical Rigor:</strong> Building solid mathematical foundations for AI systems</li>
              <li><strong>Practical Impact:</strong> Developing solutions that address real-world challenges</li>
              <li><strong>Interdisciplinary Approach:</strong> Collaborating across cognitive science, neuroscience, and computer science</li>
              <li><strong>Open Research:</strong> Contributing to the global AI research community through publications and open-source projects</li>
            </ul>
          </section>

          {/* Research Areas */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#222',
              marginBottom: '1.5rem',
              fontFamily: 'Georgia, serif'
            }}>
              Research Areas
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <p>Our research spans multiple areas at the intersection of machine learning and cognitive science:</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>
                  Large Language Model Reasoning
                </h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>
                  Advancing reasoning capabilities in large language models for complex problem solving.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>
                  System 2 Deep Learning
                </h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>
                  Developing deliberate, slow, and logical thinking processes in neural networks.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>
                  Meta-Learning
                </h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>
                  Learning to learn: algorithms that can quickly adapt to new tasks and domains.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>
                  AutoML
                </h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>
                  Automated machine learning for efficient model design and hyperparameter optimization.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>
                  Bayesian Inference
                </h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>
                  Principled uncertainty quantification and probabilistic reasoning in machine learning.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>
                  Generative Flow Networks
                </h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>
                  Novel generative models for sampling from complex probability distributions.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: '#ffffff',
        padding: '3rem 0 2rem 0',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              KU SYSTEM 2 ML LAB
            </h3>
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#bdc3c7',
              marginBottom: '1rem'
            }}>
              School of Electrical Engineering, Korea University
            </p>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: '#bdc3c7',
              marginBottom: '1rem'
            }}>
              Student Lab: Engineering Hall 238, Professor Office: Engineering Hall 501<br/>
              145 Anam-ro, Seongbuk-gu, Seoul 02841, Republic of Korea
            </p>
            <p style={{
              fontSize: '0.95rem',
              color: '#bdc3c7'
            }}>
              <a href="mailto:haebeomlee@korea.ac.kr"
                 style={{ color: '#3498db', textDecoration: 'none' }}>
                haebeomlee@korea.ac.kr
              </a>
            </p>
          </div>

          <div style={{
            borderTop: '1px solid #34495e',
            paddingTop: '1.5rem',
            fontSize: '0.875rem',
            color: '#95a5a6'
          }}>
            <p>© 2025 KU System 2 ML Lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}