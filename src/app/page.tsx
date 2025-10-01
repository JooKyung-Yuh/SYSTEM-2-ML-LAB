import HomeClient from '@/components/HomeClient';
import prisma from '@/lib/prisma';
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/StructuredData';
import { Metadata } from 'next';
import { siteConfig, getImageUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Home',
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: 'Leading AI research lab focusing on System 2 reasoning, LLM, and meta-learning.',
    images: [siteConfig.images.ogImage],
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
          name: siteConfig.organization.name,
          description: siteConfig.description,
          url: siteConfig.url,
          logo: getImageUrl(siteConfig.images.logo),
          contactPoint: {
            contactType: 'Research',
            email: siteConfig.contact.email,
          },
          address: {
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.region,
            postalCode: siteConfig.address.postalCode,
            addressCountry: siteConfig.address.country,
          },
        }}
      />
      <WebsiteStructuredData />
      <HomeClient newsItems={newsItems} />
    </>
  );
}