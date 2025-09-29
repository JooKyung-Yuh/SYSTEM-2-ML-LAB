import HomeClient from '@/components/HomeClient';
import prisma from '@/lib/prisma';

export default async function Home() {
  const newsItems = await prisma.newsItem.findMany({
    include: {
      links: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return <HomeClient newsItems={newsItems} />;
}