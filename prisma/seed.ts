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