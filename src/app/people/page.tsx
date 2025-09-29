'use client';

export default function People() {
  const people = [
    {
      name: "Hae Beom Lee",
      title: "Assistant Professor & Lab Director",
      email: "haebeomlee@korea.ac.kr",
      website: "https://haebeom-lee.github.io/",
      category: "Faculty",
      bio: "Assistant Professor at Korea University's School of Electrical Engineering. Former postdoctoral researcher at KAIST and Mila (Université de Montréal), working with Prof. Juho Lee and Prof. Yoshua Bengio. Ph.D. from KAIST under Prof. Sung Ju Hwang.",
      interests: ["Large Language Model Reasoning", "System 2 Deep Learning", "Meta-Learning", "AutoML", "Bayesian Inference"],
      awards: ["Google PhD Fellowship (2021)", "Global PhD Fellowship (2019-2021)", "Outstanding Reviewer ICML (2020, 2022)"]
    },
    {
      name: "PhD Student",
      title: "PhD Candidate",
      email: "phd@korea.ac.kr",
      category: "Graduate Students",
      bio: "Researching large language model reasoning and meta-learning approaches for complex problem solving",
      interests: ["LLM Reasoning", "Meta-Learning", "Transfer Learning"]
    },
    {
      name: "Master&apos;s Student",
      title: "Master&apos;s Student",
      email: "master@korea.ac.kr",
      category: "Graduate Students",
      bio: "Working on AutoML and hyperparameter optimization for deep learning models",
      interests: ["AutoML", "Hyperparameter Optimization", "Deep Learning"]
    }
  ];

  const groupedPeople = people.reduce((acc, person) => {
    if (!acc[person.category]) {
      acc[person.category] = [];
    }
    acc[person.category].push(person);
    return acc;
  }, {} as Record<string, typeof people>);

  const categoryOrder = ["Faculty", "Researchers", "Graduate Students"];

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
            People
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
            Meet our diverse team of researchers, faculty, and students working together
            to advance the field of artificial intelligence.
          </p>
        </header>

        {/* Team Sections */}
        {categoryOrder.map((category) => {
          const members = groupedPeople[category] || [];
          if (members.length === 0) return null;

          return (
            <section key={category} style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: '#222',
                marginBottom: '2rem',
                fontFamily: 'Georgia, serif'
              }}>
                {category}
              </h2>

              {members.map((person, index) => (
                <div key={index} style={{
                  marginBottom: '2.5rem',
                  paddingBottom: '2rem',
                  borderBottom: index < members.length - 1 ? '1px solid #eee' : 'none'
                }}>

                  {/* Person Header */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#222',
                      marginBottom: '0.25rem'
                    }}>
                      {person.name}
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      color: '#666',
                      marginBottom: '0.5rem'
                    }}>
                      {person.title}
                    </p>

                    <div style={{ marginBottom: '1rem' }}>
                      <a href={`mailto:${person.email}`}
                         style={{ color: '#0066cc', textDecoration: 'underline', marginRight: '1rem' }}>
                        {person.email}
                      </a>
                      {person.website && (
                        <a href={person.website} target="_blank" rel="noopener noreferrer"
                           style={{ color: '#0066cc', textDecoration: 'underline' }}>
                          Personal Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{
                    fontSize: '1rem',
                    color: '#333',
                    marginBottom: '1rem'
                  }}>
                    {person.bio}
                  </p>

                  {/* Research Interests */}
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#222' }}>Research Interests:</strong>
                    <span style={{ fontSize: '0.95rem', color: '#666', marginLeft: '0.5rem' }}>
                      {person.interests.join(', ')}
                    </span>
                  </div>

                  {/* Awards (if available) */}
                  {person.awards && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#222' }}>Awards & Honors:</strong>
                      <ul style={{
                        marginTop: '0.25rem',
                        paddingLeft: '1.5rem',
                        fontSize: '0.95rem',
                        color: '#666'
                      }}>
                        {person.awards.map((award, idx) => (
                          <li key={idx}>{award}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              ))}
            </section>
          );
        })}

        {/* Join Us Section */}
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
            Join Our Team
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#333',
            marginBottom: '1rem'
          }}>
            We are always looking for talented and motivated individuals to join our research group.
            If you are interested in System 2 deep learning, large language model reasoning, or related areas,
            please feel free to reach out.
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#333'
          }}>
            <strong>Open Positions:</strong> PhD and Master&apos;s students, Postdoctoral researchers
          </p>
          <p style={{
            fontSize: '1rem',
            marginTop: '1rem'
          }}>
            Contact: <a href="mailto:haebeomlee@korea.ac.kr"
                       style={{ color: '#0066cc', textDecoration: 'underline' }}>
              haebeomlee@korea.ac.kr
            </a>
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