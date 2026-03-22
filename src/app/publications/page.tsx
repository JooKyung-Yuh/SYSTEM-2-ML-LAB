import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Research publications from System 2 ML Lab - papers on meta-learning, LLM reasoning, Bayesian inference, and more.',
  alternates: { canonical: '/publications' },
  openGraph: { url: '/publications' },
};
import PublicationsClient from '@/components/PublicationsClient';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';
import styles from './publications.module.css';

export const dynamic = 'force-dynamic';

// Hardcoded fallback data (used when DB is empty)
const fallbackPublications = [
  {
    id: 'fb-1', title: "Cost-Sensitive Freeze-thaw Bayesian Optimization for Efficient Hyperparameter Tuning",
    authors: "Dong Bok Lee, Aoxuan Silvia Zhang, Byungjoo Kim, Junhyeon Park, Steven Adriaensen, Juho Lee, Sung Ju Hwang, Hae Beom Lee",
    venue: "NeurIPS", year: 2025, type: "Conference", topics: '["AutoML","Bayesian Optimization"]',
    abstract: "We propose a cost-sensitive approach to freeze-thaw Bayesian optimization that efficiently tunes hyperparameters by considering computational cost in the optimization process.",
    url: "https://arxiv.org/abs/2405.17918", pdfUrl: null, codeUrl: null, category: "conference", order: 0, published: true,
  },
  {
    id: 'fb-2', title: "Bayesian Neural Scaling Laws Extrapolation with Prior-Fitted Networks",
    authors: "Dongwoo Lee*, Dong Bok Lee*, Steven Adriaensen, Juho Lee, Sung Ju Hwang, Frank Hutter, Seon Joo Kim, Hae Beom Lee (*equal contribution)",
    venue: "ICML", year: 2025, type: "Conference", topics: '["Bayesian Inference","Neural Scaling Laws"]',
    abstract: "This work develops Bayesian methods for extrapolating neural scaling laws using prior-fitted networks to predict performance at larger scales.",
    url: "https://arxiv.org/abs/2505.23032", pdfUrl: null, codeUrl: null, category: "conference", order: 1, published: true,
  },
  {
    id: 'fb-3', title: "Delta-AI: Local Objectives for Amortized Inference in Sparse Graphical Models",
    authors: "Jean-Pierre Falet*, Hae Beom Lee*, Nikolay Malkin*, Chen Sun, Dragos Secrieru, Dinghuai Zhang, Guillaume Lajoie, Yoshua Bengio (*equal contribution)",
    venue: "ICLR", year: 2024, type: "Conference", topics: '["Bayesian Inference","GFlowNets"]',
    abstract: "We introduce Delta-AI, a method for efficient amortized inference in sparse graphical models using local objectives that scale to large networks.",
    url: "https://arxiv.org/abs/2310.02423", pdfUrl: null, codeUrl: null, category: "conference", order: 0, published: true,
  },
  {
    id: 'fb-4', title: "Online Hyperparameter Meta-Learning with Hypergradient Distillation",
    authors: "Hae Beom Lee, Hayeon Lee, Jaewoong Shin, Eunho Yang, Timothy M. Hospedales, Sung Ju Hwang",
    venue: "ICLR", year: 2022, type: "Conference (Spotlight)", topics: '["Meta-Learning","AutoML"]',
    abstract: "We propose an online meta-learning approach for hyperparameter optimization that uses hypergradient distillation to efficiently adapt to new tasks.",
    url: "https://arxiv.org/abs/2110.02508", pdfUrl: null, codeUrl: null, category: "conference", order: 0, published: true,
  },
  {
    id: 'fb-5', title: "Sequential Reptile: Inter-Task Gradient Alignment for Multilingual Learning",
    authors: "Seanie Lee*, Hae Beom Lee*, Juho Lee, Sung Ju Hwang (*equal contribution)",
    venue: "ICLR", year: 2022, type: "Conference", topics: '["Meta-Learning","Multilingual Learning"]',
    abstract: "This work extends the Reptile algorithm to sequential learning scenarios with inter-task gradient alignment for improved multilingual performance.",
    url: "https://arxiv.org/abs/2110.02600", pdfUrl: null, codeUrl: null, category: "conference", order: 1, published: true,
  },
  {
    id: 'fb-6', title: "Meta-Learning Low Rank Covariance Factors for Energy-Based Deterministic Uncertainty",
    authors: "Jeffrey Ryan Willette, Hae Beom Lee, Juho Lee, Sung Ju Hwang",
    venue: "ICLR", year: 2022, type: "Conference", topics: '["Meta-Learning","Uncertainty Estimation"]',
    abstract: "We develop a meta-learning approach for learning low-rank covariance factors in energy-based models to improve uncertainty estimation.",
    url: "https://arxiv.org/abs/2110.06381", pdfUrl: null, codeUrl: null, category: "conference", order: 2, published: true,
  },
  {
    id: 'fb-7', title: "Large-Scale Meta-Learning with Continual Trajectory Shifting",
    authors: "Jaewoong Shin*, Hae Beom Lee*, Boqing Gong, Sung Ju Hwang (*equal contribution)",
    venue: "ICML", year: 2021, type: "Conference", topics: '["Meta-Learning","Continual Learning"]',
    abstract: "We propose a continual trajectory shifting method that enables large-scale meta-learning by efficiently managing task distributions over time.",
    url: "https://arxiv.org/abs/2102.07215", pdfUrl: null, codeUrl: "https://github.com/JWoong148/ContinualTrajectoryShifting", category: "conference", order: 0, published: true,
  },
  {
    id: 'fb-8', title: "MetaPerturb: Transferable Regularizer for Heterogeneous Tasks and Architectures",
    authors: "Jeongun Ryu*, Jaewoong Shin*, Hae Beom Lee*, Sung Ju Hwang (*equal contribution)",
    venue: "NeurIPS", year: 2020, type: "Conference (Spotlight)", topics: '["Meta-Learning","Transfer Learning"]',
    abstract: "We introduce MetaPerturb, a transferable regularization method that can be applied across heterogeneous tasks and neural network architectures.",
    url: "https://papers.nips.cc/paper/2020/file/84ddfb34126fc3a48ee38d7044e87276-Paper.pdf", pdfUrl: null, codeUrl: "https://github.com/JWoong148/metaperturb", category: "conference", order: 0, published: true,
  },
  {
    id: 'fb-9', title: "Meta-Learning for Short Utterance Speaker Recognition with Imbalance Length Pairs",
    authors: "Seong Min Kye, Youngmoon Jung, Hae Beom Lee, Sung Ju Hwang, Hoirin Kim",
    venue: "Interspeech", year: 2020, type: "Conference", topics: '["Meta-Learning","Speech Recognition"]',
    abstract: "We apply meta-learning techniques to speaker recognition with short utterances, addressing the challenge of imbalanced length pairs in training data.",
    url: "https://arxiv.org/abs/2004.02863", pdfUrl: null, codeUrl: "https://github.com/seongmin-kye/meta-SR", category: "conference", order: 1, published: true,
  },
  {
    id: 'fb-10', title: "Meta Variance Transfer: Learning to Augment from the Others",
    authors: "Seong Jin Park, Seungju Han, Ji-won Baek, Insoo Kim, Juhwan Song, Hae Beom Lee, Jae-Joon Han, Sung Ju Hwang",
    venue: "ICML", year: 2020, type: "Conference", topics: '["Meta-Learning","Data Augmentation"]',
    abstract: "We propose Meta Variance Transfer, a method that learns to augment data by transferring variance information from related tasks.",
    url: "https://proceedings.icml.cc/static/paper_files/icml/2020/2222-Paper.pdf", pdfUrl: null, codeUrl: null, category: "conference", order: 2, published: true,
  },
  {
    id: 'fb-11', title: "Learning to Balance: Bayesian Meta-Learning for Imbalanced and Out-of-distribution Tasks",
    authors: "Hae Beom Lee*, Hayeon Lee*, Donghyun Na*, Saehoon Kim, Minseop Park, Eunho Yang, Sung Ju Hwang (*equal contribution)",
    venue: "ICLR", year: 2020, type: "Conference (Oral)", topics: '["Meta-Learning","Bayesian Inference","Imbalanced Learning"]',
    abstract: "We propose a Bayesian meta-learning framework that learns to balance between tasks with imbalanced class distributions and out-of-distribution samples.",
    url: "https://openreview.net/pdf?id=rkeZIJBYvr", pdfUrl: null, codeUrl: "https://github.com/haebeom-lee/l2b", category: "conference", order: 3, published: true,
  },
  {
    id: 'fb-12', title: "Meta Dropout: Learning to Perturb Latent Features for Generalization",
    authors: "Hae Beom Lee, Taewook Nam, Eunho Yang, Sung Ju Hwang",
    venue: "ICLR", year: 2020, type: "Conference", topics: '["Meta-Learning","Regularization"]',
    abstract: "We introduce Meta Dropout, a method that meta-learns optimal perturbation patterns for latent features to improve model generalization.",
    url: "https://openreview.net/pdf?id=BJgd81SYwr", pdfUrl: null, codeUrl: "https://github.com/haebeom-lee/metadrop", category: "conference", order: 4, published: true,
  },
  {
    id: 'fb-13', title: "DropMax: Adaptive Variational Softmax",
    authors: "Hae Beom Lee, Juho Lee, Saehoon Kim, Eunho Yang, Sung Ju Hwang",
    venue: "NeurIPS", year: 2018, type: "Conference", topics: '["Bayesian Inference","Deep Learning"]',
    abstract: "We propose DropMax, an adaptive variational method for softmax that improves classification by learning to drop irrelevant classes during training.",
    url: "https://arxiv.org/abs/1712.07834", pdfUrl: null, codeUrl: "https://github.com/haebeom-lee/dropmax", category: "conference", order: 0, published: true,
  },
  {
    id: 'fb-14', title: "Uncertainty-Aware Attention for Reliable Interpretation and Prediction",
    authors: "Jay Heo*, Hae Beom Lee*, Saehoon Kim, Juho Lee, Kwang Joon Kim, Eunho Yang, Sung Ju Hwang (*equal contribution)",
    venue: "NeurIPS", year: 2018, type: "Conference", topics: '["Uncertainty Estimation","Attention Mechanism"]',
    abstract: "We develop an uncertainty-aware attention mechanism that provides reliable interpretations while maintaining prediction accuracy.",
    url: "https://arxiv.org/abs/1805.09653", pdfUrl: null, codeUrl: "https://github.com/jayheo/UA", category: "conference", order: 1, published: true,
  },
  {
    id: 'fb-15', title: "Deep Asymmetric Multi-task Feature Learning",
    authors: "Hae Beom Lee, Eunho Yang, Sung Ju Hwang",
    venue: "ICML", year: 2018, type: "Conference", topics: '["Multi-Task Learning","Deep Learning"]',
    abstract: "We propose an asymmetric multi-task learning framework that allows flexible knowledge sharing between tasks with different complexities.",
    url: "https://arxiv.org/abs/1708.00260", pdfUrl: null, codeUrl: "https://github.com/haebeom-lee/amtfl", category: "conference", order: 2, published: true,
  },
  {
    id: 'fb-16', title: "Dataset Condensation with Latent Space Knowledge Factorization and Sharing",
    authors: "Hae Beom Lee*, Dong Bok Lee*, Sung Ju Hwang (*equal contribution)",
    venue: "arXiv", year: 2022, type: "Preprint", topics: '["Meta-Learning","Data Augmentation"]',
    abstract: "We propose a dataset condensation method that factorizes and shares knowledge in latent space for efficient dataset distillation.",
    url: "https://arxiv.org/abs/2208.10494", pdfUrl: null, codeUrl: null, category: "preprint", order: 10, published: true,
  },
  {
    id: 'fb-17', title: "Meta-Learned Confidence for Few-shot Learning",
    authors: "Sung Min Kye, Hae Beom Lee, Hoirin Kim, Sung Ju Hwang",
    venue: "arXiv", year: 2020, type: "Preprint", topics: '["Meta-Learning","Few-Shot Learning"]',
    abstract: "We propose a meta-learning approach that learns to generate confidence scores for few-shot learning predictions, improving reliability and calibration.",
    url: "https://arxiv.org/abs/2002.12017", pdfUrl: null, codeUrl: "https://github.com/seongmin-kye/MCT", category: "preprint", order: 11, published: true,
  },
  {
    id: 'fb-18', title: "Adaptive Network Sparsification with Dependent Variational Beta-Bernoulli Dropout",
    authors: "Juho Lee, Saehoon Kim, Jaehong Yoon, Hae Beom Lee, Eunho Yang, Sung Ju Hwang",
    venue: "arXiv", year: 2018, type: "Preprint", topics: '["Bayesian Inference","Network Pruning"]',
    abstract: "We introduce a dependent variational Beta-Bernoulli dropout method for adaptive network sparsification that learns structured sparsity patterns.",
    url: "https://arxiv.org/abs/1805.10896", pdfUrl: null, codeUrl: "https://github.com/OpenXAIProject/Variational_Dropouts", category: "preprint", order: 12, published: true,
  },
];

export default async function PublicationsPage() {
  let publications;

  try {
    const dbPubs = await prisma.publication.findMany({
      where: { published: true },
      orderBy: [{ year: 'desc' }, { order: 'asc' }],
    });
    publications = dbPubs.length > 0 ? dbPubs : fallbackPublications;
  } catch {
    publications = fallbackPublications;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PublicationsClient publications={publications} />
        <JoinUs />
      </div>
      <Footer />
    </div>
  );
}
