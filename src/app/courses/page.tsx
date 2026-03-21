import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Graduate and undergraduate courses offered by System 2 ML Lab at Korea University.',
};
import styles from './courses.module.css';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';

export const dynamic = 'force-dynamic';

const fallbackCourses = [
  {
    id: 'fb-1', code: 'ELEC501', title: "Advanced Machine Learning", level: "Graduate",
    semester: "Fall", year: 2024, credits: 3, instructor: "Prof. Hae Beom Lee",
    schedule: "Tue/Thu 2:00-3:30 PM",
    description: "Advanced topics in machine learning including meta-learning, Bayesian inference, and optimization techniques. Focus on theoretical foundations and practical implementations.",
    prerequisites: "Linear Algebra, Probability Theory, Basic Machine Learning",
    topics: '["Meta-Learning and Few-Shot Learning","Bayesian Deep Learning","Hyperparameter Optimization","AutoML Techniques","Neural Architecture Search","Uncertainty Quantification"]',
    syllabus: null, published: true, order: 0,
  },
  {
    id: 'fb-2', code: 'ELEC502', title: "Deep Learning Systems", level: "Graduate",
    semester: "Spring", year: 2025, credits: 3, instructor: "Prof. Hae Beom Lee",
    schedule: "Mon/Wed 3:30-5:00 PM",
    description: "System 2 deep learning approaches with emphasis on reasoning, planning, and deliberate thinking in neural networks. Covers recent advances in large language models.",
    prerequisites: "Deep Learning, Neural Networks",
    topics: '["System 2 vs System 1 Thinking","Large Language Model Reasoning","Neural Scaling Laws","Generative Flow Networks","Energy-Based Models","Amortized Inference"]',
    syllabus: null, published: true, order: 1,
  },
  {
    id: 'fb-3', code: 'ELEC590', title: "Research Seminar in AI", level: "Graduate Seminar",
    semester: "Fall", year: 2024, credits: 2, instructor: "Prof. Hae Beom Lee",
    schedule: "Fri 2:00-4:00 PM",
    description: "Weekly seminar series covering cutting-edge research in artificial intelligence, machine learning, and optimization. Students present recent papers and discuss research directions.",
    prerequisites: "Advanced Machine Learning or equivalent",
    topics: '["Recent Papers in Top-Tier Conferences","Research Methodology","Paper Presentation Skills","Critical Analysis of Research","Grant Writing and Proposal Development","Academic Career Development"]',
    syllabus: null, published: true, order: 2,
  },
];

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
    courses = dbCourses.length > 0 ? dbCourses : fallbackCourses;
  } catch {
    courses = fallbackCourses;
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
