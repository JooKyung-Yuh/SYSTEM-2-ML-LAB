'use client';

import { useState, useEffect } from 'react';
import styles from './InlineAboutEditor.module.css';

interface PageSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  sections: PageSection[];
}

export default function InlineAboutEditor() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'page' | 'section' | null>(null);
  const [editingData, setEditingData] = useState<Partial<PageData & PageSection> & { content?: string | null }>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      // First check if about page exists
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const pages = await response.json();
        let aboutPage = pages.find((p: PageData) => p.slug === 'about');

        if (!aboutPage) {
          // Create about page if it doesn't exist
          const createResponse = await fetch('/api/admin/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slug: 'about',
              title: 'About Us',
              content: 'Welcome to our research lab...',
              published: true
            })
          });
          if (createResponse.ok) {
            aboutPage = await createResponse.json();
          }
        }

        if (aboutPage) {
          setPageData(aboutPage);
        }
      }
    } catch (error) {
      console.error('Failed to fetch page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string, type: 'page' | 'section', data: PageData | PageSection) => {
    setEditingId(id);
    setEditingType(type);
    setEditingData({ ...data } as Partial<PageData & PageSection> & { content?: string | null });
  };

  const handleSave = async () => {
    if (!editingId || !editingType || !editingData) return;

    try {
      if (editingType === 'page') {
        const response = await fetch(`/api/admin/pages/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingData)
        });
        if (response.ok) {
          await fetchPageData();
        }
      } else if (editingType === 'section') {
        const response = await fetch(`/api/admin/sections/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingData)
        });
        if (response.ok) {
          await fetchPageData();
        }
      }

      setEditingId(null);
      setEditingType(null);
      setEditingData({});
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingType(null);
    setEditingData({});
  };

  const handleAddSection = async () => {
    if (!pageData) return;

    const newSection = {
      title: 'New Section',
      content: 'Click to edit content...',
      order: (pageData.sections?.length || 0) + 1,
      pageId: pageData.id
    };

    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection)
      });

      if (response.ok) {
        await fetchPageData();
        const newData = await response.json();
        setEditingId(newData.id);
        setEditingType('section');
        setEditingData({ ...newData });
      }
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPageData();
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading page...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className={styles.error}>
        <p>Unable to load About Us page data</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} inline-editor`}>
      <div className={styles.header}>
        <h1>About Us Page Editor</h1>
        <p>Click on any element to edit directly</p>
      </div>

      {/* Page Content - Mimicking actual About Us page */}
      <div className={styles.pagePreview}>
        {/* Page Title Section */}
        <div
          className={`${styles.editableSection} ${editingId === pageData.id && editingType === 'page' ? styles.editing : ''}`}
          onMouseEnter={() => setHoveredId(`page-${pageData.id}`)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Controls */}
          {(hoveredId === `page-${pageData.id}` || (editingId === pageData.id && editingType === 'page')) && (
            <div className={styles.controls}>
              {editingId === pageData.id && editingType === 'page' ? (
                <>
                  <button className={styles.saveBtn} onClick={handleSave}>✓</button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>✕</button>
                </>
              ) : (
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(pageData.id, 'page', pageData)}
                >
                  ✏️
                </button>
              )}
            </div>
          )}

          <header className={styles.pageHeader}>
            {editingId === pageData.id && editingType === 'page' ? (
              <input
                type="text"
                value={editingData.title || ''}
                onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                className={styles.editTitle}
              />
            ) : (
              <h1
                className={styles.pageTitle}
                onClick={() => handleEdit(pageData.id, 'page', pageData)}
              >
                {pageData.title}
              </h1>
            )}
            <div className={styles.titleUnderline}></div>
          </header>
        </div>

        {/* Page Sections */}
        <div className={styles.sectionsContainer}>
          {pageData.sections?.sort((a, b) => a.order - b.order).map((section, index) => (
            <div
              key={section.id}
              className={`${styles.editableSection} ${editingId === section.id && editingType === 'section' ? styles.editing : ''}`}
              onMouseEnter={() => setHoveredId(section.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Controls */}
              {(hoveredId === section.id || (editingId === section.id && editingType === 'section')) && (
                <div className={styles.controls}>
                  {editingId === section.id && editingType === 'section' ? (
                    <>
                      <button className={styles.saveBtn} onClick={handleSave}>✓</button>
                      <button className={styles.cancelBtn} onClick={handleCancel}>✕</button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(section.id, 'section', section)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              )}

              <section className={styles.section}>
                {editingId === section.id && editingType === 'section' ? (
                  <>
                    <input
                      type="text"
                      value={editingData.title || ''}
                      onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                      className={styles.editSectionTitle}
                    />
                    <textarea
                      value={editingData.content || ''}
                      onChange={(e) => setEditingData({ ...editingData, content: e.target.value })}
                      className={styles.editSectionContent}
                      rows={6}
                    />
                  </>
                ) : (
                  <>
                    <h2
                      className={styles.sectionTitle}
                      onClick={() => handleEdit(section.id, 'section', section)}
                    >
                      {section.title}
                    </h2>
                    <div
                      className={styles.sectionContent}
                      onClick={() => handleEdit(section.id, 'section', section)}
                      dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br>') }}
                    />
                  </>
                )}
              </section>

              {/* Add Section Button (between sections) */}
              {hoveredId === section.id && index < pageData.sections.length - 1 && (
                <div className={styles.addBetween}>
                  <button className={styles.addBtn} onClick={handleAddSection}>
                    + Add Section
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Section at End */}
          <div className={styles.addNewContainer}>
            <button className={styles.addNewBtn} onClick={handleAddSection}>
              <div className={styles.addNewContent}>
                <div className={styles.addIcon}>+</div>
                <span>Add New Section</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}