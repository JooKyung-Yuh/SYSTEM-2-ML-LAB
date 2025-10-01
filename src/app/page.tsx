import HomeClient from '@/components/HomeClient';
import prisma from '@/lib/prisma';
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/StructuredData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'System 2 ML Lab at Korea University. Leading research in System 2 deep learning, large language model reasoning, meta-learning, AutoML, Bayesian inference, and generative flow networks.',
  openGraph: {
    title: 'System 2 ML Lab at Korea University',
    description: 'Leading AI research lab focusing on System 2 reasoning, LLM, and meta-learning.',
    images: ['/images/og-image.jpg'],
  },
};

export default async function Home() {
  const newsItems = await prisma.newsItem.findMany({
    include: {
      links: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <>
      <OrganizationStructuredData
        data={{
          name: 'System 2 ML Lab',
          description: 'Machine Learning research laboratory at Korea University focusing on System 2 reasoning, large language models, and meta-learning',
          url: 'https://mllab.korea.ac.kr',
          logo: 'https://mllab.korea.ac.kr/images/logo.png',
          contactPoint: {
            contactType: 'Research',
            email: 'haebeomlee@korea.ac.kr',
          },
          address: {
            streetAddress: '145 Anam-ro, Engineering Hall',
            addressLocality: 'Seoul',
            addressRegion: 'Seongbuk-gu',
            postalCode: '02841',
            addressCountry: 'KR',
          },
        }}
      />
      <WebsiteStructuredData />
      <HomeClient newsItems={newsItems} />
    </>
  );
}