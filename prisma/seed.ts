import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // ========== Site Settings ==========
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', showNewsCarousel: false, showRecruitmentBanner: true },
  });

  // ========== Admin User ==========
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mllab.korea.ac.kr';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: { email: adminEmail, password: hashedPassword, role: 'admin' },
  });
  console.log(`Admin user: ${adminEmail}`);

  // ========== News Items ==========
  const newsItems = [
    { date: 'September 24, 2025', title: 'Paper accepted at TMLR', description: 'One paper accepted at TMLR2025', links: [{ text: 'link', url: 'https://arxiv.org/abs/2408.16218' }], order: 1 },
    { date: 'September 19, 2025', title: 'Three papers accepted at NeurIPS', description: 'Three papers (one as an oral) accepted at NeurIPS2025', links: [{ text: '1', url: 'https://arxiv.org/abs/2505.23416' }, { text: '2', url: 'https://arxiv.org/abs/2410.02992' }, { text: '3', url: 'https://arxiv.org/abs/2509.20214' }], order: 2 },
    { date: 'August 1, 2025', title: 'Scholarship Award', description: 'Jinuk Kim was selected as a recipient of Yulchon AI Star Scholarship', links: [], order: 3 },
    { date: 'June 9, 2025', title: 'Presidential Science Scholarship', description: 'Jinuk Kim was selected as a recipient of Presidential Science Scholarship for Graduate Students (full M.S./Ph.D.)', links: [], order: 4 },
    { date: 'May 13, 2025', title: 'Paper accepted at ICML', description: 'One paper accepted at ICML2025', links: [{ text: 'link', url: 'https://arxiv.org/abs/2505.07004' }], order: 5 },
    { date: 'May 1, 2024', title: 'Two papers accepted at ICML', description: 'Two papers accepted at ICML2024', links: [{ text: '1', url: 'https://arxiv.org/abs/2406.12837' }, { text: '2', url: 'https://arxiv.org/abs/2406.14876' }], order: 6 },
    { date: 'January 17, 2024', title: 'Paper accepted at ICLR', description: 'One paper accepted at ICLR2024', links: [{ text: 'link', url: 'https://arxiv.org/abs/2312.03414' }], order: 7 },
    { date: 'September 22, 2023', title: 'Three papers accepted at NeurIPS', description: 'Three papers accepted at NeurIPS2023', links: [{ text: '1', url: 'https://arxiv.org/abs/2301.12842' }, { text: '2', url: 'https://arxiv.org/abs/2301.12321' }, { text: '3', url: 'https://arxiv.org/abs/2307.03486' }], order: 8 },
  ];

  for (const item of newsItems) {
    const existing = await prisma.newsItem.findUnique({
      where: { title_date: { title: item.title, date: item.date } },
      include: { links: true },
    });
    if (existing) {
      await prisma.newsLink.deleteMany({ where: { newsItemId: existing.id } });
      await prisma.newsItem.update({
        where: { id: existing.id },
        data: { description: item.description, order: item.order, links: { create: item.links } },
      });
    } else {
      await prisma.newsItem.create({
        data: { date: item.date, title: item.title, description: item.description, order: item.order, links: { create: item.links } },
      });
    }
  }
  console.log(`News: ${newsItems.length} items`);

  // ========== People ==========
  const people = [
    {
      name: 'Hae Beom Lee',
      title: 'Assistant Professor, School of Electrical Engineering at Korea University',
      email: 'haebeomlee@korea.ac.kr',
      website: 'https://haebeom-lee.github.io/',
      image: 'https://haebeom-lee.github.io/images/lee2.png',
      bio: 'Dr. Hae Beom Lee is an Assistant Professor in the School of Electrical Engineering at Korea University. His research focuses on Large Language Model Reasoning, System 2 Deep Learning, Meta-Learning, AutoML/Hyperparameter Optimization, Bayesian Inference, and Generative Flow Networks (GFlowNet). Prior to joining Korea University, he served as a postdoctoral researcher at KAIST under Prof. Juho Lee, and at Mila & Universit\u00e9 de Montr\u00e9al under Prof. Yoshua Bengio. He received his Ph.D. from KAIST under Prof. Sung Ju Hwang.',
      category: 'faculty', order: 1, published: true,
    },
  ];

  for (const person of people) {
    await prisma.person.upsert({
      where: { email: person.email! },
      update: person,
      create: person,
    });
  }
  console.log(`People: ${people.length}`);

  // ========== Publications (real data from haebeom-lee.github.io) ==========
  const publications = [
    // 2025
    { title: 'Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning', authors: 'Dong Bok Lee, Aoxuan Silvia Zhang, Byungjoo Kim, Junhyeon Park, Steven Adriaensen, Juho Lee, Sung Ju Hwang, Hae Beom Lee', venue: 'NeurIPS', year: 2025, type: 'Conference', topics: '["AutoML","Bayesian Optimization"]', abstract: 'We propose a cost-sensitive approach to freeze-thaw Bayesian optimization that efficiently tunes hyperparameters by considering computational cost in the optimization process.', url: 'https://arxiv.org/abs/2405.17918', codeUrl: null, category: 'conference', order: 1 },
    { title: 'Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks', authors: 'Dongwoo Lee*, Dong Bok Lee*, Steven Adriaensen, Juho Lee, Sung Ju Hwang, Frank Hutter, Seon Joo Kim, Hae Beom Lee (*equal contribution)', venue: 'ICML', year: 2025, type: 'Conference', topics: '["Bayesian Inference","Neural Scaling Laws"]', abstract: 'This work develops Bayesian methods for extrapolating neural scaling laws using prior-fitted networks to predict performance at larger scales.', url: 'https://arxiv.org/abs/2505.23032', codeUrl: null, category: 'conference', order: 2 },
    // 2024
    { title: 'Delta-AI: Local Objectives for Amortized Inference in Sparse Graphical Models', authors: 'Jean-Pierre Falet*, Hae Beom Lee*, Nikolay Malkin*, Chen Sun, Dragos Secrieru, Dinghuai Zhang, Guillaume Lajoie, Yoshua Bengio (*equal contribution)', venue: 'ICLR', year: 2024, type: 'Conference', topics: '["Bayesian Inference","GFlowNets"]', abstract: 'We introduce Delta-AI, a method for efficient amortized inference in sparse graphical models using local objectives that scale to large networks.', url: 'https://arxiv.org/abs/2310.02423', codeUrl: null, category: 'conference', order: 3 },
    // 2022
    { title: 'Online Hyperparameter Meta-Learning with Hypergradient Distillation', authors: 'Hae Beom Lee, Hayeon Lee, Jaewoong Shin, Eunho Yang, Timothy M. Hospedales, Sung Ju Hwang', venue: 'ICLR', year: 2022, type: 'Conference (Spotlight)', topics: '["Meta-Learning","AutoML"]', abstract: 'We propose an online meta-learning approach for hyperparameter optimization that uses hypergradient distillation to efficiently adapt to new tasks.', url: 'https://arxiv.org/abs/2110.02508', codeUrl: null, category: 'conference', order: 4 },
    { title: 'Sequential Reptile: Inter-Task Gradient Alignment for Multilingual Learning', authors: 'Seanie Lee*, Hae Beom Lee*, Juho Lee, Sung Ju Hwang (*equal contribution)', venue: 'ICLR', year: 2022, type: 'Conference', topics: '["Meta-Learning","Multilingual Learning"]', abstract: 'This work extends the Reptile algorithm to sequential learning scenarios with inter-task gradient alignment for improved multilingual performance.', url: 'https://arxiv.org/abs/2110.02600', codeUrl: null, category: 'conference', order: 5 },
    { title: 'Meta-Learning Low Rank Covariance Factors for Energy-Based Deterministic Uncertainty', authors: 'Jeffrey Ryan Willette, Hae Beom Lee, Juho Lee, Sung Ju Hwang', venue: 'ICLR', year: 2022, type: 'Conference', topics: '["Meta-Learning","Uncertainty Estimation"]', abstract: 'We develop a meta-learning approach for learning low-rank covariance factors in energy-based models to improve uncertainty estimation.', url: 'https://arxiv.org/abs/2110.06381', codeUrl: null, category: 'conference', order: 6 },
    // 2021
    { title: 'Large-Scale Meta-Learning with Continual Trajectory Shifting', authors: 'Jaewoong Shin*, Hae Beom Lee*, Boqing Gong, Sung Ju Hwang (*equal contribution)', venue: 'ICML', year: 2021, type: 'Conference', topics: '["Meta-Learning","Continual Learning"]', abstract: 'We propose a continual trajectory shifting method that enables large-scale meta-learning by efficiently managing task distributions over time.', url: 'https://arxiv.org/abs/2102.07215', codeUrl: 'https://github.com/JWoong148/ContinualTrajectoryShifting', category: 'conference', order: 7 },
    // 2020
    { title: 'MetaPerturb: Transferable Regularizer for Heterogeneous Tasks and Architectures', authors: 'Jeongun Ryu*, Jaewoong Shin*, Hae Beom Lee*, Sung Ju Hwang (*equal contribution)', venue: 'NeurIPS', year: 2020, type: 'Conference (Spotlight)', topics: '["Meta-Learning","Transfer Learning"]', abstract: 'We introduce MetaPerturb, a transferable regularization method that can be applied across heterogeneous tasks and neural network architectures.', url: 'https://papers.nips.cc/paper/2020/file/84ddfb34126fc3a48ee38d7044e87276-Paper.pdf', codeUrl: 'https://github.com/JWoong148/metaperturb', category: 'conference', order: 8 },
    { title: 'Meta-Learning for Short Utterance Speaker Recognition with Imbalance Length Pairs', authors: 'Seong Min Kye, Youngmoon Jung, Hae Beom Lee, Sung Ju Hwang, Hoirin Kim', venue: 'Interspeech', year: 2020, type: 'Conference', topics: '["Meta-Learning","Speech Recognition"]', abstract: 'We apply meta-learning techniques to speaker recognition with short utterances, addressing the challenge of imbalanced length pairs in training data.', url: 'https://arxiv.org/abs/2004.02863', codeUrl: 'https://github.com/seongmin-kye/meta-SR', category: 'conference', order: 9 },
    { title: 'Meta Variance Transfer: Learning to Augment from the Others', authors: 'Seong Jin Park, Seungju Han, Ji-won Baek, Insoo Kim, Juhwan Song, Hae Beom Lee, Jae-Joon Han, Sung Ju Hwang', venue: 'ICML', year: 2020, type: 'Conference', topics: '["Meta-Learning","Data Augmentation"]', abstract: 'We propose Meta Variance Transfer, a method that learns to augment data by transferring variance information from related tasks.', url: 'https://proceedings.icml.cc/static/paper_files/icml/2020/2222-Paper.pdf', codeUrl: null, category: 'conference', order: 10 },
    { title: 'Learning to Balance: Bayesian Meta-Learning for Imbalanced and Out-of-distribution Tasks', authors: 'Hae Beom Lee*, Hayeon Lee*, Donghyun Na*, Saehoon Kim, Minseop Park, Eunho Yang, Sung Ju Hwang (*equal contribution)', venue: 'ICLR', year: 2020, type: 'Conference (Oral)', topics: '["Meta-Learning","Bayesian Inference","Imbalanced Learning"]', abstract: 'We propose a Bayesian meta-learning framework that learns to balance between tasks with imbalanced class distributions and out-of-distribution samples.', url: 'https://openreview.net/pdf?id=rkeZIJBYvr', codeUrl: 'https://github.com/haebeom-lee/l2b', category: 'conference', order: 11 },
    { title: 'Meta Dropout: Learning to Perturb Latent Features for Generalization', authors: 'Hae Beom Lee, Taewook Nam, Eunho Yang, Sung Ju Hwang', venue: 'ICLR', year: 2020, type: 'Conference', topics: '["Meta-Learning","Regularization"]', abstract: 'We introduce Meta Dropout, a method that meta-learns optimal perturbation patterns for latent features to improve model generalization.', url: 'https://openreview.net/pdf?id=BJgd81SYwr', codeUrl: 'https://github.com/haebeom-lee/metadrop', category: 'conference', order: 12 },
    // 2018
    { title: 'DropMax: Adaptive Variational Softmax', authors: 'Hae Beom Lee, Juho Lee, Saehoon Kim, Eunho Yang, Sung Ju Hwang', venue: 'NeurIPS', year: 2018, type: 'Conference', topics: '["Bayesian Inference","Deep Learning"]', abstract: 'We propose DropMax, an adaptive variational method for softmax that improves classification by learning to drop irrelevant classes during training.', url: 'https://arxiv.org/abs/1712.07834', codeUrl: 'https://github.com/haebeom-lee/dropmax', category: 'conference', order: 13 },
    { title: 'Uncertainty-Aware Attention for Reliable Interpretation and Prediction', authors: 'Jay Heo*, Hae Beom Lee*, Saehoon Kim, Juho Lee, Kwang Joon Kim, Eunho Yang, Sung Ju Hwang (*equal contribution)', venue: 'NeurIPS', year: 2018, type: 'Conference', topics: '["Uncertainty Estimation","Attention Mechanism"]', abstract: 'We develop an uncertainty-aware attention mechanism that provides reliable interpretations while maintaining prediction accuracy.', url: 'https://arxiv.org/abs/1805.09653', codeUrl: 'https://github.com/jayheo/UA', category: 'conference', order: 14 },
    { title: 'Deep Asymmetric Multi-task Feature Learning', authors: 'Hae Beom Lee, Eunho Yang, Sung Ju Hwang', venue: 'ICML', year: 2018, type: 'Conference', topics: '["Multi-Task Learning","Deep Learning"]', abstract: 'We propose an asymmetric multi-task learning framework that allows flexible knowledge sharing between tasks with different complexities.', url: 'https://arxiv.org/abs/1708.00260', codeUrl: 'https://github.com/haebeom-lee/amtfl', category: 'conference', order: 15 },
    // Preprints
    { title: 'Dataset Condensation with Latent Space Knowledge Factorization and Sharing', authors: 'Hae Beom Lee*, Dong Bok Lee*, Sung Ju Hwang (*equal contribution)', venue: 'arXiv', year: 2022, type: 'Preprint', topics: '["Meta-Learning","Data Augmentation"]', abstract: 'We propose a dataset condensation method that factorizes and shares knowledge in latent space for efficient dataset distillation.', url: 'https://arxiv.org/abs/2208.10494', codeUrl: null, category: 'preprint', order: 16 },
    { title: 'Meta-Learned Confidence for Few-shot Learning', authors: 'Sung Min Kye, Hae Beom Lee, Hoirin Kim, Sung Ju Hwang', venue: 'arXiv', year: 2020, type: 'Preprint', topics: '["Meta-Learning","Few-Shot Learning"]', abstract: 'We propose a meta-learning approach that learns to generate confidence scores for few-shot learning predictions.', url: 'https://arxiv.org/abs/2002.12017', codeUrl: 'https://github.com/seongmin-kye/MCT', category: 'preprint', order: 17 },
    { title: 'Adaptive Network Sparsification with Dependent Variational Beta-Bernoulli Dropout', authors: 'Juho Lee, Saehoon Kim, Jaehong Yoon, Hae Beom Lee, Eunho Yang, Sung Ju Hwang', venue: 'arXiv', year: 2018, type: 'Preprint', topics: '["Bayesian Inference","Network Pruning"]', abstract: 'We introduce a dependent variational Beta-Bernoulli dropout method for adaptive network sparsification.', url: 'https://arxiv.org/abs/1805.10896', codeUrl: 'https://github.com/OpenXAIProject/Variational_Dropouts', category: 'preprint', order: 18 },
  ];

  for (const pub of publications) {
    await prisma.publication.upsert({
      where: { title_authors_venue: { title: pub.title, authors: pub.authors, venue: pub.venue } },
      update: { ...pub, published: true },
      create: { ...pub, published: true },
    });
  }
  console.log(`Publications: ${publications.length}`);

  // ========== Courses: skip, add via admin panel ==========
  console.log('Courses: skipped (add via admin panel)');

  // ========== Gallery: skip fake data, leave empty for admin to fill ==========
  console.log('Gallery: skipped (add real photos via admin panel)');

  // ========== Pages ==========
  const pages = [
    { slug: 'about', title: 'About Us', content: 'About the System 2 ML Lab at Korea University' },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  // ========== About Sections ==========
  const aboutPage = await prisma.page.findUnique({ where: { slug: 'about' } });
  if (aboutPage) {
    const aboutSections = [
      {
        pageId: aboutPage.id, title: 'Lab Director', layout: 'full-width', order: 1,
        content: '<div style="display: flex; gap: 2rem; align-items: flex-start; margin-bottom: 2rem;"><div style="flex-shrink: 0;"><img src="/images/professor-lee.png" alt="Professor Hae Beom Lee" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" /></div><div style="flex: 1;"><h3 style="font-size: 1.25rem; font-weight: 700; color: #222; margin-bottom: 0.5rem;">Hae Beom Lee</h3><p style="color: #666; margin-bottom: 1rem;">Assistant Professor, School of Electrical Engineering, Korea University</p><p style="margin-bottom: 1rem; color: #333; line-height: 1.6;">Professor Lee leads our research group focusing on System 2 thinking and deliberate reasoning in AI systems. He brings extensive experience from his postdoctoral work at Mila (Universit\u00e9 de Montr\u00e9al) with Prof. Yoshua Bengio and at KAIST with Prof. Juho Lee.</p><div style="margin-bottom: 1rem;"><strong>Education &amp; Career:</strong><ul style="margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.8;"><li>2021: Ph.D. in Computer Science, KAIST (advised by Prof. Sung Ju Hwang)</li><li>2021-2022: Postdoctoral Researcher, KAIST (with Prof. Juho Lee)</li><li>2022-2023: Postdoctoral Researcher, Mila &amp; Universit\u00e9 de Montr\u00e9al (with Prof. Yoshua Bengio)</li><li>2023-Present: Assistant Professor, Korea University</li></ul></div><div style="margin-bottom: 1rem;"><strong>Awards &amp; Honors:</strong><ul style="margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.8;"><li>Google Ph.D. Fellowship Program (2021)</li><li>Global Ph.D. Fellowship Program (2019-2021)</li><li>Outstanding Reviewer, ICML 2022 (Top 10%)</li><li>Outstanding Reviewer, ICML 2020 (Top 33%)</li></ul></div><p><a href="https://haebeom-lee.github.io/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Personal Website</a> | <a href="mailto:haebeomlee@korea.ac.kr" style="color: #0066cc;">Email</a></p></div></div>',
      },
      {
        pageId: aboutPage.id, title: 'Our Mission', layout: 'full-width', order: 2,
        content: '<p style="margin-bottom: 1rem;">Our lab at Korea University\'s School of Electrical Engineering is dedicated to advancing the frontiers of artificial intelligence through innovative research in System 2 deep learning and large language model reasoning.</p><p>We strive to develop AI systems that can perform complex reasoning, meta-learning, and deliberate thinking processes, bridging the gap between current machine learning capabilities and human-like cognitive abilities.</p>',
      },
      {
        pageId: aboutPage.id, title: 'Research Philosophy', layout: 'full-width', order: 3,
        content: '<p style="margin-bottom: 1rem;">We emphasize both theoretical understanding and practical applications of machine learning, fostering interdisciplinary collaboration to solve real-world problems through innovative research.</p><p style="margin-bottom: 0.5rem;">Our approach focuses on:</p><ul style="padding-left: 1.5rem; line-height: 1.8;"><li><strong>Theoretical Rigor:</strong> Building solid mathematical foundations for AI systems</li><li><strong>Practical Impact:</strong> Developing solutions that address real-world challenges</li><li><strong>Interdisciplinary Approach:</strong> Collaborating across cognitive science, neuroscience, and computer science</li><li><strong>Open Research:</strong> Contributing to the global AI research community through publications and open-source projects</li></ul>',
      },
      {
        pageId: aboutPage.id, title: 'Research Areas', layout: 'grid', order: 4,
        content: JSON.stringify({
          description: 'Our research spans multiple areas at the intersection of machine learning and cognitive science:',
          cards: [
            { id: '1', title: 'Large Language Model Reasoning', content: 'Advancing reasoning capabilities in large language models for complex problem solving.' },
            { id: '2', title: 'System 2 Deep Learning', content: 'Developing deliberate, slow, and logical thinking processes in neural networks.' },
            { id: '3', title: 'Meta-Learning / Bi-level Optimization', content: 'Learning to learn: algorithms that can quickly adapt to new tasks with minimal data.' },
            { id: '4', title: 'AutoML / Hyperparameter Optimization', content: 'Automated machine learning for efficient model design and hyperparameter tuning.' },
            { id: '5', title: 'Bayesian Inference and Learning', content: 'Principled uncertainty quantification and probabilistic reasoning in machine learning.' },
            { id: '6', title: 'Generative Flow Networks (GFlowNet)', content: 'Novel generative models for sampling diverse high-reward candidates.' },
            { id: '7', title: 'Transfer / Multi-Task / Continual Learning', content: 'Knowledge transfer across tasks and domains, learning multiple tasks jointly.' },
          ],
        }),
      },
    ];

    for (const section of aboutSections) {
      await prisma.section.upsert({
        where: { page_title_order: { pageId: section.pageId, title: section.title, order: section.order } },
        update: { content: section.content, layout: section.layout },
        create: section,
      });
    }
    console.log('About sections: updated');
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
