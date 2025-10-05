import prisma from '@/lib/prisma';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

interface Person {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  image: string | null;
  bio: string | null;
  category: string;
  order: number;
  published: boolean;
}

async function getPeople(): Promise<Person[]> {
  try {
    const people = await prisma.person.findMany({
      where: {
        published: true
      },
      orderBy: {
        order: 'asc'
      }
    });
    return people;
  } catch (error) {
    console.error('Failed to fetch people:', error);
    return [];
  }
}

export default async function People() {
  const people = await getPeople();

  const groupedPeople = people.reduce((acc, person) => {
    if (!acc[person.category]) {
      acc[person.category] = [];
    }
    acc[person.category].push(person);
    return acc;
  }, {} as Record<string, Person[]>);

  const categoryOrder = ["faculty", "student", "alumni"];
  const categoryLabels: Record<string, string> = {
    faculty: "Faculty",
    student: "Students",
    alumni: "Alumni"
  };

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
                {categoryLabels[category] || category}
              </h2>

              {members
                .sort((a, b) => a.order - b.order)
                .map((person) => (
                <div key={person.id} style={{
                  marginBottom: '2.5rem',
                  paddingBottom: '2rem',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'flex-start'
                }}>

                  {/* Person Image */}
                  <div style={{ flexShrink: 0 }}>
                    {person.image ? (
                      <img
                        src={person.image}
                        alt={person.name}
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #e2e8f0'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '150px',
                        height: '150px',
                        backgroundColor: '#f7fafc',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#a0aec0'
                      }}>
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>

                  {/* Person Content */}
                  <div style={{ flex: 1 }}>
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
                      {person.title && (
                        <p style={{
                          fontSize: '1rem',
                          color: '#666',
                          marginBottom: '0.5rem'
                        }}>
                          {person.title}
                        </p>
                      )}

                      <div style={{ marginBottom: '1rem' }}>
                        {person.email && (
                          <a href={`mailto:${person.email}`}
                             style={{ color: '#0066cc', textDecoration: 'underline', marginRight: '1rem' }}>
                            {person.email}
                          </a>
                        )}
                        {person.phone && (
                          <span style={{ color: '#666', marginRight: '1rem' }}>
                            {person.phone}
                          </span>
                        )}
                        {person.website && (
                          <a href={person.website}
                             target="_blank"
                             rel="noopener noreferrer"
                             style={{ color: '#0066cc', textDecoration: 'underline', marginRight: '1rem' }}>
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {person.bio && (
                      <p style={{
                        fontSize: '1rem',
                        color: '#333',
                        marginBottom: '1rem'
                      }}>
                        {person.bio}
                      </p>
                    )}
                  </div>

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