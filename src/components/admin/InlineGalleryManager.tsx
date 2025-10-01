'use client';

import { useState, useEffect } from 'react';
import styles from './InlineGalleryManager.module.css';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  order: number;
  published: boolean;
}

export default function InlineGalleryManager() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<GalleryItem>>({});
  const [originalData, setOriginalData] = useState<Partial<GalleryItem>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleEscapeKey = () => {
    const hasChanges = JSON.stringify(editingData) !== JSON.stringify(originalData);

    if (hasChanges) {
      const shouldSave = window.confirm('변경사항이 있습니다. 저장하시겠습니까?');
      if (shouldSave) {
        handleSave();
      } else {
        handleCancel();
      }
    } else {
      handleCancel();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && editingId) {
        handleEscapeKey();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingId, editingData, originalData]);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/admin/gallery');
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data.sort((a: GalleryItem, b: GalleryItem) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setEditingData({ ...item });
    setOriginalData({ ...item });
    setPreviewMode(false);
  };

  const handleSave = async () => {
    if (!editingId || !editingData) return;

    try {
      const response = await fetch(`/api/admin/gallery/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        const updatedItems = galleryItems.map(item =>
          item.id === editingId ? updatedData : item
        );
        updatedItems.sort((a, b) => a.order - b.order);
        setGalleryItems(updatedItems);
        setEditingId(null);
        setEditingData({});
        setOriginalData({});
      }
    } catch (error) {
      console.error('Failed to save gallery item:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
    setOriginalData({});
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('이 갤러리 항목을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const filteredItems = galleryItems.filter(item => item.id !== itemId);
        setGalleryItems(filteredItems);
      }
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setEditingData({ ...editingData, imageUrl: data.url });
      } else {
        alert('Image upload failed');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddNew = async () => {
    const newOrder = (galleryItems[galleryItems.length - 1]?.order || 0) + 1;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticItem = {
      id: optimisticId,
      title: 'New Gallery Item',
      description: 'Click to edit description',
      imageUrl: 'https://via.placeholder.com/600x400?text=Upload+Image',
      category: 'lab-life',
      order: newOrder,
      published: true
    };

    const optimisticItems = [...galleryItems, optimisticItem];
    setGalleryItems(optimisticItems);
    const itemData = { ...optimisticItem };
    setEditingId(optimisticId);
    setEditingData(itemData);
    setOriginalData(itemData);
    setPreviewMode(false);

    requestAnimationFrame(() => {
      const element = document.querySelector(`[data-gallery-id="${optimisticId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(optimisticItem)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    })
    .then(newData => {
      setGalleryItems(currentItems =>
        currentItems.map(item =>
          item.id === optimisticId ? newData : item
        )
      );
      setEditingId(currentId => currentId === optimisticId ? newData.id : currentId);
      setEditingData(currentData => currentData.id === optimisticId ? { ...newData } : currentData);
      setOriginalData(currentData => currentData.id === optimisticId ? { ...newData } : currentData);

      setTimeout(() => {
        const element = document.querySelector(`[data-gallery-id="${newData.id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    })
    .catch(error => {
      console.error('Failed to create gallery item:', error);
      setGalleryItems(galleryItems);
      setEditingId(null);
      setEditingData({});
      setOriginalData({});
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} inline-editor`}>
      {editingId && <div className={styles.overlay} onClick={handleEscapeKey} />}

      <div className={styles.header}>
        <h1>Gallery</h1>
        <div className={styles.headerActions}>
          <p>Click on any image to edit. Press ESC to exit editing.</p>
          <button
            className={styles.togglePreviewBtn}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? '📝 Edit Mode' : '👁️ Preview Mode'}
          </button>
        </div>
      </div>

      {previewMode && !editingId ? (
        // Preview Mode - Gallery Grid
        <div className={styles.previewContainer}>
          <div className={styles.galleryPreview}>
            {galleryItems.map((item) => (
              <div
                key={item.id}
                data-gallery-id={item.id}
                className={styles.galleryPreviewItem}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {hoveredId === item.id && (
                  <div className={styles.previewControls}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                )}
                <div
                  className={styles.galleryImage}
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                <div className={styles.galleryInfo}>
                  <h3 className={styles.galleryTitle}>{item.title}</h3>
                  {item.description && (
                    <p className={styles.galleryDescription}>{item.description}</p>
                  )}
                  {item.category && (
                    <span className={styles.galleryCategory}>{item.category}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addNewContainer}>
            <button className={styles.addNewBtn} onClick={handleAddNew}>
              <div className={styles.addNewContent}>
                <div className={styles.addIcon}>+</div>
                <span>Add New Image</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className={styles.galleryGrid}>
          {galleryItems.map((item) => (
            <div
              key={item.id}
              data-gallery-id={item.id}
              className={`${styles.galleryItem} ${editingId === item.id ? styles.editing : ''}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {(hoveredId === item.id || editingId === item.id) && (
                <div className={styles.controls}>
                  {editingId === item.id ? (
                    <>
                      <button className={styles.saveBtn} onClick={handleSave}>
                        ✓
                      </button>
                      <button className={styles.cancelBtn} onClick={handleCancel}>
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(item)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(item.id)}
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className={styles.galleryCard}>
                {editingId === item.id ? (
                  <>
                    <div className={styles.imageUploadSection}>
                      <div
                        className={styles.imagePreview}
                        style={{ backgroundImage: `url(${editingData.imageUrl})` }}
                      />
                      <div className={styles.uploadControls}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className={styles.fileInput}
                          id={`file-${item.id}`}
                        />
                        <label htmlFor={`file-${item.id}`} className={styles.uploadBtn}>
                          {uploadingImage ? 'Uploading...' : '📁 Upload Image'}
                        </label>
                        <input
                          type="url"
                          value={editingData.imageUrl || ''}
                          onChange={(e) => setEditingData({ ...editingData, imageUrl: e.target.value })}
                          className={styles.editImageUrl}
                          placeholder="Or paste image URL"
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={editingData.title || ''}
                      onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                      className={styles.editTitle}
                      placeholder="Title"
                    />
                    <textarea
                      value={editingData.description || ''}
                      onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                      className={styles.editDescription}
                      placeholder="Description"
                      rows={3}
                    />
                    <select
                      value={editingData.category || 'lab-life'}
                      onChange={(e) => setEditingData({ ...editingData, category: e.target.value })}
                      className={styles.editCategory}
                    >
                      <option value="lab-activities">Lab Activities</option>
                      <option value="conferences">Conferences</option>
                      <option value="events">Events</option>
                      <option value="awards">Awards</option>
                      <option value="facilities">Facilities</option>
                      <option value="milestones">Milestones</option>
                      <option value="collaborations">Collaborations</option>
                      <option value="lab-life">Lab Life</option>
                    </select>
                  </>
                ) : (
                  <>
                    <div
                      className={styles.galleryImage}
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                      onClick={() => handleEdit(item)}
                    />
                    <h3
                      className={styles.galleryTitle}
                      onClick={() => handleEdit(item)}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className={styles.galleryDescription}
                        onClick={() => handleEdit(item)}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.category && (
                      <span className={styles.galleryCategory}>{item.category}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {!editingId && (
            <div className={styles.addNewContainer}>
              <button className={styles.addNewBtn} onClick={handleAddNew}>
                <div className={styles.addNewContent}>
                  <div className={styles.addIcon}>+</div>
                  <span>Add New Image</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
