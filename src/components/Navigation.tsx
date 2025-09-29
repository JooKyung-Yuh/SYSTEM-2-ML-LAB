'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide navigation on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isHomePage = pathname === '/';
  const textColor = isHomePage ? '#ffffff' : '#1f2937';
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
      id="header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10001,
        padding: '2em 0',
        background: isHomePage
          ? 'transparent'
          : 'linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(248, 250, 252, 0.8) 50%, rgba(248, 250, 252, 0.4) 100%)',
        backdropFilter: isHomePage ? 'none' : 'blur(10px)'
      }}
    >
      <div
        className="inner header_inner"
        style={{
          maxWidth: '80em',
          margin: '0 auto',
          padding: '0 clamp(1rem, 3vw, 2rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Lab Logo/Name */}
        <Link
          href="/"
          className="logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: textColor
          }}
        >
          <img
            className="logo-image"
            src={isHomePage ? "/images/ku_logo_white.png" : "/images/ku_logo_black.png"}
            alt="KU Logo"
            style={{
              width: 'clamp(32px, 5vw, 42px)',
              height: 'clamp(32px, 5vw, 42px)',
              objectFit: 'contain',
              marginRight: '12px'
            }}
            onError={(e) => {
              // Fallback if image not found
              e.currentTarget.style.display = 'none';
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: textColor,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.5px'
            }}>
              SYSTEM 2 ML LAB
            </div>
            <div style={{
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              color: isHomePage ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.7)',
              marginTop: '1px',
              fontWeight: 400,
              letterSpacing: '0.3px'
            }}>
              Korea University
            </div>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav
          id="nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2em'
          }}
        >
          {navItems.map((item) => {
            const isCurrentPage = pathname === item.href;
            const linkColor = isCurrentPage ? '#e5474b' : textColor;

            return (
            <Link
              key={item.href}
              href={item.href}
              className={isCurrentPage ? 'current' : ''}
              style={{
                color: linkColor,
                textDecoration: 'none',
                fontSize: '0.9em',
                fontWeight: 400,
                padding: '0.5em 1em',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                border: item.href === '/' ? `1px solid ${isHomePage ? 'rgba(255, 255, 255, 0.35)' : 'rgba(31, 41, 55, 0.35)'}` : 'none'
              }}
              onMouseOver={(e) => {
                if (!isCurrentPage) {
                  e.currentTarget.style.color = '#e5474b';
                }
              }}
              onMouseOut={(e) => {
                if (!isCurrentPage) {
                  e.currentTarget.style.color = textColor;
                }
              }}
            >
              {item.label}
            </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: textColor,
            fontSize: '1.5em',
            cursor: 'pointer',
            padding: '0.5em',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
          }}
          className="mobile-menu-toggle"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = isHomePage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 41, 55, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: isHomePage ? 'rgba(0, 0, 0, 0.95)' : 'rgba(248, 250, 252, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 2rem',
            zIndex: 1000
          }}
        >
          {navItems.map((item) => {
            const isCurrentPageMobile = pathname === item.href;
            const mobileLinkColor = isCurrentPageMobile ? '#e5474b' : textColor;

            return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'block',
                color: mobileLinkColor,
                textDecoration: 'none',
                fontSize: '1.1em',
                fontWeight: 400,
                padding: '1em 0',
                borderBottom: `1px solid ${isHomePage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 41, 55, 0.1)'}`,
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (!isCurrentPageMobile) {
                  e.currentTarget.style.color = '#e5474b';
                }
              }}
              onMouseOut={(e) => {
                if (!isCurrentPageMobile) {
                  e.currentTarget.style.color = textColor;
                }
              }}
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