'use client';

import { useState, useEffect } from 'react';
import styles from './Manager.module.css';

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  published: boolean;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
  pageId: string;
}

export default function PagesManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
        if (data.length > 0 && !selectedPage) {
          setSelectedPage(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const sectionData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      order: parseInt(formData.get('order') as string) || 0,
      pageId: selectedPage?.id
    };

    try {
      const url = editingSection
        ? `/api/admin/sections/${editingSection.id}`
        : '/api/admin/sections';

      const response = await fetch(url, {
        method: editingSection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      });

      if (response.ok) {
        fetchPages();
        setEditingSection(null);
        setShowNewSectionForm(false);
      }
    } catch (error) {
      console.error('Failed to save section:', error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const response = await fetch(`/api/admin/sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handlePagePublishToggle = async (pageId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published })
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Failed to update page:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading pages...</div>;
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Pages Management</h2>
        <p>Manage website pages and their content sections</p>
      </div>

      <div className={styles.layout}>
        {/* Page List Sidebar */}
        <div className={styles.sidebar}>
          <h3>Pages</h3>
          <div className={styles.list}>
            {pages.map((page) => (
              <div
                key={page.id}
                className={`${styles.listItem} ${selectedPage?.id === page.id ? styles.selected : ''}`}
                onClick={() => setSelectedPage(page)}
              >
                <div className={styles.itemHeader}>
                  <h4>{page.title}</h4>
                  <div className={styles.itemActions}>
                    <button
                      className={`${styles.toggleBtn} ${page.published ? styles.published : styles.unpublished}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePagePublishToggle(page.id, page.published);
                      }}
                    >
                      {page.published ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>
                <p className={styles.slug}>/{page.slug}</p>
                <small>{page.sections.length} sections</small>
              </div>
            ))}
          </div>
        </div>

        {/* Section Management */}
        <div className={styles.content}>
          {selectedPage ? (
            <div>
              <div className={styles.pageHeader}>
                <h3>{selectedPage.title}</h3>
                <button
                  className={styles.addBtn}
                  onClick={() => setShowNewSectionForm(true)}
                >
                  Add Section
                </button>
              </div>

              {/* Sections List */}
              <div className={styles.sections}>
                {selectedPage.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div key={section.id} className={styles.sectionCard}>
                      <div className={styles.sectionHeader}>
                        <h4>{section.title}</h4>
                        <div className={styles.sectionActions}>
                          <button
                            className={styles.editBtn}
                            onClick={() => setEditingSection(section)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className={styles.sectionContent}>
                        {section.content.substring(0, 200)}
                        {section.content.length > 200 ? '...' : ''}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Section Form Modal */}
              {(editingSection || showNewSectionForm) && (
                <div className={styles.modal}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>{editingSection ? 'Edit Section' : 'Add New Section'}</h3>
                      <button
                        className={styles.closeBtn}
                        onClick={() => {
                          setEditingSection(null);
                          setShowNewSectionForm(false);
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <form onSubmit={handleSectionSubmit} className={styles.form}>
                      <div className={styles.formGroup}>
                        <label htmlFor="title">Section Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          defaultValue={editingSection?.title || ''}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="order">Order</label>
                        <input
                          type="number"
                          id="order"
                          name="order"
                          defaultValue={editingSection?.order || 0}
                          min="0"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="content">Content</label>
                        <textarea
                          id="content"
                          name="content"
                          rows={10}
                          defaultValue={editingSection?.content || ''}
                          required
                        />
                      </div>

                      <div className={styles.formActions}>
                        <button type="submit" className={styles.saveBtn}>
                          {editingSection ? 'Update Section' : 'Add Section'}
                        </button>
                        <button
                          type="button"
                          className={styles.cancelBtn}
                          onClick={() => {
                            setEditingSection(null);
                            setShowNewSectionForm(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a page to manage its sections</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}