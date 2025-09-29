'use client';

import { useEffect, useRef } from 'react';
import type { NewsItem as DataNewsItem } from '@/data/news';
import styles from './NewsCarousel.module.css';

// Minimal typings for jQuery + OwlCarousel to avoid using `any`
type OwlCarouselOptions = Record<string, unknown>;
type OwlCarouselFn = (options?: OwlCarouselOptions | string) => void;
type JQueryInstance = {
  owlCarousel: OwlCarouselFn;
};
type JQueryLike = (el: Element | null) => JQueryInstance;

declare global {
  interface Window {
    $?: JQueryLike & { fn?: { owlCarousel?: OwlCarouselFn } };
  }
}

interface NewsCarouselProps {
  newsItems: DataNewsItem[];
}

export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = carouselRef.current;
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadCSS = (href: string) => {
      return new Promise<void>((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        document.head.appendChild(link);
      });
    };

    const initCarousel = async () => {
      try {
        // Load FontAwesome CSS
        await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

        // Load jQuery
        if (!window.$) {
          await loadScript('/jquery.min.js');
        }

        // Load Owl Carousel
        if (!window.$?.fn || !window.$.fn.owlCarousel) {
          await loadScript('/owl.carousel.min.js');
        }

        // Load Owl Carousel CSS
        await loadCSS('/owl.carousel.min.css');
        await loadCSS('/owl.theme.default.min.css');

        // Wait a bit for everything to load and DOM to be ready
        const initTimer = setTimeout(() => {
          if (node && window.$ && window.$.fn?.owlCarousel) {
            // Ensure the container is visible before initializing
            requestAnimationFrame(() => {
              window.$!(node).owlCarousel({
                loop: true,
                margin: 20,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                nav: true,
                dots: true,
                smartSpeed: 300,
                fluidSpeed: true,
                slideBy: 1,
                dotsEach: 1,
                navText: [
                  '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                  '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
                ],
                responsive: {
                  0: {
                    items: 1,
                    margin: 10,
                    slideBy: 1
                  },
                  600: {
                    items: 2,
                    margin: 15,
                    slideBy: 1
                  },
                  900: {
                    items: 3,
                    margin: 20,
                    slideBy: 1
                  },
                  1200: {
                    items: 4,
                    margin: 20,
                    slideBy: 1
                  },
                  1600: {
                    items: 5,
                    margin: 25,
                    slideBy: 1
                  }
                }
              });
            });
          }
        }, 200);

        return () => clearTimeout(initTimer);
      } catch (error) {
        console.error('Error loading carousel:', error);
      }
    };

    initCarousel();

    return () => {
      if (node && window.$ && window.$.fn?.owlCarousel) {
        window.$!(node).owlCarousel('destroy');
      }
    };
  }, []);

  return (
    <div className={styles.newsCarouselContainer}>
      <div
        ref={carouselRef}
        className={`owl-carousel owl-theme ${styles.newsCarousel}`}
      >
        {newsItems.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.slideEntryBg}>
              <div className={styles.slideEntry}>
                <div className={styles.newsDate}>{item.date}</div>
                <h4 className={styles.newsTitle}>{item.title}</h4>
                <p className={styles.newsDescription}>
                  {item.description}
                  {item.links && item.links.length > 0 && (
                    <>
                      {' ('}
                      {item.links.map((link, index) => (
                        <span key={index}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.newsLink}
                          >
                            {link.text}
                          </a>
                          {index < item.links.length - 1 && ', '}
                        </span>
                      ))}
                      {')'}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}