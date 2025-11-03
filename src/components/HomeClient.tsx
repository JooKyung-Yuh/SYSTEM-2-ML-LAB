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
  const [isMobile, setIsMobile] = useState(false);
  const [showNewsCarousel, setShowNewsCarousel] = useState(false);

  useEffect(() => {
    // Fetch site settings to check if news carousel should be shown
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setShowNewsCarousel(data.showNewsCarousel);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Default to hiding carousel on error
        setShowNewsCarousel(false);
      }
    };

    fetchSettings();

    // Check if mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Delay animation to ensure all components are mounted and carousel is loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 350); // Wait 350ms for carousel to initialize

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Background Image */}
      <div
        id="banner-bg"
        style={{
          background: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />

      {/* Overlay */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2
        }}
      />

      {/* Banner Content */}
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
          zIndex: 3,
          paddingBottom: showNewsCarousel ? (isMobile ? '280px' : '350px') : '0',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1.0s ease-out, transform 1.0s ease-out',
          willChange: 'opacity, transform'
        }}
      >
        <div className="banner-pad" style={{ padding: isMobile ? '0 1rem' : '0 2rem' }}>
          <div className="inner" style={{ lineHeight: 1.5 }}>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              fontWeight: 300,
              color: '#ffffff',
              margin: '0 0 0.5em 0',
              lineHeight: isMobile ? 1.3 : 1.2
            }}>
              {isMobile ? (
                <>
                  WELCOME TO<br />
                  KU SYSTEM 2 ML LAB
                </>
              ) : (
                'WELCOME TO KU SYSTEM 2 ML LAB'
              )}
            </h1>
            <span style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              fontWeight: 300,
              color: '#ffffff',
              display: 'block',
              marginTop: isMobile ? '1rem' : '0.5rem',
              padding: isMobile ? '0 0.5rem' : '0'
            }}>
              Korea University School of Electrical Engineering
            </span>
            <span style={{
              fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
              fontWeight: 300,
              color: '#ffffff',
              display: 'block',
              marginTop: '1rem',
              opacity: 0.9,
              padding: isMobile ? '0 0.5rem' : '0',
              lineHeight: isMobile ? 1.4 : 1.2
            }}>
              Advancing AI through Meta-Learning, System 2 Deep Learning, and LLM Reasoning
            </span>
          </div>
        </div>
      </section>

      {/* News Cards - Fixed at bottom - Only show if enabled */}
      {showNewsCarousel && (
        <div
          id="main-content"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1.0s ease-out, transform 1.0s ease-out',
            willChange: 'opacity, transform'
          }}
        >
          <NewsCarousel newsItems={newsItems} />
        </div>
      )}
    </div>
  );
}