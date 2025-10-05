import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding About page with Vercel data...\n');

  // Find or create About page
  let aboutPage = await prisma.page.findFirst({
    where: { slug: 'about' },
  });

  if (!aboutPage) {
    aboutPage = await prisma.page.create({
      data: {
        slug: 'about',
        title: 'About Us',
        content: null,
        published: true,
      },
    });
    console.log('✅ Created About page');
  } else {
    console.log('✅ Found existing About page');
  }

  // Delete existing sections
  await prisma.section.deleteMany({
    where: { pageId: aboutPage.id },
  });
  console.log('🗑️  Deleted old sections\n');

  // Create sections matching Vercel version
  const sections = [
    {
      title: 'Lab Director',
      content: `<p><strong>Hae Beom Lee</strong></p><p>Assistant Professor, School of Electrical Engineering, Korea University</p><p>Professor Lee leads our research group focusing on System 2 thinking and deliberate reasoning in AI systems. He brings extensive experience from his postdoctoral work at Mila (Université de Montréal) with Prof. Yoshua Bengio and at KAIST with Prof. Juho Lee.</p><p><strong>Education & Career:</strong></p><ul><li>2021: Ph.D. in Computer Science, KAIST (advised by Prof. Sung Ju Hwang)</li><li>2021-2022: Postdoctoral Researcher, KAIST</li><li>2022-2023: Postdoctoral Researcher, Mila & Université de Montréal</li><li>2023-Present: Assistant Professor, Korea University</li></ul><p><a href="https://haebeom-lee.github.io/" target="_blank" rel="noopener noreferrer">Personal Website</a> | <a href="mailto:haebeomlee@korea.ac.kr">haebeomlee@korea.ac.kr</a></p>`,
      layout: 'highlight',
      order: 0,
    },
    {
      title: 'Our Mission',
      content: `<p>Our lab at Korea University's School of Electrical Engineering is dedicated to advancing the frontiers of artificial intelligence through innovative research in System 2 deep learning and large language model reasoning.</p><p>We strive to develop AI systems that can perform complex reasoning, meta-learning, and deliberate thinking processes, bridging the gap between current machine learning capabilities and human-like cognitive abilities.</p>`,
      layout: 'full-width',
      order: 1,
    },
    {
      title: 'Research Philosophy',
      content: `<p>We emphasize both theoretical understanding and practical applications of machine learning, fostering interdisciplinary collaboration to solve real-world problems through innovative research.</p><p>Our approach focuses on:</p><ul><li><strong>Theoretical Rigor:</strong> Building solid mathematical foundations for AI systems</li><li><strong>Practical Impact:</strong> Developing solutions that address real-world challenges</li><li><strong>Interdisciplinary Approach:</strong> Collaborating across cognitive science, neuroscience, and computer science</li><li><strong>Open Research:</strong> Contributing to the global AI research community through publications and open-source projects</li></ul>`,
      layout: 'full-width',
      order: 2,
    },
    {
      title: 'Research Areas',
      content: JSON.stringify({
        description: 'Our research spans multiple areas at the intersection of machine learning and cognitive science:',
        cards: [
          {
            id: 'area-1',
            title: 'Large Language Model Reasoning',
            content: 'Advancing reasoning capabilities in large language models for complex problem solving.',
          },
          {
            id: 'area-2',
            title: 'System 2 Deep Learning',
            content: 'Developing deliberate, slow, and logical thinking processes in neural networks.',
          },
          {
            id: 'area-3',
            title: 'Meta-Learning',
            content: 'Learning to learn: algorithms that can quickly adapt to new tasks and domains.',
          },
          {
            id: 'area-4',
            title: 'AutoML',
            content: 'Automated machine learning for efficient model design and hyperparameter optimization.',
          },
          {
            id: 'area-5',
            title: 'Bayesian Inference',
            content: 'Principled uncertainty quantification and probabilistic reasoning in machine learning.',
          },
          {
            id: 'area-6',
            title: 'Generative Flow Networks',
            content: 'Novel generative models for sampling from complex probability distributions.',
          },
        ],
      }),
      layout: 'grid',
      order: 3,
    },
  ];

  // Create all sections
  for (const section of sections) {
    await prisma.section.create({
      data: {
        ...section,
        pageId: aboutPage.id,
      },
    });
    console.log(`✅ Created section: ${section.title} (${section.layout})`);
  }

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
