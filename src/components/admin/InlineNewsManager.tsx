'use client';

import { useState, useEffect } from 'react';
import styles from './InlineNewsManager.module.css';

interface NewsLink {
  id?: string;
  text: string;
  url: string;
}

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  order: number;
  links: NewsLink[];
}

export default function InlineNewsManager() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<NewsItem & { links: NewsLink[] }>>({});
  const [originalData, setOriginalData] = useState<Partial<NewsItem & { links: NewsLink[] }>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsItems();
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
  }, [editingId, editingData, originalData, handleEscapeKey]);

  const fetchNewsItems = async () => {
    try {
      const response = await fetch('/api/admin/news');
      if (response.ok) {
        const data = await response.json();
        setNewsItems(data.sort((a: NewsItem, b: NewsItem) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to fetch news items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    const itemData = { ...item, links: [...(item.links || [])] };
    setEditingId(item.id);
    setEditingData(itemData);
    setOriginalData(itemData);
  };

  const handleSave = async () => {
    if (!editingId || !editingData) return;

    try {
      // Clean up links data - remove id field for new links
      const cleanedLinks = (editingData.links || []).map(link => ({
        text: link.text,
        url: link.url
      }));

      const response = await fetch(`/api/admin/news/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingData,
          links: cleanedLinks
        })
      });

      if (response.ok) {
        const updatedData = await response.json();

        // 성능 개선: fetchNewsItems 대신 즉시 상태 업데이트
        const updatedItems = newsItems.map(item =>
          item.id === editingId ? updatedData : item
        );
        // order로 다시 정렬
        updatedItems.sort((a, b) => a.order - b.order);
        setNewsItems(updatedItems);

        setEditingId(null);
        setEditingData({});
        setOriginalData({});
          }
    } catch (error) {
      console.error('Failed to save news item:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
    setOriginalData({});
  };

  const addLink = () => {
    const currentLinks = editingData.links || [];
    setEditingData({
      ...editingData,
      links: [...currentLinks, { text: '', url: '' }]
    });
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const currentLinks = [...(editingData.links || [])];
    currentLinks[index] = { ...currentLinks[index], [field]: value };
    setEditingData({
      ...editingData,
      links: currentLinks
    });
  };

  const removeLink = (index: number) => {
    const currentLinks = [...(editingData.links || [])];
    currentLinks.splice(index, 1);
    setEditingData({
      ...editingData,
      links: currentLinks
    });
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('이 뉴스를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/news/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // 성능 개선: fetchNewsItems 대신 즉시 상태 업데이트
        const filteredItems = newsItems.filter(item => item.id !== itemId);
        setNewsItems(filteredItems);
      }
    } catch (error) {
      console.error('Failed to delete news item:', error);
    }
  };

  const handleAddNew = async (afterIndex?: number) => {
    // Calculate the new order based on position
    let newOrder;
    if (afterIndex === undefined || afterIndex === newsItems.length - 1) {
      // Adding at the end
      newOrder = (newsItems[newsItems.length - 1]?.order || 0) + 1;
    } else {
      // Adding between items
      const currentOrder = newsItems[afterIndex]?.order || 0;
      const nextOrder = newsItems[afterIndex + 1]?.order || currentOrder + 2;
      newOrder = currentOrder + (nextOrder - currentOrder) / 2;
    }

    const optimisticId = `temp-${Date.now()}`;
    const optimisticItem = {
      id: optimisticId,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      title: 'New Announcement',
      description: 'Click to edit description',
      order: newOrder,
      links: []
    };

    // 낙관적 업데이트: 즉시 UI에 반영
    const optimisticItems = [...newsItems];
    if (afterIndex === undefined || afterIndex === newsItems.length - 1) {
      optimisticItems.push(optimisticItem);
    } else {
      optimisticItems.splice(afterIndex + 1, 0, optimisticItem);
    }
    optimisticItems.sort((a, b) => a.order - b.order);

    // 모든 상태를 한 번에 업데이트
    setNewsItems(optimisticItems);
    const itemData = { ...optimisticItem, links: [] };
    setEditingId(optimisticId);
    setEditingData(itemData);
    setOriginalData(itemData);

    // 다음 렌더 사이클에서 스크롤 (더 빠름)
    requestAnimationFrame(() => {
      const element = document.querySelector(`[data-news-id="${optimisticId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // 백그라운드에서 실제 API 호출 (비동기, 블로킹 없음)
    fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: optimisticItem.date,
        title: optimisticItem.title,
        description: optimisticItem.description,
        order: optimisticItem.order,
        links: []
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    })
    .then(newData => {
      // 임시 ID를 실제 ID로 교체
      setNewsItems(currentItems =>
        currentItems.map(item =>
          item.id === optimisticId ? newData : item
        )
      );

      // 편집 중인 항목이 이것이면 ID 업데이트
      setEditingId(currentId => currentId === optimisticId ? newData.id : currentId);
      setEditingData(currentData => {
        if (currentData.id === optimisticId) {
          return { ...newData, links: [...(newData.links || [])] };
        }
        return currentData;
      });
      setOriginalData(currentData => {
        if (currentData.id === optimisticId) {
          return { ...newData, links: [...(newData.links || [])] };
        }
        return currentData;
      });

      // DOM ID도 업데이트될 때까지 대기
      setTimeout(() => {
        const element = document.querySelector(`[data-news-id="${newData.id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    })
    .catch(error => {
      console.error('Failed to create news item:', error);
      // 실패시 롤백
      setNewsItems(newsItems);
      setEditingId(null);
      setEditingData({});
      setOriginalData({});
      });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading news...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} inline-editor`}>
      {/* Background Overlay */}
      {editingId && <div className={styles.overlay} onClick={handleEscapeKey} />}

      <div className={styles.header}>
        <h1>News & Announcements</h1>
        <p>Click on any news item to edit, hover to see controls. Press ESC to exit editing.</p>
      </div>

      <div className={styles.newsGrid}>
        {newsItems.map((item, index) => (
          <div
            key={item.id}
            data-news-id={item.id}
            className={`${styles.newsItem} ${editingId === item.id ? styles.editing : ''}`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Controls */}
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

            {/* News Content */}
            <div className={styles.slideEntryBg}>
              <div className={styles.slideEntry}>
                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editingData.date || ''}
                      onChange={(e) => setEditingData({ ...editingData, date: e.target.value })}
                      className={styles.editDate}
                      placeholder="Date"
                    />
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

                    {/* Links Editing */}
                    <div className={styles.linksSection}>
                      <div className={styles.linksSectionHeader}>
                        <label className={styles.linksLabel}>Links</label>
                        <button
                          type="button"
                          onClick={addLink}
                          className={styles.addLinkBtn}
                        >
                          + Add Link
                        </button>
                      </div>

                      {(editingData.links || []).map((link, index) => (
                        <div key={index} className={styles.linkRow}>
                          <input
                            type="text"
                            value={link.text}
                            onChange={(e) => updateLink(index, 'text', e.target.value)}
                            className={styles.linkText}
                            placeholder="Link text"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            className={styles.linkUrl}
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className={styles.removeLinkBtn}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={styles.newsDate}
                      onClick={() => handleEdit(item)}
                    >
                      {item.date}
                    </div>
                    <h4
                      className={styles.newsTitle}
                      onClick={() => handleEdit(item)}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={styles.newsDescription}
                      onClick={() => handleEdit(item)}
                    >
                      {item.description}
                      {item.links && item.links.length > 0 && (
                        <>
                          {' ('}
                          {item.links.map((link, linkIndex) => (
                            <span key={linkIndex}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.newsLink}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {link.text}
                              </a>
                              {linkIndex < item.links.length - 1 && ', '}
                            </span>
                          ))}
                          {')'}
                        </>
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Add Button Between Items */}
            {(hoveredId === item.id && !editingId) && (
              <div className={styles.addBetween}>
                <button
                  className={styles.addBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Add After button clicked for index:', index);
                    handleAddNew(index);
                  }}
                >
                  + Add After
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add New Item at End */}
        {!editingId && (
          <div className={styles.addNewContainer}>
            <button
              className={styles.addNewBtn}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Add New Announcement button clicked');
                handleAddNew();
              }}
            >
              <div className={styles.addNewContent}>
                <div className={styles.addIcon}>+</div>
                <span>Add New Announcement</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}