import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAboutPage() {
  try {
    // Check if about page exists
    let aboutPage = await prisma.page.findFirst({
      where: { slug: 'about' },
      include: { sections: true }
    });

    if (!aboutPage) {
      console.log('Creating About Us page...');
      aboutPage = await prisma.page.create({
        data: {
          slug: 'about',
          title: 'About Us',
          content: 'About the ML Lab at Korea University',
          published: true,
          sections: {
            create: [
              {
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
                title: 'Our Mission',
                content: `Our lab at Korea University's School of Electrical Engineering is dedicated to advancing the frontiers of artificial intelligence through innovative research in System 2 deep learning and large language model reasoning.

We strive to develop AI systems that can perform complex reasoning, meta-learning, and deliberate thinking processes, bridging the gap between current machine learning capabilities and human-like cognitive abilities.`,
                order: 1
              },
              {
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
          }
        },
        include: { sections: true }
      });
      console.log('✅ About Us page created with 4 sections');
    } else {
      console.log('✅ About Us page already exists');
      console.log(`   - ${aboutPage.sections.length} sections found`);
    }

    return aboutPage;
  } catch (error) {
    console.error('❌ Error seeding about page:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAboutPage()
  .then(() => {
    console.log('✅ Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
