/**
 * Site configuration - centralized place for all site URLs and settings
 * 도메인 변경 시 환경변수만 수정하면 모든 곳에 반영됩니다
 */

export const siteConfig = {
  // Base URL - 도메인 변경 시 .env의 NEXT_PUBLIC_SITE_URL만 수정하세요
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://system2mllab.vercel.app',

  // Site name
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'System 2 ML Lab at Korea University',

  // Short name for mobile/PWA
  shortName: 'System 2 ML Lab',

  // Site description
  description: 'Korea University System 2 Machine Learning Lab. Research in System 2 deep learning, large language model reasoning, meta-learning, and Bayesian inference. Led by Prof. Hae Beom Lee.',

  // Keywords for SEO
  keywords: [
    'machine learning',
    'deep learning',
    'artificial intelligence',
    'System 2 reasoning',
    'large language models',
    'LLM',
    'meta-learning',
    'Bayesian inference',
    'AutoML',
    'generative flow networks',
    'Korea University',
    'AI research',
    'Hae Beom Lee',
    '머신러닝',
    '딥러닝',
    '인공지능',
    '고려대학교',
    'neural networks',
    'AI lab',
  ],

  // Images
  images: {
    ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || '/images/og-image.jpg',
    twitterImage: process.env.NEXT_PUBLIC_TWITTER_IMAGE || '/images/twitter-image.jpg',
    logo: process.env.NEXT_PUBLIC_LOGO_IMAGE || '/images/logo.png',
    icon192: '/images/icon-192.png',
    icon512: '/images/icon-512.png',
  },

  // Social media
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@KoreaUniv',
  },

  // Contact
  contact: {
    email: 'haebeomlee@korea.ac.kr',
    phone: null,
  },

  // Address
  address: {
    street: '145 Anam-ro, Engineering Hall',
    city: 'Seoul',
    region: 'Seongbuk-gu',
    postalCode: '02841',
    country: 'KR',
    studentLab: 'Engineering Hall 238',
    professorOffice: 'Engineering Hall 501',
  },

  // Organization info
  organization: {
    name: 'System 2 ML Lab',
    fullName: 'System 2 Machine Learning Laboratory',
    affiliation: 'Korea University',
    department: 'School of Electrical Engineering',
    director: {
      name: 'Hae Beom Lee',
      title: 'Assistant Professor',
      url: 'https://haebeom-lee.github.io/',
      email: 'haebeomlee@korea.ac.kr',
    },
  },

  // Theme colors
  theme: {
    primary: '#0066cc',
    background: '#ffffff',
  },

  // SEO verification codes
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
  },

  // Analytics
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  },
};

// Helper functions
export function getAbsoluteUrl(path: string = ''): string {
  return `${siteConfig.url}${path}`;
}

export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return getAbsoluteUrl(imagePath);
}

export function getCanonicalUrl(path: string = ''): string {
  // Remove trailing slash for consistency
  const cleanPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return getAbsoluteUrl(cleanPath);
}
