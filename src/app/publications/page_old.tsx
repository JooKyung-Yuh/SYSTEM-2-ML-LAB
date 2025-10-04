'use client';

export default function Publications() {
  const publications = [
    {
      title: "Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning",
      authors: "Dong Bok Lee, Hae Beom Lee, et al.",
      venue: "NeurIPS 2025",
      year: "2025",
      type: "Conference",
      abstract: "We propose a cost-sensitive approach to freeze-thaw Bayesian optimization that efficiently tunes hyperparameters by considering computational cost in the optimization process.",
      link: "#"
    },
    {
      title: "Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks",
      authors: "Dongwoo Lee*, Dong Bok Lee*, Hae Beom Lee, et al. (*equal contribution)",
      venue: "ICML 2025",
      year: "2025",
      type: "Conference",
      abstract: "This work develops Bayesian methods for extrapolating neural scaling laws using prior-fitted networks to predict performance at larger scales.",
      link: "#"
    },
    {
      title: "Delta-AI: Local Objectives for Amortized Inference in Sparse Graphical Models",
      authors: "Jean-Pierre René Falet*, Hae Beom Lee*, Nikolay Malkin* (*equal contribution)",
      venue: "ICLR 2024",
      year: "2024",
      type: "Conference",
      abstract: "We introduce Delta-AI, a method for efficient amortized inference in sparse graphical models using local objectives that scale to large networks.",
      link: "#"
    },
    {
      title: "Online Hyperparameter Meta-Learning with Hypergradient Distillation",
      authors: "Hae Beom Lee, Hayeon Lee, Dongyoon Hwang, Sung Ju Hwang",
      venue: "ICLR 2022",
      year: "2022",
      type: "Conference (Spotlight)",
      abstract: "We propose an online meta-learning approach for hyperparameter optimization that uses hypergradient distillation to efficiently adapt to new tasks.",
      link: "#"
    },
    {
      title: "Sequential Reptile: Inter-Task Gradient Alignment for Multilingual Learning",
      authors: "Seanie Lee, Hae Beom Lee, et al.",
      venue: "ICLR 2022",
      year: "2022",
      type: "Conference (Oral)",
      abstract: "This work extends the Reptile algorithm to sequential learning scenarios with inter-task gradient alignment for improved multilingual performance.",
      link: "#"
    },
    {
      title: "Meta-Learning Low Rank Covariance Factors for Energy-Based Deterministic Uncertainty",
      authors: "Jeffrey Ryan, Hae Beom Lee, et al.",
      venue: "ICLR 2022",
      year: "2022",
      type: "Conference",
      abstract: "We develop a meta-learning approach for learning low-rank covariance factors in energy-based models to improve uncertainty estimation.",
      link: "#"
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
            Publications
          </h1>
          <div style={{
            width: '60px',
            height: '2px',
            background: '#0066cc',
            marginBottom: '2rem'
          }}></div>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem'
          }}>
            Our research contributions to the field of artificial intelligence and machine learning.
          </p>
        </header>

        {/* Publications by Year */}
        {sortedYears.map((year) => (
          <section key={year} style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#222',
              marginBottom: '2rem',
              fontFamily: 'Georgia, serif'
            }}>
              {year}
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              {groupedByYear[year].map((pub, index) => (
                <div key={index} style={{
                  marginBottom: '2rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid #eee'
                }}>

                  {/* Publication Title */}
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#222',
                    marginBottom: '0.5rem',
                    lineHeight: 1.3
                  }}>
                    {pub.title}
                  </h3>

                  {/* Authors */}
                  <p style={{
                    fontSize: '1rem',
                    color: '#666',
                    marginBottom: '0.5rem'
                  }}>
                    {pub.authors}
                  </p>

                  {/* Venue */}
                  <p style={{
                    fontSize: '1rem',
                    color: '#333',
                    marginBottom: '1rem'
                  }}>
                    <strong>{pub.venue}</strong>
                    {pub.type.includes('Spotlight') && <em> (Spotlight)</em>}
                    {pub.type.includes('Oral') && <em> (Oral)</em>}
                  </p>

                  {/* Abstract */}
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#555',
                    lineHeight: 1.5,
                    marginBottom: '1rem'
                  }}>
                    {pub.abstract}
                  </p>

                  {/* Links */}
                  {pub.link && (
                    <div>
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#0066cc',
                          textDecoration: 'underline',
                          fontSize: '0.95rem'
                        }}
                      >
                        View Paper
                      </a>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Research Areas */}
        <section style={{
          marginTop: '4rem',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderLeft: '3px solid #0066cc'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#222',
            marginBottom: '1rem',
            fontFamily: 'Georgia, serif'
          }}>
            Research Areas
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#333',
            marginBottom: '1rem'
          }}>
            Our publications span several key areas in machine learning and artificial intelligence:
          </p>
          <ul style={{
            fontSize: '1rem',
            color: '#333',
            paddingLeft: '1.5rem'
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