import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getShowRecruitment } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos and highlights from System 2 ML Lab - conferences, events, and lab life.',
  alternates: { canonical: '/gallery' },
  openGraph: { images: [{ url: '/api/og?title=Gallery', width: 1200, height: 630 }], url: '/gallery' },
};
import GalleryClient from '@/components/GalleryClient';
import styles from './gallery.module.css';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';

export const revalidate = 60; // revalidate every 60 seconds

interface GalleryItemData {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  date: string | null;
  order: number;
  published: boolean;
}

export default async function GalleryPage() {
  let galleryItems: GalleryItemData[];

  try {
    const dbItems = await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }],
    });
    galleryItems = dbItems;
  } catch {
    galleryItems = [];
  }

  const showRecruitment = await getShowRecruitment();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gallery</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>
            Capturing moments of discovery, collaboration, and achievement in our research journey.
          </p>
        </header>

        {galleryItems.length > 0 ? (
          <GalleryClient galleryItems={galleryItems} />
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
            <p style={{ fontSize: '1.1rem' }}>Gallery photos coming soon.</p>
          </div>
        )}

        <JoinUs show={showRecruitment} />
      </div>
      <Footer />
    </div>
  );
}
