'use client';

import { useEffect, useState } from 'react';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

/**
 * Renders HTML content safely by sanitizing it with DOMPurify.
 * Uses dynamic import to avoid SSR issues with DOMPurify.
 */
export default function SafeHTML({ html, className }: SafeHTMLProps) {
  const [sanitized, setSanitized] = useState('');

  useEffect(() => {
    import('dompurify').then((DOMPurify) => {
      setSanitized(DOMPurify.default.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'div', 'span', 'img'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class', 'src', 'alt'],
      }));
    });
  }, [html]);

  if (!sanitized) return null;

  return (
    <div
      className={className}
      // Safe: content is sanitized by DOMPurify with strict allowlist
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
