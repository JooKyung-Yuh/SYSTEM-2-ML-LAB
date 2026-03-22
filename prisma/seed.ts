import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create site settings with defaults
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      showNewsCarousel: false,
      showRecruitmentBanner: true,
    },
  });

  // Create admin user - uses environment variables for security
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mllab.korea.ac.kr';
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn('WARNING: ADMIN_PASSWORD env var not set. Skipping admin user creation.');
    console.warn('Set ADMIN_PASSWORD to create/update the admin user.');
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: hashedPassword },
      create: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`Admin user created/updated: ${adminEmail}`);
  }

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
    // First, check if news item exists
    const existing = await prisma.newsItem.findUnique({
      where: {
        title_date: {
          title: item.title,
          date: item.date,
        },
      },
      include: { links: true },
    });

    if (existing) {
      // Delete existing links and update
      await prisma.newsLink.deleteMany({
        where: { newsItemId: existing.id },
      });

      await prisma.newsItem.update({
        where: { id: existing.id },
        data: {
          description: item.description,
          order: item.order,
          links: {
            create: item.links,
          },
        },
      });
    } else {
      // Create new
      await prisma.newsItem.create({
        data: {
          date: item.date,
          title: item.title,
          description: item.description,
          order: item.order,
          links: {
            create: item.links,
          },
        },
      });
    }
  }

  // Create people
  const people = [
    {
      name: 'Hae Beom Lee',
      title: 'Assistant Professor, School of Electrical Engineering at Korea University',
      email: 'haebeomlee@korea.ac.kr',
      website: 'https://haebeom-lee.github.io/',
      image: 'https://haebeom-lee.github.io/images/lee2.png',
      bio: `Dr. Hae Beom Lee is an Assistant Professor in the School of Electrical Engineering at Korea University. His research focuses on Large Language Model Reasoning, System 2 Deep Learning, Meta-Learning, AutoML/Hyperparameter Optimization, Bayesian Inference, and Generative Flow Networks (GFlowNet).

Prior to joining Korea University, he served as a postdoctoral researcher at KAIST under Prof. Juho Lee, and at Mila & Université de Montréal under Prof. Yoshua Bengio. He received his Ph.D. from KAIST under Prof. Sung Ju Hwang.

Awards & Honors:
• Google Ph.D. Fellowship Program 2021
• Global Ph.D. Fellowship Program (2019-2021)
• ICML 2022 Outstanding Reviewer (Top 10%)
• ICML 2020 Outstanding Reviewer (Top 33%)`,
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
    await prisma.publication.upsert({
      where: {
        title_authors_venue: {
          title: pub.title,
          authors: pub.authors,
          venue: pub.venue,
        },
      },
      update: pub,
      create: pub,
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
    await prisma.course.upsert({
      where: { code: course.code },
      update: course,
      create: course,
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
    await prisma.galleryItem.upsert({
      where: { title: item.title },
      update: item,
      create: item,
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

  // Create About Us page sections
  const aboutPage = await prisma.page.findUnique({ where: { slug: 'about' } });
  console.log('About page found:', aboutPage ? 'YES' : 'NO');

  if (aboutPage) {
    const aboutSections = [
      {
        pageId: aboutPage.id,
        title: 'Lab Director',
        content: `
          <div style="display: flex; gap: 2rem; align-items: flex-start; margin-bottom: 2rem;">
            <div style="flex-shrink: 0;">
              <img src="/images/professor-lee.png" alt="Professor Hae Beom Lee" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" />
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #222; margin-bottom: 0.5rem;">Hae Beom Lee</h3>
              <p style="color: #666; margin-bottom: 1rem; font-size: 1rem;">Assistant Professor, School of Electrical Engineering, Korea University</p>
              <p style="margin-bottom: 1rem; font-size: 1rem; color: #333; line-height: 1.6;">Professor Lee leads our research group focusing on System 2 thinking and deliberate reasoning in AI systems. He brings extensive experience from his postdoctoral work at Mila (Université de Montréal) with Prof. Yoshua Bengio and at KAIST with Prof. Juho Lee.</p>
              <div style="margin-bottom: 1rem;">
                <strong>Education & Career:</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.8;">
                  <li>2021: Ph.D. in Computer Science, KAIST (advised by Prof. Sung Ju Hwang)</li>
                  <li>2021-2022: Postdoctoral Researcher, KAIST</li>
                  <li>2022-2023: Postdoctoral Researcher, Mila & Université de Montréal</li>
                  <li>2023-Present: Assistant Professor, Korea University</li>
                </ul>
              </div>
              <p>
                <a href="https://haebeom-lee.github.io/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: none;">Personal Website</a> |
                <a href="mailto:haebeomlee@korea.ac.kr" style="color: #0066cc; text-decoration: none;">Email</a>
              </p>
            </div>
          </div>
        `,
        layout: 'full-width',
        order: 1
      },
      {
        pageId: aboutPage.id,
        title: 'Our Mission',
        content: `
          <p style="margin-bottom: 1rem;">Our lab at Korea University's School of Electrical Engineering is dedicated to advancing the frontiers of artificial intelligence through innovative research in System 2 deep learning and large language model reasoning.</p>
          <p>We strive to develop AI systems that can perform complex reasoning, meta-learning, and deliberate thinking processes, bridging the gap between current machine learning capabilities and human-like cognitive abilities.</p>
        `,
        layout: 'full-width',
        order: 2
      },
      {
        pageId: aboutPage.id,
        title: 'Research Philosophy',
        content: `
          <p style="margin-bottom: 1rem;">We emphasize both theoretical understanding and practical applications of machine learning, fostering interdisciplinary collaboration to solve real-world problems through innovative research.</p>
          <p style="margin-bottom: 0.5rem;">Our approach focuses on:</p>
          <ul style="padding-left: 1.5rem; line-height: 1.8;">
            <li><strong>Theoretical Rigor:</strong> Building solid mathematical foundations for AI systems</li>
            <li><strong>Practical Impact:</strong> Developing solutions that address real-world challenges</li>
            <li><strong>Interdisciplinary Approach:</strong> Collaborating across cognitive science, neuroscience, and computer science</li>
            <li><strong>Open Research:</strong> Contributing to the global AI research community through publications and open-source projects</li>
          </ul>
        `,
        layout: 'full-width',
        order: 3
      },
      {
        pageId: aboutPage.id,
        title: 'Research Areas',
        content: JSON.stringify({
          description: 'Our research spans multiple areas at the intersection of machine learning and cognitive science:',
          cards: [
            {
              id: '1',
              title: 'Large Language Model Reasoning',
              content: 'Advancing reasoning capabilities in large language models for complex problem solving.',
              details: '<p>We develop methods to enhance the reasoning capabilities of large language models (LLMs) through systematic approaches to problem decomposition, verification, and iterative refinement.</p><p><strong>Key Research Directions:</strong></p><ul><li>Chain-of-thought prompting and reasoning strategies</li><li>Self-verification and error correction mechanisms</li><li>Multi-step problem decomposition and planning</li></ul>'
            },
            {
              id: '2',
              title: 'System 2 Deep Learning',
              content: 'Developing deliberate, slow, and logical thinking processes in neural networks.',
              details: '<p>Inspired by human cognition (Kahneman\'s System 1/System 2), we develop neural architectures that can perform deliberate, reflective reasoning rather than just fast, intuitive pattern matching.</p><p><strong>Key Research Directions:</strong></p><ul><li>Neural-symbolic integration for logical reasoning</li><li>Iterative refinement and self-correction</li><li>Explicit planning and search in neural networks</li></ul>'
            },
            {
              id: '3',
              title: 'Meta-Learning / Bi-level Optimization',
              content: 'Learning to learn: algorithms that can quickly adapt to new tasks with minimal data.',
              details: '<p>Meta-learning enables AI systems to rapidly adapt to new tasks by learning from prior experience. Our research focuses on bi-level optimization and hypergradient-based methods.</p><p><strong>Key Papers:</strong></p><ul><li>Online Hyperparameter Meta-Learning (ICLR 2022 Spotlight)</li><li>Learning to Balance (ICLR 2020 Oral)</li><li>Meta Dropout (ICLR 2020)</li></ul>'
            },
            {
              id: '4',
              title: 'AutoML / Hyperparameter Optimization',
              content: 'Automated machine learning for efficient model design and hyperparameter tuning.',
              details: '<p>We develop efficient methods for hyperparameter optimization using Bayesian optimization, freeze-thaw strategies, and cost-sensitive approaches.</p><p><strong>Key Papers:</strong></p><ul><li>Cost-Sensitive Freeze-thaw Bayesian Optimization (NeurIPS 2025)</li><li>Bayesian Neural Scaling Laws Extrapolation (ICML 2025)</li></ul>'
            },
            {
              id: '5',
              title: 'Bayesian Inference and Learning',
              content: 'Principled uncertainty quantification and probabilistic reasoning in machine learning.',
              details: '<p>We develop Bayesian methods that provide principled approaches to uncertainty quantification and decision-making under uncertainty.</p><p><strong>Key Papers:</strong></p><ul><li>DropMax: Adaptive Variational Softmax (NeurIPS 2018)</li><li>Uncertainty-Aware Attention (NeurIPS 2018)</li></ul>'
            },
            {
              id: '6',
              title: 'Generative Flow Networks (GFlowNet)',
              content: 'Novel generative models for sampling diverse high-reward candidates.',
              details: '<p>GFlowNets learn to sample objects proportionally to a reward function, enabling diverse high-reward candidate generation for scientific discovery.</p><p><strong>Key Papers:</strong></p><ul><li>Delta-AI: Local Objectives for Amortized Inference (ICLR 2024)</li></ul>'
            },
            {
              id: '7',
              title: 'Transfer / Multi-Task / Continual Learning',
              content: 'Enabling knowledge transfer across tasks and continuous learning.',
              details: '<p>We research how to transfer knowledge across tasks, learn multiple tasks simultaneously, and adapt without forgetting.</p><p><strong>Key Papers:</strong></p><ul><li>Large-Scale Meta-Learning with Continual Trajectory Shifting (ICML 2021)</li><li>MetaPerturb (NeurIPS 2020 Spotlight)</li><li>Deep Asymmetric Multi-task Feature Learning (ICML 2018)</li></ul>'
            }
          ]
        }),
        layout: 'grid',
        order: 4
      }
    ];

    for (const section of aboutSections) {
      await prisma.section.upsert({
        where: {
          page_title_order: {
            pageId: section.pageId,
            title: section.title,
            order: section.order,
          },
        },
        update: {
          content: section.content,
          layout: section.layout,
        },
        create: section,
      });
    }
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