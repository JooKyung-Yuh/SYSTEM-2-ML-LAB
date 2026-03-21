import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news, announcements, and achievements from System 2 ML Lab at Korea University.',
};
import styles from './news.module.css';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

interface NewsLink {
  id: string;
  text: string;
  url: string;
}

interface NewsItemData {
  id: string;
  date: string;
  title: string;
  description: string;
  order: number;
  links: NewsLink[];
}

export default async function NewsPage() {
  let newsItems: NewsItemData[];

  try {
    newsItems = await prisma.newsItem.findMany({
      include: { links: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    newsItems = [];
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>News & Updates</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>
            Stay updated with the latest developments, achievements, and announcements
            from Korea University System 2 ML Lab.
          </p>
        </header>

        {newsItems.length > 0 ? (
          <div className={styles.newsList}>
            {newsItems.map((item) => (
              <article key={item.id} className={styles.newsCard}>
                <div className={styles.newsDate}>{item.date}</div>
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsDescription}>
                  {item.description}
                </p>
                {item.links && item.links.length > 0 && (
                  <div className={styles.newsLinks}>
                    {item.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.newsLink}
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
            <p style={{ fontSize: '1.1rem' }}>No news yet. Check back soon!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
