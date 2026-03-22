import { Metadata } from 'next';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';
import styles from './people.module.css';

export const metadata: Metadata = {
  title: 'People',
  description: 'Meet the researchers, faculty, and students at System 2 ML Lab, Korea University.',
  alternates: { canonical: '/people' },
  openGraph: { images: [{ url: '/api/og?title=People', width: 1200, height: 630 }], url: '/people' },
};

export const revalidate = 60; // revalidate every 60 seconds

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
    return await prisma.person.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Failed to fetch people:', error);
    return [];
  }
}

export default async function People() {
  const people = await getPeople();

  const groupedPeople = people.reduce((acc, person) => {
    if (!acc[person.category]) acc[person.category] = [];
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
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>People</h1>
          <div className={styles.pageDivider}></div>
          <p className={styles.pageSubtitle}>
            Meet our diverse team of researchers, faculty, and students working together
            to advance the field of artificial intelligence.
          </p>
        </header>

        {categoryOrder.map((category) => {
          const members = groupedPeople[category] || [];
          if (members.length === 0) return null;

          return (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>
                {categoryLabels[category] || category}
              </h2>

              {members.map((person) => (
                <div key={person.id} className={styles.personCard}>
                  <div className={styles.personImageWrapper}>
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={person.name}
                        width={150}
                        height={150}
                        className={styles.personImage}
                        unoptimized
                      />
                    ) : (
                      <div className={styles.personPlaceholder}>
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>

                  <div className={styles.personContent}>
                    <h3 className={styles.personName}>{person.name}</h3>
                    {person.title && (
                      <p className={styles.personTitle}>{person.title}</p>
                    )}

                    <div className={styles.personContacts}>
                      {person.email && (
                        <a href={`mailto:${person.email}`} className={styles.personLink}>
                          {person.email}
                        </a>
                      )}
                      {person.phone && (
                        <span className={styles.personPhone}>{person.phone}</span>
                      )}
                      {person.website && (
                        <a href={person.website} target="_blank" rel="noopener noreferrer" className={styles.personLink}>
                          Website
                        </a>
                      )}
                    </div>

                    {person.bio && (
                      <p className={styles.personBio}>{person.bio}</p>
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
