'use client';

import { useState } from 'react';

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
            Gallery
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
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background: selectedCategory === category ? '#0066cc' : 'transparent',
                  color: selectedCategory === category ? '#ffffff' : '#0066cc',
                  border: '1px solid #0066cc',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = '#f0f6ff';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {sortedItems.map((item) => (
            <article key={item.id} style={{
              marginBottom: '2rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid #eee'
            }}>
              {/* Image Placeholder */}
              <div style={{
                height: '200px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: '#999',
                fontSize: '3rem'
              }}>
                📷
              </div>

              {/* Content */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#222',
                    margin: 0,
                    flex: 1
                  }}>
                    {item.title}
                  </h3>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    marginLeft: '1rem',
                    flexShrink: 0
                  }}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  <strong>Category:</strong> {item.category}
                </p>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#333',
                  lineHeight: 1.5,
                  margin: 0
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
          marginBottom: '2rem'
        }}>
          Showing {sortedItems.length} of {galleryItems.length} items
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>

        {/* Gallery Information */}
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
            About Our Gallery
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#333',
            marginBottom: '1rem'
          }}>
            Our gallery showcases the vibrant research community and collaborative spirit of our lab.
            From conference presentations to daily research activities, these images capture the essence
            of our journey in advancing artificial intelligence research.
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#333'
          }}>
            We regularly update our gallery with new events, achievements, and milestones.
            For high-resolution images or specific requests, please contact us.
          </p>
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