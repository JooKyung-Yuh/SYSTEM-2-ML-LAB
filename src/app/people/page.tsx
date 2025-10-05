import prisma from '@/lib/prisma';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';
import styles from './people.module.css';

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
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            People
          </h1>
          <div className={styles.pageDivider}></div>
          <p className={styles.pageSubtitle}>
            Meet our diverse team of researchers, faculty, and students working together
            to advance the field of artificial intelligence.
          </p>
        </header>

        {/* Team Sections */}
        {categoryOrder.map((category) => {
          const members = groupedPeople[category] || [];
          if (members.length === 0) return null;

          return (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>
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

        <JoinUs />

      </div>

      <Footer />
    </div>
  );
}