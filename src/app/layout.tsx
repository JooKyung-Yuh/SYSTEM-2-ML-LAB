import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mllab.korea.ac.kr'),
  title: {
    default: 'System 2 ML Lab at Korea University | AI Research',
    template: '%s | System 2 ML Lab'
  },
  description: 'Korea University System 2 Machine Learning Lab. Research in System 2 deep learning, large language model reasoning, meta-learning, and Bayesian inference. Led by Prof. Hae Beom Lee.',
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
  authors: [{ name: 'Hae Beom Lee', url: 'https://haebeom-lee.github.io/' }],
  creator: 'System 2 ML Lab',
  publisher: 'Korea University',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR'],
    url: 'https://mllab.korea.ac.kr',
    siteName: 'System 2 ML Lab at Korea University',
    title: 'System 2 ML Lab | AI Research at Korea University',
    description: 'Leading research in System 2 deep learning, LLM reasoning, and meta-learning. Korea University School of Electrical Engineering.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'System 2 ML Lab at Korea University',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'System 2 ML Lab at Korea University',
    description: 'Research in System 2 deep learning, LLM reasoning, meta-learning, and Bayesian inference.',
    images: ['/images/twitter-image.jpg'],
    creator: '@KoreaUniv',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://mllab.korea.ac.kr',
  },
  category: 'Research',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/images/icon-192.png" />
        <meta name="theme-color" content="#0066cc" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="System 2 ML Lab" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Pacifico&display=optional"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main>
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
