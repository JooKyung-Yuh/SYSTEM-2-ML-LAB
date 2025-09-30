'use client';

import { useState } from 'react';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  colors?: string[];
  label?: string;
  className?: string;
}

const defaultColors = [
  '#667eea', // Primary blue
  '#764ba2', // Primary purple
  '#48bb78', // Success green
  '#38a169', // Dark green
  '#ed8936', // Warning orange
  '#dd6b20', // Dark orange
  '#f56565', // Danger red
  '#e53e3e', // Dark red
  '#9f7aea', // Purple
  '#805ad5', // Dark purple
  '#4299e1', // Blue
  '#3182ce', // Dark blue
  '#38b2ac', // Teal
  '#319795', // Dark teal
  '#ecc94b', // Yellow
  '#d69e2e', // Dark yellow
  '#a0aec0', // Gray
  '#718096', // Dark gray
  '#2d3748', // Very dark gray
  '#1a202c'  // Black
];

export default function ColorPicker({
  value = '#667eea',
  onChange,
  colors = defaultColors,
  label,
  className = ''
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.colorPicker} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.container}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: value }}
        >
          <span className={styles.colorPreview} style={{ backgroundColor: value }} />
          <span className={styles.colorValue}>{value}</span>
          <i className={`fas fa-chevron-down ${styles.chevron} ${isOpen ? styles.open : ''}`} />
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorOption} ${value === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  title={color}
                >
                  {value === color && <i className="fas fa-check" />}
                </button>
              ))}
            </div>
            <div className={styles.customColor}>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.colorInput}
              />
              <span className={styles.customLabel}>사용자 지정 색상</span>
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}