'use client';

import { useState, useRef } from 'react';
import AdminButton from './AdminButton';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  value?: string | null;
  onChange: (imageUrl: string | null) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "이미지 업로드",
  accept = "image/*",
  maxSize = 5, // 5MB default
  width = 200,
  height = 200,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`파일 크기가 ${maxSize}MB를 초과합니다.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${styles.imageUpload} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}

      <div
        className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''} ${value ? styles.hasImage : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ width, height }}
      >
        {value ? (
          <div className={styles.imageContainer}>
            <img
              src={value}
              alt="Uploaded"
              className={styles.uploadedImage}
            />
            <div className={styles.imageOverlay}>
              <AdminButton
                onClick={() => fileInputRef.current?.click()}
                variant="primary"
                size="sm"
                icon={<i className="fas fa-edit"></i>}
              >
                변경
              </AdminButton>
              <AdminButton
                onClick={handleRemove}
                variant="danger"
                size="sm"
                icon={<i className="fas fa-trash"></i>}
              >
                삭제
              </AdminButton>
            </div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            {uploading ? (
              <div className={styles.uploadingState}>
                <div className={styles.spinner}></div>
                <p>업로드 중...</p>
              </div>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt"></i>
                <p>이미지를 드래그하거나 클릭하여 업로드</p>
                <AdminButton
                  onClick={() => fileInputRef.current?.click()}
                  variant="secondary"
                  size="sm"
                >
                  파일 선택
                </AdminButton>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className={styles.hiddenInput}
      />

      <div className={styles.helpText}>
        <small>
          최대 {maxSize}MB, {accept.replace('image/', '').toUpperCase()} 형식 지원
        </small>
      </div>
    </div>
  );
}