'use client';

import NewsCarousel from '@/components/NewsCarousel';
import { newsData } from '@/data/news';

export default function Home() {

  return (
    <div>
      <section
        id="banner-bg"
        style={{
          background: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          height: '110vh',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: 9999
        }}
      >
        <section
          className="banner-bg2"
          style={{
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 10000,
            height: '100%'
          }}
        >
          <section
            id="banner"
            style={{
              color: '#ffffff',
              padding: '15em 0 0 0',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div className="banner-pad">
              <div className="inner" style={{ lineHeight: 1.5 }}>
                <h1 style={{
                  fontSize: '3.5em',
                  fontWeight: 300,
                  color: '#ffffff',
                  margin: '0 0 0.5em 0'
                }}>
                  WELCOME TO KU SYSTEM 2 ML LAB
                </h1>
                <span style={{
                  fontSize: '1.1em',
                  fontWeight: 300,
                  color: '#ffffff'
                }}>
                  Korea University System 2 Machine Learning Lab<br/>
                </span>
              </div>
            </div>
          </section>

          <div id="main-content" style={{ padding: '2em 0' }}>
            <NewsCarousel newsItems={newsData} />
          </div>
        </section>
      </section>
    </div>
  );
}