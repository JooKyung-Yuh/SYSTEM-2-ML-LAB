import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Graduate and undergraduate courses offered by System 2 ML Lab at Korea University.',
  alternates: { canonical: '/courses' },
  openGraph: { url: '/courses' },
};
import styles from './courses.module.css';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';

export const dynamic = 'force-dynamic';

function parseTopics(topics: string | null | undefined): string[] {
  if (!topics) return [];
  try {
    const parsed = JSON.parse(topics);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface CourseData {
  id: string;
  code: string;
  title: string;
  semester: string;
  year: number;
  credits: number | null;
  instructor: string;
  schedule?: string | null;
  description: string | null;
  prerequisites?: string | null;
  topics?: string | null;
  syllabus: string | null;
}

export default async function CoursesPage() {
  let courses: CourseData[];

  try {
    const dbCourses = await prisma.course.findMany({
      where: { published: true },
      orderBy: [{ year: 'desc' }, { order: 'asc' }],
    });
    courses = dbCourses;
  } catch {
    courses = [];
  }

  // Group by year+semester
  const grouped = courses.reduce((acc, course) => {
    const key = `${course.year} ${course.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {} as Record<string, CourseData[]>);

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [yearA] = a.split(' ');
    const [yearB] = b.split(' ');
    return parseInt(yearB) - parseInt(yearA);
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Courses</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>
            Comprehensive curriculum covering fundamental to advanced topics in artificial intelligence and machine learning.
          </p>
        </header>

        {courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
            <p style={{ fontSize: '1.1rem' }}>Course information coming soon.</p>
          </div>
        )}

        {sortedKeys.map((key) => (
          <section key={key} style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem', fontWeight: 500, color: '#222',
              marginBottom: '2rem', fontFamily: 'Georgia, serif'
            }}>
              {key}
            </h2>

            {grouped[key].map((course, index) => {
              const courseTopics = parseTopics(course.topics);
              return (
                <div key={course.id} style={{
                  marginBottom: '2.5rem', paddingBottom: '2rem',
                  borderBottom: index < grouped[key].length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                      flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem'
                    }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', margin: 0, flex: 1 }}>
                        {course.code}: {course.title}
                      </h3>
                      {course.credits && (
                        <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
                          {course.credits} Credits
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Instructor:</strong> {course.instructor}
                      {course.schedule && <><strong> | Schedule:</strong> {course.schedule}</>}
                    </div>
                  </div>

                  {course.description && (
                    <p style={{ fontSize: '1rem', color: '#333', marginBottom: '1rem' }}>
                      {course.description}
                    </p>
                  )}

                  {course.prerequisites && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#222' }}>Prerequisites:</strong>
                      <span style={{ fontSize: '0.95rem', color: '#666', marginLeft: '0.5rem' }}>
                        {course.prerequisites}
                      </span>
                    </div>
                  )}

                  {courseTopics.length > 0 && (
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#222' }}>Topics Covered:</strong>
                      <ul className={styles.topicsList}>
                        {courseTopics.map((topic, topicIndex) => (
                          <li key={topicIndex} style={{ marginBottom: '0.25rem' }}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.syllabus && (
                    <a href={course.syllabus} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#0066cc', textDecoration: 'underline', fontSize: '0.95rem' }}>
                      View Syllabus
                    </a>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        <JoinUs />
      </div>
      <Footer />
    </div>
  );
}
