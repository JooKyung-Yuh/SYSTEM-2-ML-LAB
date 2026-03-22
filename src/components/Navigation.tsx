'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import styles from './Navigation.module.css';

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  const isHomePage = !pathname || pathname === '/';
  const colorWhite = '#ffffff';
  const colorDark = '#1f2937';
  const textColor = isHomePage ? colorWhite : colorDark;

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
      className={`${styles.header} ${isHomePage ? styles.headerHome : styles.headerInner}`}
      role="banner"
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo} style={{ color: textColor }}>
          <Image
            className={styles.logoImage}
            src={isHomePage ? '/images/ku_logo_white.png' : '/images/ku_logo_black.png'}
            alt="KU Logo"
            width={42}
            height={42}
            unoptimized
          />
          <div className={styles.logoText}>
            <div className={styles.labName} style={{ color: textColor }}>
              SYSTEM 2 ML LAB
            </div>
            <div className={styles.university} style={{ color: isHomePage ? 'rgba(255,255,255,0.8)' : 'rgba(31,41,55,0.7)' }}>
              Korea University
            </div>
          </div>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => {
            const isCurrent = pathname === item.href;
            const homeBtn = item.href === '/' ? (isHomePage ? styles.navLinkHome : styles.navLinkInner) : '';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isCurrent ? styles.navLinkCurrent : ''} ${homeBtn}`}
                style={{ color: isCurrent ? '#e5474b' : textColor }}
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
        <div className={`${styles.mobileMenu} ${isHomePage ? styles.mobileMenuHome : styles.mobileMenuInner}`}>
          {navItems.map((item) => {
            const isCurrent = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${styles.mobileLink} ${isHomePage ? styles.mobileLinkBorderLight : styles.mobileLinkBorderDark}`}
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
