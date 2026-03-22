'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Navigation.module.css';

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay for smooth entrance
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  // Key change: default to home style (transparent).
  // Only switch to inner style when pathname is confirmed AND it's not home.
  const confirmedInner = isReady && pathname && pathname !== '/';
  const textColor = confirmedInner ? '#1f2937' : '#ffffff';

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/people', label: 'People' },
    { href: '/publications', label: 'Publications' },
    { href: '/courses', label: 'Courses' },
    { href: '/gallery', label: 'Gallery' },
  ];

  return (
    <header
      className={styles.header}
      role="banner"
      style={{
        background: confirmedInner
          ? 'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(248,250,252,0.8) 50%, rgba(248,250,252,0.4) 100%)'
          : 'transparent',
        backdropFilter: confirmedInner ? 'blur(10px)' : 'none',
        opacity: isReady ? 1 : 0,
        transition: 'opacity 0.5s ease, background 0.3s ease',
      }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo} style={{ color: textColor, transition: 'color 0.3s' }}>
          <span className={styles.logoImageWrapper}>
            <Image
              className={styles.logoImage}
              src="/images/ku_logo_white.png"
              alt="KU Logo"
              width={42}
              height={42}
              unoptimized
              style={{ opacity: confirmedInner ? 0 : 1, transition: 'opacity 0.15s' }}
            />
            <Image
              className={`${styles.logoImage} ${styles.logoImageOverlay}`}
              src="/images/ku_logo_black.png"
              alt=""
              width={42}
              height={42}
              unoptimized
              style={{ opacity: confirmedInner ? 1 : 0, transition: 'opacity 0.15s' }}
            />
          </span>
          <div className={styles.logoText}>
            <div className={styles.labName} style={{ color: textColor, transition: 'color 0.3s' }}>
              SYSTEM 2 ML LAB
            </div>
            <div className={styles.university} style={{
              color: confirmedInner ? 'rgba(31,41,55,0.7)' : 'rgba(255,255,255,0.8)',
              transition: 'color 0.3s',
            }}>
              Korea University
            </div>
          </div>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => {
            const isCurrent = pathname === item.href;
            const homeBtn = item.href === '/' ? (confirmedInner ? styles.navLinkInner : styles.navLinkHome) : '';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isCurrent ? styles.navLinkCurrent : ''} ${homeBtn}`}
                style={{ color: isCurrent ? '#e5474b' : textColor, transition: 'color 0.3s' }}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={styles.mobileToggle}
          style={{ color: textColor }}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          ☰
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={`${styles.mobileMenu} ${confirmedInner ? styles.mobileMenuInner : styles.mobileMenuHome}`}>
          {navItems.map((item) => {
            const isCurrent = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${styles.mobileLink} ${confirmedInner ? styles.mobileLinkBorderDark : styles.mobileLinkBorderLight}`}
                style={{ color: isCurrent ? '#e5474b' : textColor }}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navigation;
