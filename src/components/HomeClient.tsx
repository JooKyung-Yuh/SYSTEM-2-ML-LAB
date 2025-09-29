'use client';

import { useEffect, useState } from 'react';
import NewsCarousel from '@/components/NewsCarousel';

interface NewsLink {
  id: string;
  text: string;
  url: string;
  newsItemId: string;
}

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  links: NewsLink[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface HomeClientProps {
  newsItems: NewsItem[];
}

export default function HomeClient({ newsItems }: HomeClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay animation to ensure all components are mounted and carousel is loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200); // Wait 200ms for carousel to initialize

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <section
        id="banner-bg"
        style={{
          background: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          height: '100vh',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%'
        }}
      >
        <section
          className="banner-bg2"
          style={{
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 10000,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <section
            id="banner"
            style={{
              color: '#ffffff',
              textAlign: 'center',
              position: 'relative',
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1.0s ease-out, transform 1.0s ease-out',
              willChange: 'opacity, transform'
            }}
          >
            <div className="banner-pad">
              <div className="inner" style={{ lineHeight: 1.5 }}>
                <h1 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  margin: '0 0 0.5em 0',
                  lineHeight: 1.2
                }}>
                  WELCOME TO KU SYSTEM 2 ML LAB
                </h1>
                <span style={{
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  display: 'block',
                  marginTop: '0.5rem'
                }}>
                  Korea University School of Electrical Engineering
                </span>
                <span style={{
                  fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  display: 'block',
                  marginTop: '1rem',
                  opacity: 0.9
                }}>
                  Advancing AI through Meta-Learning, System 2 Deep Learning, and LLM Reasoning
                </span>
              </div>
            </div>
          </section>

          <div id="main-content" style={{
            position: 'sticky',
            bottom: 0,
            padding: '0 clamp(1rem, 3vw, 2rem) clamp(2rem, 4vh, 3rem)',
            marginBottom: '2rem',
            zIndex: 1000,
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1.0s ease-out, transform 1.0s ease-out',
            willChange: 'opacity, transform'
          }}>
            <NewsCarousel newsItems={newsItems} />
          </div>
        </section>
      </section>
    </div>
  );
}