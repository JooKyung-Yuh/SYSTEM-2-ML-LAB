'use client';

import { useState, useEffect } from 'react';
import styles from './InlinePublicationsManager.module.css';

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  url: string | null;
  pdfUrl: string | null;
  category: string;
  order: number;
  published: boolean;
}

export default function InlinePublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Publication>>({});
  const [originalData, setOriginalData] = useState<Partial<Publication>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(true);

  useEffect(() => {
    fetchPublications();
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

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/admin/publications');
      if (response.ok) {
        const data = await response.json();
        setPublications(data.sort((a: Publication, b: Publication) => {
          if (b.year !== a.year) return b.year - a.year;
          return a.order - b.order;
        }));
      }
    } catch (error) {
      console.error('Failed to fetch publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Publication) => {
    setEditingId(item.id);
    setEditingData({ ...item });
    setOriginalData({ ...item });
    setPreviewMode(false);
  };

  const handleSave = async () => {
    if (!editingId || !editingData) return;

    try {
      const response = await fetch(`/api/admin/publications/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        const updatedItems = publications.map(item =>
          item.id === editingId ? updatedData : item
        );
        updatedItems.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return a.order - b.order;
        });
        setPublications(updatedItems);
        setEditingId(null);
        setEditingData({});
        setOriginalData({});
      }
    } catch (error) {
      console.error('Failed to save publication:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
    setOriginalData({});
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('이 논문을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/publications/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const filteredItems = publications.filter(item => item.id !== itemId);
        setPublications(filteredItems);
      }
    } catch (error) {
      console.error('Failed to delete publication:', error);
    }
  };

  const handleAddNew = async () => {
    const currentYear = new Date().getFullYear();
    const newOrder = (publications[0]?.order || 0) + 1;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticItem = {
      id: optimisticId,
      title: 'New Publication Title',
      authors: 'Author Names',
      venue: 'Conference/Journal Name',
      year: currentYear,
      url: null,
      pdfUrl: null,
      category: 'conference',
      order: newOrder,
      published: true
    };

    const optimisticItems = [optimisticItem, ...publications];
    setPublications(optimisticItems);
    const itemData = { ...optimisticItem };
    setEditingId(optimisticId);
    setEditingData(itemData);
    setOriginalData(itemData);
    setPreviewMode(false);

    requestAnimationFrame(() => {
      const element = document.querySelector(`[data-pub-id="${optimisticId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    fetch('/api/admin/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: optimisticItem.title,
        authors: optimisticItem.authors,
        venue: optimisticItem.venue,
        year: optimisticItem.year,
        url: optimisticItem.url,
        pdfUrl: optimisticItem.pdfUrl,
        category: optimisticItem.category,
        order: optimisticItem.order,
        published: optimisticItem.published
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    })
    .then(newData => {
      setPublications(currentItems =>
        currentItems.map(item =>
          item.id === optimisticId ? newData : item
        )
      );
      setEditingId(currentId => currentId === optimisticId ? newData.id : currentId);
      setEditingData(currentData => currentData.id === optimisticId ? { ...newData } : currentData);
      setOriginalData(currentData => currentData.id === optimisticId ? { ...newData } : currentData);

      setTimeout(() => {
        const element = document.querySelector(`[data-pub-id="${newData.id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    })
    .catch(error => {
      console.error('Failed to create publication:', error);
      setPublications(publications);
      setEditingId(null);
      setEditingData({});
      setOriginalData({});
    });
  };

  const groupedPublications = publications.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = [];
    }
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);

  const years = Object.keys(groupedPublications).map(Number).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading publications...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} inline-editor`}>
      {editingId && <div className={styles.overlay} onClick={handleEscapeKey} />}

      <div className={styles.header}>
        <h1>Publications</h1>
        <div className={styles.headerActions}>
          <p>Click on any publication to edit. Press ESC to exit editing.</p>
          <button
            className={styles.togglePreviewBtn}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? '📝 Edit Mode' : '👁️ Preview Mode'}
          </button>
        </div>
      </div>

      {previewMode && !editingId ? (
        // Preview Mode - Shows like actual publications page
        <div className={styles.previewContainer}>
          <div className={styles.publicationsPreview}>
            {years.map((year) => (
              <div key={year} className={styles.yearSection}>
                <h2 className={styles.yearTitle}>{year}</h2>
                {groupedPublications[year].map((pub) => (
                  <div
                    key={pub.id}
                    data-pub-id={pub.id}
                    className={styles.publicationPreview}
                    onMouseEnter={() => setHoveredId(pub.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {hoveredId === pub.id && (
                      <div className={styles.previewControls}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(pub)}
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    )}
                    <div className={styles.pubEntry}>
                      <h3 className={styles.pubTitle}>{pub.title}</h3>
                      <p className={styles.pubAuthors}>{pub.authors}</p>
                      <p className={styles.pubVenue}>
                        <em>{pub.venue}</em>, {pub.year}
                        {pub.url && (
                          <> · <a href={pub.url} target="_blank" rel="noopener noreferrer" className={styles.pubLink}>
                            Paper
                          </a></>
                        )}
                        {pub.pdfUrl && (
                          <> · <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.pubLink}>
                            PDF
                          </a></>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.addNewContainer}>
            <button className={styles.addNewBtn} onClick={handleAddNew}>
              <div className={styles.addNewContent}>
                <div className={styles.addIcon}>+</div>
                <span>Add New Publication</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        // Edit Mode - Shows editable list
        <div className={styles.publicationsGrid}>
          {publications.map((pub) => (
            <div
              key={pub.id}
              data-pub-id={pub.id}
              className={`${styles.publicationItem} ${editingId === pub.id ? styles.editing : ''}`}
              onMouseEnter={() => setHoveredId(pub.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {(hoveredId === pub.id || editingId === pub.id) && (
                <div className={styles.controls}>
                  {editingId === pub.id ? (
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
                        onClick={() => handleEdit(pub)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(pub.id)}
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className={styles.publicationCard}>
                {editingId === pub.id ? (
                  <>
                    <input
                      type="text"
                      value={editingData.title || ''}
                      onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                      className={styles.editTitle}
                      placeholder="Publication Title"
                    />
                    <input
                      type="text"
                      value={editingData.authors || ''}
                      onChange={(e) => setEditingData({ ...editingData, authors: e.target.value })}
                      className={styles.editAuthors}
                      placeholder="Authors (comma separated)"
                    />
                    <div className={styles.editRow}>
                      <input
                        type="text"
                        value={editingData.venue || ''}
                        onChange={(e) => setEditingData({ ...editingData, venue: e.target.value })}
                        className={styles.editVenue}
                        placeholder="Conference/Journal"
                      />
                      <input
                        type="number"
                        value={editingData.year || ''}
                        onChange={(e) => setEditingData({ ...editingData, year: parseInt(e.target.value) })}
                        className={styles.editYear}
                        placeholder="Year"
                      />
                    </div>
                    <div className={styles.editRow}>
                      <select
                        value={editingData.category || 'conference'}
                        onChange={(e) => setEditingData({ ...editingData, category: e.target.value })}
                        className={styles.editCategory}
                      >
                        <option value="conference">Conference</option>
                        <option value="journal">Journal</option>
                        <option value="workshop">Workshop</option>
                      </select>
                    </div>
                    <input
                      type="url"
                      value={editingData.url || ''}
                      onChange={(e) => setEditingData({ ...editingData, url: e.target.value })}
                      className={styles.editUrl}
                      placeholder="Paper URL (optional)"
                    />
                    <input
                      type="url"
                      value={editingData.pdfUrl || ''}
                      onChange={(e) => setEditingData({ ...editingData, pdfUrl: e.target.value })}
                      className={styles.editPdfUrl}
                      placeholder="PDF URL (optional)"
                    />
                  </>
                ) : (
                  <>
                    <div className={styles.pubYear}>{pub.year}</div>
                    <h3
                      className={styles.pubTitle}
                      onClick={() => handleEdit(pub)}
                    >
                      {pub.title}
                    </h3>
                    <p
                      className={styles.pubAuthors}
                      onClick={() => handleEdit(pub)}
                    >
                      {pub.authors}
                    </p>
                    <p
                      className={styles.pubVenue}
                      onClick={() => handleEdit(pub)}
                    >
                      <em>{pub.venue}</em>
                      {(pub.url || pub.pdfUrl) && (
                        <span className={styles.pubLinks}>
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Paper
                            </a>
                          )}
                          {pub.pdfUrl && (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              PDF
                            </a>
                          )}
                        </span>
                      )}
                    </p>
                    <span className={`${styles.categoryBadge} ${styles[pub.category]}`}>
                      {pub.category}
                    </span>
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
                  <span>Add New Publication</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
