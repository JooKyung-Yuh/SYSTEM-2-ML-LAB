import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdminData() {
  console.log('🌱 Seeding admin data...');

  try {
    // Create About Us page
    const aboutPage = await prisma.page.upsert({
      where: { slug: 'about' },
      update: {},
      create: {
        slug: 'about',
        title: 'About Us',
        content: 'About our lab and research',
        published: true,
        sections: {
          create: [
            {
              title: 'Our Mission',
              content: 'Led by Professor Hae Beom Lee, our lab at Korea University\'s School of Electrical Engineering is dedicated to advancing the frontiers of artificial intelligence through innovative research in System 2 deep learning and large language model reasoning.',
              order: 0
            },
            {
              title: 'Research Philosophy',
              content: 'We emphasize both theoretical understanding and practical applications of machine learning, fostering interdisciplinary collaboration to solve real-world problems through innovative research.',
              order: 1
            },
            {
              title: 'Research Areas',
              content: 'Our research spans multiple areas including Large Language Model Reasoning, System 2 Deep Learning, Meta-Learning, AutoML, Bayesian Inference, and Generative Flow Networks.',
              order: 2
            }
          ]
        }
      },
      include: { sections: true }
    });

    // Create other pages
    const peopePage = await prisma.page.upsert({
      where: { slug: 'people' },
      update: {},
      create: {
        slug: 'people',
        title: 'People',
        content: 'Meet our research team',
        published: true,
        sections: {
          create: [
            {
              title: 'Faculty',
              content: 'Our distinguished faculty members leading cutting-edge research in AI and machine learning.',
              order: 0
            },
            {
              title: 'Students',
              content: 'Talented graduate students pursuing advanced research in various areas of machine learning.',
              order: 1
            }
          ]
        }
      },
      include: { sections: true }
    });

    const publicationsPage = await prisma.page.upsert({
      where: { slug: 'publications' },
      update: {},
      create: {
        slug: 'publications',
        title: 'Publications',
        content: 'Our research publications and contributions',
        published: true,
        sections: {
          create: [
            {
              title: 'Recent Publications',
              content: 'Latest research papers and contributions to the field of machine learning and AI.',
              order: 0
            },
            {
              title: 'Conference Papers',
              content: 'Publications in top-tier conferences including NeurIPS, ICML, ICLR.',
              order: 1
            }
          ]
        }
      },
      include: { sections: true }
    });

    const coursesPage = await prisma.page.upsert({
      where: { slug: 'courses' },
      update: {},
      create: {
        slug: 'courses',
        title: 'Courses',
        content: 'Academic courses and educational programs',
        published: true,
        sections: {
          create: [
            {
              title: 'Graduate Courses',
              content: 'Advanced courses in machine learning, deep learning, and AI systems.',
              order: 0
            },
            {
              title: 'Course Information',
              content: 'Detailed information about course schedules, syllabi, and requirements.',
              order: 1
            }
          ]
        }
      },
      include: { sections: true }
    });

    const galleryPage = await prisma.page.upsert({
      where: { slug: 'gallery' },
      update: {},
      create: {
        slug: 'gallery',
        title: 'Gallery',
        content: 'Lab activities and research highlights',
        published: true,
        sections: {
          create: [
            {
              title: 'Lab Activities',
              content: 'Photos and highlights from our research activities, meetings, and events.',
              order: 0
            },
            {
              title: 'Research Highlights',
              content: 'Visual documentation of our research progress and achievements.',
              order: 1
            }
          ]
        }
      },
      include: { sections: true }
    });

    // Create Professor
    const professor = await prisma.person.upsert({
      where: { email: 'haebeomlee@korea.ac.kr' },
      update: {},
      create: {
        name: 'Hae Beom Lee',
        title: 'Assistant Professor & Lab Director',
        email: 'haebeomlee@korea.ac.kr',
        bio: 'Assistant Professor at Korea University\'s School of Electrical Engineering. Former postdoctoral researcher at KAIST and Mila (Université de Montréal), working with Prof. Juho Lee and Prof. Yoshua Bengio. Ph.D. from KAIST under Prof. Sung Ju Hwang.',
        category: 'faculty',
        order: 0,
        published: true
      }
    });

    // Create sample students
    const students = await Promise.all([
      prisma.person.upsert({
        where: { email: 'phd1@korea.ac.kr' },
        update: {},
        create: {
          name: 'PhD Student A',
          title: 'PhD Candidate',
          email: 'phd1@korea.ac.kr',
          bio: 'Researching large language model reasoning and meta-learning approaches for complex problem solving',
          category: 'student',
          order: 1,
          published: true
        }
      }),
      prisma.person.upsert({
        where: { email: 'ms1@korea.ac.kr' },
        update: {},
        create: {
          name: 'Master Student A',
          title: 'Master\'s Student',
          email: 'ms1@korea.ac.kr',
          bio: 'Working on AutoML and hyperparameter optimization for deep learning models',
          category: 'student',
          order: 2,
          published: true
        }
      })
    ]);

    // Create sample publications
    const publications = await Promise.all([
      prisma.publication.upsert({
        where: {
          title_authors_venue: {
            title: 'Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning',
            authors: 'Dong Bok Lee, Hae Beom Lee, et al.',
            venue: 'NeurIPS 2025'
          }
        },
        update: {},
        create: {
          title: 'Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning',
          authors: 'Dong Bok Lee, Hae Beom Lee, et al.',
          venue: 'NeurIPS 2025',
          year: 2025,
          category: 'conference',
          order: 0,
          published: true
        }
      }),
      prisma.publication.upsert({
        where: {
          title_authors_venue: {
            title: 'Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks',
            authors: 'Dongwoo Lee*, Dong Bok Lee*, Hae Beom Lee, et al.',
            venue: 'ICML 2025'
          }
        },
        update: {},
        create: {
          title: 'Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks',
          authors: 'Dongwoo Lee*, Dong Bok Lee*, Hae Beom Lee, et al.',
          venue: 'ICML 2025',
          year: 2025,
          category: 'conference',
          order: 1,
          published: true
        }
      }),
      prisma.publication.upsert({
        where: {
          title_authors_venue: {
            title: 'Online Hyperparameter Meta-Learning with Hypergradient Distillation',
            authors: 'Hae Beom Lee, Hayeon Lee, Dongyoon Hwang, Sung Ju Hwang',
            venue: 'ICLR 2022'
          }
        },
        update: {},
        create: {
          title: 'Online Hyperparameter Meta-Learning with Hypergradient Distillation',
          authors: 'Hae Beom Lee, Hayeon Lee, Dongyoon Hwang, Sung Ju Hwang',
          venue: 'ICLR 2022',
          year: 2022,
          category: 'conference',
          order: 2,
          published: true
        }
      })
    ]);

    // Create sample courses
    const courses = await Promise.all([
      prisma.course.upsert({
        where: { code: 'ELEC701' },
        update: {},
        create: {
          code: 'ELEC701',
          title: 'Advanced Machine Learning',
          description: 'Advanced topics in machine learning including meta-learning, Bayesian inference, and optimization techniques.',
          semester: 'Fall',
          year: 2024,
          instructor: 'Prof. Hae Beom Lee',
          credits: 3,
          order: 0,
          published: true
        }
      }),
      prisma.course.upsert({
        where: { code: 'ELEC702' },
        update: {},
        create: {
          code: 'ELEC702',
          title: 'Deep Learning Systems',
          description: 'System 2 deep learning approaches with emphasis on reasoning, planning, and deliberate thinking in neural networks.',
          semester: 'Spring',
          year: 2025,
          instructor: 'Prof. Hae Beom Lee',
          credits: 3,
          order: 1,
          published: true
        }
      })
    ]);

    // Create sample gallery items
    const galleryItems = await Promise.all([
      prisma.galleryItem.upsert({
        where: { title: 'Research Team Meeting' },
        update: {},
        create: {
          title: 'Research Team Meeting',
          description: 'Weekly research discussion and brainstorming session with team members',
          imageUrl: '/api/placeholder/400/300',
          category: 'lab-activities',
          order: 0,
          published: true
        }
      }),
      prisma.galleryItem.upsert({
        where: { title: 'ICML 2024 Conference' },
        update: {},
        create: {
          title: 'ICML 2024 Conference',
          description: 'Presenting our latest research at the International Conference on Machine Learning',
          imageUrl: '/api/placeholder/400/300',
          category: 'conferences',
          order: 1,
          published: true
        }
      }),
      prisma.galleryItem.upsert({
        where: { title: 'Lab Computing Infrastructure' },
        update: {},
        create: {
          title: 'Lab Computing Infrastructure',
          description: 'State-of-the-art GPU clusters supporting our research',
          imageUrl: '/api/placeholder/400/300',
          category: 'facilities',
          order: 2,
          published: true
        }
      })
    ]);

    console.log('✅ Admin data seeded successfully!');
    console.log(`Created:`);
    console.log(`- 5 pages: About, People, Publications, Courses, Gallery`);
    console.log(`- ${aboutPage.sections.length + peopePage.sections.length + publicationsPage.sections.length + coursesPage.sections.length + galleryPage.sections.length} total sections across all pages`);
    console.log(`- 1 professor: ${professor.name}`);
    console.log(`- ${students.length} students`);
    console.log(`- ${publications.length} publications`);
    console.log(`- ${courses.length} courses`);
    console.log(`- ${galleryItems.length} gallery items`);

  } catch (error) {
    console.error('❌ Error seeding admin data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminData().catch((error) => {
  console.error(error);
  process.exit(1);
});