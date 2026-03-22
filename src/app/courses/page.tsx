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
          <p className={styles.emptyState}>Course information coming soon.</p>
        )}

        {sortedKeys.map((key) => (
          <section key={key} className={styles.yearSection}>
            <h2 className={styles.yearTitle}>{key}</h2>

            {grouped[key].map((course, index) => {
              const courseTopics = parseTopics(course.topics);
              return (
                <div key={course.id} className={styles.courseItem}
                  style={{ borderBottom: index < grouped[key].length - 1 ? '1px solid #eee' : 'none' }}>
                  <div className={styles.courseItemHeader}>
                    <h3 className={styles.courseItemTitle}>
                      {course.code}: {course.title}
                    </h3>
                    {course.credits && (
                      <span className={styles.courseCredits}>{course.credits} Credits</span>
                    )}
                  </div>
                  <div className={styles.courseInstructor}>
                    <strong>Instructor:</strong> {course.instructor}
                    {course.schedule && <><strong> | Schedule:</strong> {course.schedule}</>}
                  </div>

                  {course.description && (
                    <p className={styles.courseDescription}>{course.description}</p>
                  )}

                  {course.prerequisites && (
                    <div className={styles.coursePrereqs}>
                      <span className={styles.coursePrereqsLabel}>Prerequisites:</span>
                      <span className={styles.coursePrereqsValue}>{course.prerequisites}</span>
                    </div>
                  )}

                  {courseTopics.length > 0 && (
                    <div>
                      <span className={styles.coursePrereqsLabel}>Topics Covered:</span>
                      <ul className={styles.topicsList}>
                        {courseTopics.map((topic, topicIndex) => (
                          <li key={topicIndex}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.syllabus && (
                    <a href={course.syllabus} target="_blank" rel="noopener noreferrer" className={styles.syllabusLink}>
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
