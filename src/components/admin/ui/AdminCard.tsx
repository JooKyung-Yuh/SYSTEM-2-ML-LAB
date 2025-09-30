'use client';

import { ReactNode } from 'react';
import styles from './AdminCard.module.css';

interface AdminCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  actions?: ReactNode;
}

export default function AdminCard({
  title,
  subtitle,
  children,
  variant = 'default',
  size = 'md',
  className = '',
  actions
}: AdminCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${styles[size]} ${className}`}>
      {(title || subtitle || actions) && (
        <div className={styles.header}>
          <div className={styles.titleSection}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}