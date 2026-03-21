import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos and highlights from System 2 ML Lab - conferences, events, and lab life.',
};
import GalleryClient from '@/components/GalleryClient';
import styles from './gallery.module.css';
import Footer from '@/components/Footer';
import JoinUs from '@/components/JoinUs';

export const dynamic = 'force-dynamic';

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

        <JoinUs />
      </div>
      <Footer />
    </div>
  );
}
