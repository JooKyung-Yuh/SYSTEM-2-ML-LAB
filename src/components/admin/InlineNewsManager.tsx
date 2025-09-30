'use client';

import { useState, useEffect } from 'react';
import styles from './InlineNewsManager.module.css';

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
  links: Array<{
    id: string;
    text: string;
    url: string;
  }>;
}

export default function InlineNewsManager() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<NewsItem>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchNewsItems();
  }, []);

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
    setEditingId(item.id);
    setEditingData({ ...item });
  };

  const handleSave = async () => {
    if (!editingId || !editingData) return;

    try {
      const response = await fetch(`/api/admin/news/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });

      if (response.ok) {
        await fetchNewsItems();
        setEditingId(null);
        setEditingData({});
      }
    } catch (error) {
      console.error('Failed to save news item:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('이 뉴스를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/news/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchNewsItems();
      }
    } catch (error) {
      console.error('Failed to delete news item:', error);
    }
  };

  const handleAddNew = async () => {
    const newItem = {
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      title: 'New Announcement',
      description: 'Click to edit description',
      order: newsItems.length + 1,
      published: true
    };

    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        await fetchNewsItems();
        const newData = await response.json();
        setEditingId(newData.id);
        setEditingData({ ...newData });
      }
    } catch (error) {
      console.error('Failed to create news item:', error);
    }
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
      <div className={styles.header}>
        <h1>News & Announcements</h1>
        <p>Click on any news item to edit, hover to see controls</p>
      </div>

      <div className={styles.newsGrid}>
        {newsItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.newsItem} ${editingId === item.id ? styles.editing : ''}`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* iOS-style Controls */}
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
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                  >
                    ✕
                  </button>
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
            {(hoveredId === item.id && index < newsItems.length - 1) && (
              <div className={styles.addBetween}>
                <button
                  className={styles.addBtn}
                  onClick={handleAddNew}
                >
                  + Add News
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add New Item at End */}
        <div className={styles.addNewContainer}>
          <button
            className={styles.addNewBtn}
            onClick={handleAddNew}
          >
            <div className={styles.addNewContent}>
              <div className={styles.addIcon}>+</div>
              <span>Add New Announcement</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}