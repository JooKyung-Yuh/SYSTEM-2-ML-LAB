'use client';

import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

/**
 * Renders HTML content safely by sanitizing it with DOMPurify first.
 * This is a client component because DOMPurify requires a browser DOM.
 * All content is sanitized with a strict allowlist before rendering.
 */
export default function SafeHTML({ html, className }: SafeHTMLProps) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'div', 'span', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class', 'src', 'alt'],
  });

  return (
    <div
      className={className}
      // Safe: content is sanitized by DOMPurify with strict allowlist above
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
