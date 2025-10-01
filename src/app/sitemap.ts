import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { siteConfig } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/people`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    // Dynamic news pages
    const newsItems = await prisma.newsItem.findMany({
      select: { id: true, updatedAt: true },
      take: 100, // Limit to recent items
    });

    const newsPages: MetadataRoute.Sitemap = newsItems.map((item) => ({
      url: `${baseUrl}/news/${item.id}`,
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Dynamic publication pages
    const publications = await prisma.publication.findMany({
      select: { id: true, updatedAt: true },
      take: 100,
    });

    const publicationPages: MetadataRoute.Sitemap = publications.map((pub) => ({
      url: `${baseUrl}/publications/${pub.id}`,
      lastModified: pub.updatedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }));

    // Dynamic people pages
    const people = await prisma.person.findMany({
      select: { id: true, updatedAt: true },
      take: 50,
    });

    const peoplePages: MetadataRoute.Sitemap = people.map((person) => ({
      url: `${baseUrl}/people/${person.id}`,
      lastModified: person.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...newsPages, ...publicationPages, ...peoplePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages if database fails
    return staticPages;
  }
}
