'use client';

import { ReactNode } from 'react';
import styles from './AdminSection.module.css';

interface AdminSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'bordered' | 'filled';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AdminSection({
  title,
  description,
  children,
  actions,
  variant = 'default',
  spacing = 'md',
  className = ''
}: AdminSectionProps) {
  return (
    <section className={`${styles.section} ${styles[variant]} ${styles[spacing]} ${className}`}>
      {(title || description || actions) && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
}