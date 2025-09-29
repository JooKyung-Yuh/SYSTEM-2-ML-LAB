'use client';

export default function Courses() {
  const courses = [
    {
      title: "Advanced Machine Learning",
      level: "Graduate",
      semester: "Fall 2024",
      credits: 3,
      instructor: "Prof. Hae Beom Lee",
      schedule: "Tue/Thu 2:00-3:30 PM",
      description: "Advanced topics in machine learning including meta-learning, Bayesian inference, and optimization techniques. Focus on theoretical foundations and practical implementations.",
      prerequisites: "Linear Algebra, Probability Theory, Basic Machine Learning",
      topics: [
        "Meta-Learning and Few-Shot Learning",
        "Bayesian Deep Learning",
        "Hyperparameter Optimization",
        "AutoML Techniques",
        "Neural Architecture Search",
        "Uncertainty Quantification"
      ]
    },
    {
      title: "Deep Learning Systems",
      level: "Graduate",
      semester: "Spring 2025",
      credits: 3,
      instructor: "Prof. Hae Beom Lee",
      schedule: "Mon/Wed 3:30-5:00 PM",
      description: "System 2 deep learning approaches with emphasis on reasoning, planning, and deliberate thinking in neural networks. Covers recent advances in large language models.",
      prerequisites: "Deep Learning, Neural Networks",
      topics: [
        "System 2 vs System 1 Thinking",
        "Large Language Model Reasoning",
        "Neural Scaling Laws",
        "Generative Flow Networks",
        "Energy-Based Models",
        "Amortized Inference"
      ]
    },
    {
      title: "Research Seminar in AI",
      level: "Graduate Seminar",
      semester: "Fall 2024 & Spring 2025",
      credits: 2,
      instructor: "Prof. Hae Beom Lee",
      schedule: "Fri 2:00-4:00 PM",
      description: "Weekly seminar series covering cutting-edge research in artificial intelligence, machine learning, and optimization. Students present recent papers and discuss research directions.",
      prerequisites: "Advanced Machine Learning or equivalent",
      topics: [
        "Recent Papers in Top-Tier Conferences",
        "Research Methodology",
        "Paper Presentation Skills",
        "Critical Analysis of Research",
        "Grant Writing and Proposal Development",
        "Academic Career Development"
      ]
    }
  ];

  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.level]) {
      acc[course.level] = [];
    }
    acc[course.level].push(course);
    return acc;
  }, {} as Record<string, typeof courses>);

  const levelOrder = ["Graduate", "Graduate Seminar", "Undergraduate"];

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
            Courses
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
            Comprehensive curriculum covering fundamental to advanced topics in artificial intelligence and machine learning.
          </p>
        </header>

        {/* Course Sections */}
        {levelOrder.map((level) =>
          groupedCourses[level] && (
            <section key={level} style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: '#222',
                marginBottom: '2rem',
                fontFamily: 'Georgia, serif'
              }}>
                {level} Courses
              </h2>

              {groupedCourses[level].map((course, index) => (
                <div key={index} style={{
                  marginBottom: '2.5rem',
                  paddingBottom: '2rem',
                  borderBottom: index < groupedCourses[level].length - 1 ? '1px solid #eee' : 'none'
                }}>

                  {/* Course Header */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      marginBottom: '0.5rem'
                    }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#222',
                        margin: 0,
                        flex: 1
                      }}>
                        {course.title}
                      </h3>
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        fontWeight: 500
                      }}>
                        {course.credits} Credits
                      </span>
                    </div>

                    <div style={{
                      fontSize: '1rem',
                      color: '#666',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>Instructor:</strong> {course.instructor} |
                      <strong> Schedule:</strong> {course.schedule} |
                      <strong> Semester:</strong> {course.semester}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '1rem',
                    color: '#333',
                    marginBottom: '1rem'
                  }}>
                    {course.description}
                  </p>

                  {/* Prerequisites */}
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#222' }}>Prerequisites:</strong>
                    <span style={{ fontSize: '0.95rem', color: '#666', marginLeft: '0.5rem' }}>
                      {course.prerequisites}
                    </span>
                  </div>

                  {/* Topics */}
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#222' }}>Topics Covered:</strong>
                    <ul style={{
                      marginTop: '0.5rem',
                      paddingLeft: '1.5rem',
                      fontSize: '0.95rem',
                      color: '#666'
                    }}>
                      {course.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} style={{ marginBottom: '0.25rem' }}>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}
            </section>
          )
        )}

        {/* Academic Information */}
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
            Academic Information
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#222',
                marginBottom: '0.5rem'
              }}>
                Enrollment
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#333',
                marginBottom: '0.5rem'
              }}>
                Graduate students interested in AI research are encouraged to enroll.
                Contact the instructor for course registration information.
              </p>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#222',
                marginBottom: '0.5rem'
              }}>
                Research Opportunities
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#333',
                marginBottom: '0.5rem'
              }}>
                Students may participate in ongoing research projects related to course topics.
                Independent study and thesis opportunities are available.
              </p>
            </div>
          </div>
          <p style={{
            fontSize: '1rem',
            marginTop: '1.5rem'
          }}>
            For more information: <a href="mailto:haebeomlee@korea.ac.kr"
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