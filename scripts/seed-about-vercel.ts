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
            details: '<p>We investigate how large language models can perform sophisticated reasoning tasks beyond simple pattern matching. Our research focuses on:</p><ul><li>Multi-step reasoning and chain-of-thought prompting</li><li>Compositional generalization in language models</li><li>Reasoning over structured knowledge</li><li>Verification and self-correction mechanisms</li></ul><p><strong>Recent Projects:</strong> Developing frameworks for systematic reasoning evaluation, improving mathematical problem-solving capabilities, and exploring reasoning in multi-modal contexts.</p>',
          },
          {
            id: 'area-2',
            title: 'System 2 Deep Learning',
            content: 'Developing deliberate, slow, and logical thinking processes in neural networks.',
            details: '<p>Inspired by Daniel Kahneman\'s dual-process theory, we develop AI systems that can engage in deliberate, analytical reasoning. This involves:</p><ul><li>Computational models of dual-process cognition</li><li>Slow, deliberate reasoning architectures</li><li>Integration of symbolic and neural approaches</li><li>Metacognitive control mechanisms</li></ul><p><strong>Key Focus:</strong> Moving beyond fast, intuitive responses to enable AI systems that can pause, reflect, and systematically work through complex problems.</p>',
          },
          {
            id: 'area-3',
            title: 'Meta-Learning',
            content: 'Learning to learn: algorithms that can quickly adapt to new tasks and domains.',
            details: '<p>Our meta-learning research focuses on developing algorithms that can efficiently learn from limited data and adapt to new tasks. Key research directions include:</p><ul><li><strong>Online Hyperparameter Meta-Learning:</strong> Hypergradient distillation for efficient hyperparameter optimization</li><li><strong>Large-Scale Meta-Learning:</strong> Continual trajectory shifting for scalable adaptation</li><li><strong>Bayesian Meta-Learning:</strong> Learning to balance imbalanced and out-of-distribution tasks</li><li><strong>Bi-level Optimization:</strong> Gradient-based approaches for meta-learning</li></ul><p><strong>Impact:</strong> Our work has been published at top-tier venues (ICLR, ICML) and enables rapid adaptation with minimal data, multilingual learning, and handling of distribution shifts.</p>',
          },
          {
            id: 'area-4',
            title: 'AutoML',
            content: 'Automated machine learning for efficient model design and hyperparameter optimization.',
            details: '<p>We develop automated methods for machine learning pipeline design and optimization, including:</p><ul><li>Neural architecture search (NAS)</li><li>Hyperparameter optimization</li><li>Automated feature engineering</li><li>Efficient model selection</li></ul><p><strong>Goal:</strong> Democratizing machine learning by reducing the need for manual tuning and expert knowledge, while improving model performance and efficiency.</p>',
          },
          {
            id: 'area-5',
            title: 'Bayesian Inference',
            content: 'Principled uncertainty quantification and probabilistic reasoning in machine learning.',
            details: '<p>We develop novel Bayesian approaches for uncertainty estimation and robust learning. Our research includes:</p><ul><li><strong>Adaptive Variational Methods:</strong> DropMax for adaptive variational softmax and improved uncertainty estimates</li><li><strong>Meta Dropout:</strong> Learning to perturb latent features for better generalization</li><li><strong>Uncertainty-Aware Attention:</strong> Reliable interpretation and prediction through attention mechanisms</li><li><strong>Bayesian Meta-Learning:</strong> Combining Bayesian inference with meta-learning for few-shot tasks</li></ul><p><strong>Applications:</strong> Our methods (published at NeurIPS, ICLR) enable models to express calibrated confidence, handle out-of-distribution data, and make reliable decisions under uncertainty.</p>',
          },
          {
            id: 'area-6',
            title: 'Generative Flow Networks',
            content: 'Novel generative models for sampling from complex probability distributions.',
            details: '<p>GFlowNets (Generative Flow Networks) are a new class of generative models that learn to sample from complex distributions. Our work focuses on:</p><ul><li>Training algorithms for GFlowNets</li><li>Applications to molecular design and drug discovery</li><li>Combinatorial optimization</li><li>Connection to reinforcement learning</li></ul><p><strong>Innovation:</strong> Bridging energy-based models, reinforcement learning, and generative modeling to enable diverse, high-quality sampling from complex structured spaces.</p>',
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
