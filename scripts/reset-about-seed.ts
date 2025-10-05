import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAboutPage() {
  try {
    console.log('🔄 Resetting About Us page with Vercel version data...\n');

    // Find existing about page
    const aboutPage = await prisma.page.findFirst({
      where: { slug: 'about' },
      include: { sections: true }
    });

    if (aboutPage) {
      console.log(`📄 Found existing About page with ${aboutPage.sections.length} sections`);
      
      // Delete all existing sections
      console.log('🗑️  Deleting existing sections...');
      await prisma.section.deleteMany({
        where: { pageId: aboutPage.id }
      });
      console.log('✅ Sections deleted');

      // Create new sections based on Vercel version
      console.log('📝 Creating new sections...');
      await prisma.section.createMany({
        data: [
          {
            pageId: aboutPage.id,
            title: 'Lab Director',
            content: `Hae Beom Lee
Assistant Professor, School of Electrical Engineering, Korea University

Professor Lee leads our research group focusing on System 2 thinking and deliberate reasoning in AI systems. He brings extensive experience from his postdoctoral work at Mila (Université de Montréal) with Prof. Yoshua Bengio and at KAIST with Prof. Juho Lee.

Education & Career:
• 2021: Ph.D. in Computer Science, KAIST (advised by Prof. Sung Ju Hwang)
• 2021-2022: Postdoctoral Researcher, KAIST
• 2022-2023: Postdoctoral Researcher, Mila & Université de Montréal
• 2023-Present: Assistant Professor, Korea University

Personal Website: https://haebeom-lee.github.io/
Email: haebeomlee@korea.ac.kr`,
            order: 0
          },
          {
            pageId: aboutPage.id,
            title: 'Our Mission',
            content: `Our lab at Korea University's School of Electrical Engineering is dedicated to advancing the frontiers of artificial intelligence through innovative research in System 2 deep learning and large language model reasoning.

We strive to develop AI systems that can perform complex reasoning, meta-learning, and deliberate thinking processes, bridging the gap between current machine learning capabilities and human-like cognitive abilities.`,
            order: 1
          },
          {
            pageId: aboutPage.id,
            title: 'Research Philosophy',
            content: `We emphasize both theoretical understanding and practical applications of machine learning, fostering interdisciplinary collaboration to solve real-world problems through innovative research.

Our approach focuses on:
• Theoretical Rigor: Building solid mathematical foundations for AI systems
• Practical Impact: Developing solutions that address real-world challenges
• Interdisciplinary Approach: Collaborating across cognitive science, neuroscience, and computer science
• Open Research: Contributing to the global AI research community through publications and open-source projects`,
            order: 2
          },
          {
            pageId: aboutPage.id,
            title: 'Research Areas',
            content: `Our research spans multiple areas at the intersection of machine learning and cognitive science:

Large Language Model Reasoning: Advancing reasoning capabilities in large language models for complex problem solving.

System 2 Deep Learning: Developing deliberate, slow, and logical thinking processes in neural networks.

Meta-Learning: Learning to learn - algorithms that can quickly adapt to new tasks and domains.

AutoML: Automated machine learning for efficient model design and hyperparameter optimization.

Bayesian Inference: Principled uncertainty quantification and probabilistic reasoning in machine learning.

Generative Flow Networks: Novel generative models for sampling from complex probability distributions.`,
            order: 3
          }
        ]
      });

      console.log('✅ Created 4 new sections based on Vercel version');

      // Verify
      const updated = await prisma.page.findFirst({
        where: { slug: 'about' },
        include: { sections: { orderBy: { order: 'asc' } } }
      });

      console.log('\n📊 Updated About page:');
      updated?.sections.forEach((section, idx) => {
        console.log(`  ${idx + 1}. ${section.title} (order: ${section.order})`);
      });

      console.log('\n✅ Reset completed successfully!');
    } else {
      console.log('❌ About page not found. Run seed-about.ts first.');
    }
  } catch (error) {
    console.error('❌ Error resetting about page:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetAboutPage();
