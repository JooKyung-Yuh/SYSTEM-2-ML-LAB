import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mllab.korea.ac.kr' },
    update: {},
    create: {
      email: 'admin@mllab.korea.ac.kr',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Create news items from existing data
  const newsItems = [
    {
      date: 'September 24, 2025',
      title: 'Paper accepted at TMLR',
      description: 'One paper accepted at TMLR2025',
      links: [
        { text: 'link', url: 'https://arxiv.org/abs/2408.16218' }
      ],
      order: 1
    },
    {
      date: 'September 19, 2025',
      title: 'Three papers accepted at NeurIPS',
      description: 'Three papers (one as an oral) accepted at NeurIPS2025',
      links: [
        { text: '1', url: 'https://arxiv.org/abs/2505.23416' },
        { text: '2', url: 'https://arxiv.org/abs/2410.02992' },
        { text: '3', url: 'https://arxiv.org/abs/2509.20214' }
      ],
      order: 2
    },
    {
      date: 'August 1, 2025',
      title: 'Scholarship Award',
      description: 'Jinuk Kim was selected as a recipient of Yulchon AI Star Scholarship',
      links: [],
      order: 3
    },
    {
      date: 'June 9, 2025',
      title: 'Scholarship Award',
      description: 'Jinuk Kim was selected as a recipient of Presidential Science Scholarship for Graduate Students (full M.S./Ph.D.)',
      links: [],
      order: 4
    },
    {
      date: 'May 13, 2025',
      title: 'Paper accepted at ICML',
      description: 'One paper accepted at ICML2025',
      links: [
        { text: 'link', url: 'https://arxiv.org/abs/2505.07004' }
      ],
      order: 5
    },
    {
      date: 'May 1, 2024',
      title: 'Two papers accepted at ICML',
      description: 'Two papers accepted at ICML2024',
      links: [
        { text: '1', url: 'https://arxiv.org/abs/2406.12837' },
        { text: '2', url: 'https://arxiv.org/abs/2406.14876' }
      ],
      order: 6
    },
    {
      date: 'January 17, 2024',
      title: 'Paper accepted at ICLR',
      description: 'One paper accepted at ICLR2024',
      links: [
        { text: 'link', url: 'https://arxiv.org/abs/2312.03414' }
      ],
      order: 7
    },
    {
      date: 'September 22, 2023',
      title: 'Three papers accepted at NeurIPS',
      description: 'Three papers accepted at NeurIPS2023',
      links: [
        { text: '1', url: 'https://arxiv.org/abs/2301.12842' },
        { text: '2', url: 'https://arxiv.org/abs/2301.12321' },
        { text: '3', url: 'https://arxiv.org/abs/2307.03486' }
      ],
      order: 8
    }
  ];

  for (const item of newsItems) {
    const newsItem = await prisma.newsItem.create({
      data: {
        date: item.date,
        title: item.title,
        description: item.description,
        order: item.order,
        links: {
          create: item.links
        }
      }
    });
  }

  // Create people
  const people = [
    {
      name: 'Hae Beom Lee',
      title: 'Assistant Professor, School of Electrical Engineering at Korea University',
      email: 'haebeomlee@korea.ac.kr',
      website: 'https://haebeom-lee.github.io/',
      image: 'https://haebeom-lee.github.io/images/lee2.png',
      bio: 'Dr. Hae Beom Lee is an Assistant Professor in the School of Electrical Engineering at Korea University. His research focuses on System 2 deep learning, large language model reasoning, and meta-learning approaches. Prior to joining Korea University, he served as a postdoctoral researcher at KAIST under the supervision of Prof. Juho Lee, and at Mila and Université de Montréal under the supervision of Prof. Yoshua Bengio. His work contributes to advancing the theoretical foundations and practical applications of machine learning systems capable of deliberate reasoning and adaptive learning.',
      category: 'faculty',
      order: 1,
      published: true
    }
  ];

  for (const person of people) {
    await prisma.person.upsert({
      where: { email: person.email },
      update: person,
      create: person,
    });
  }

  // Create sample publications
  const publications = [
    {
      title: 'System 2 Deep Learning with Large Language Models',
      authors: 'Hae Beom Lee, John Doe, Jane Smith',
      venue: 'NeurIPS',
      year: 2025,
      url: 'https://arxiv.org/abs/2505.23416',
      category: 'conference',
      order: 1,
      published: true
    },
    {
      title: 'Meta-Learning for Adaptive Reasoning Systems',
      authors: 'Hae Beom Lee, Alice Johnson',
      venue: 'ICML',
      year: 2025,
      url: 'https://arxiv.org/abs/2505.07004',
      category: 'conference',
      order: 2,
      published: true
    },
    {
      title: 'Large Language Model Reasoning: A Survey',
      authors: 'Hae Beom Lee, Bob Wilson, Carol Brown',
      venue: 'Machine Learning Journal',
      year: 2024,
      url: 'https://arxiv.org/abs/2406.12837',
      category: 'journal',
      order: 3,
      published: true
    }
  ];

  for (const pub of publications) {
    await prisma.publication.create({
      data: pub
    });
  }

  // Create sample courses
  const courses = [
    {
      code: 'ELEC621',
      title: 'Machine Learning',
      description: 'Introduction to machine learning algorithms and applications',
      semester: 'Fall',
      year: 2025,
      instructor: 'Hae Beom Lee',
      credits: 3,
      order: 1,
      published: true
    },
    {
      code: 'ELEC724',
      title: 'Deep Learning',
      description: 'Advanced deep learning techniques and neural networks',
      semester: 'Spring',
      year: 2025,
      instructor: 'Hae Beom Lee',
      credits: 3,
      order: 2,
      published: true
    },
    {
      code: 'ELEC825',
      title: 'Advanced AI Systems',
      description: 'System 2 thinking and reasoning in artificial intelligence',
      semester: 'Fall',
      year: 2025,
      instructor: 'Hae Beom Lee',
      credits: 3,
      order: 3,
      published: true
    }
  ];

  for (const course of courses) {
    await prisma.course.create({
      data: course
    });
  }

  // Create sample gallery items
  const galleryItems = [
    {
      title: 'Lab Opening Ceremony',
      description: 'System 2 ML Lab official opening ceremony',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      category: 'events',
      order: 1,
      published: true
    },
    {
      title: 'Research Presentation at NeurIPS',
      description: 'Team members presenting research findings at NeurIPS 2025',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      category: 'conferences',
      order: 2,
      published: true
    },
    {
      title: 'Lab Meeting Discussion',
      description: 'Weekly lab meeting and research discussion session',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      category: 'lab-life',
      order: 3,
      published: true
    }
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: item
    });
  }

  // Create basic pages
  const pages = [
    { slug: 'about', title: 'About Us', content: 'About the ML Lab at KU' },
    { slug: 'people', title: 'People', content: 'Our team members' },
    { slug: 'publications', title: 'Publications', content: 'Our research publications' },
    { slug: 'courses', title: 'Courses', content: 'Courses offered by the lab' },
    { slug: 'gallery', title: 'Gallery', content: 'Lab photos and events' },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });