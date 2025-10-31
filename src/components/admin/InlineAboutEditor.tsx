'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import styles from './InlineAboutEditor.module.css';
import { showToast, toastMessages } from '@/lib/toast';
import RichTextEditor from './ui/RichTextEditor';
import GridCardEditor from './ui/GridCardEditor';

interface PageSection {
  id: string;
  title: string;
  content: string;
  layout: string;
  order: number;
}

interface GridSectionData {
  description?: string;
  cards: Array<{ id: string; title: string; content: string }>;
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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

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
      } else {
        console.error('Failed to fetch pages:', response.status);
        showToast.error('페이지를 불러올 수 없습니다. 로그인을 확인해주세요.');
      }
    } catch (error) {
      console.error('Failed to fetch page data:', error);
      showToast.error('페이지를 불러오는 중 오류가 발생했습니다.');
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
    if (!editingId || !editingType || !editingData || saving) return;

    setSaving(true);
    try {
      if (editingType === 'page') {
        const response = await fetch(`/api/admin/pages/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingData)
        });
        if (response.ok) {
          await fetchPageData();
          showToast.success(toastMessages.pages.updated);
        } else {
          showToast.error(toastMessages.pages.error);
        }
      } else if (editingType === 'section') {
        const response = await fetch(`/api/admin/sections/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingData)
        });
        if (response.ok) {
          await fetchPageData();
          showToast.success(toastMessages.pages.updated);
        } else {
          showToast.error(toastMessages.pages.error);
        }
      }

      setEditingId(null);
      setEditingType(null);
      setEditingData({});
    } catch (error) {
      console.error('Failed to save:', error);
      showToast.error(toastMessages.pages.error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingType(null);
    setEditingData({});
  };

  const handleAddSection = async () => {
    if (!pageData || adding) return;

    setAdding(true);
    const newSection = {
      title: 'New Section',
      content: '<p>섹션 내용을 입력하세요...</p>',
      order: (pageData.sections?.length || 0),
      layout: 'full-width',
      pageId: pageData.id
    };

    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection)
      });

      if (response.ok) {
        const newData = await response.json();

        // Optimistically update UI
        setPageData({
          ...pageData,
          sections: [...(pageData.sections || []), newData]
        });

        setEditingId(newData.id);
        setEditingType('section');
        setEditingData({ ...newData });
        showToast.success('새 섹션이 추가되었습니다');
      } else {
        showToast.error(toastMessages.pages.error);
      }
    } catch (error) {
      console.error('Failed to create section:', error);
      showToast.error(toastMessages.pages.error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;

    setDeleting(sectionId);
    try {
      const response = await fetch(`/api/admin/sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPageData();
        showToast.success(toastMessages.pages.sectionDeleted);
      } else {
        showToast.error(toastMessages.pages.error);
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
      showToast.error(toastMessages.pages.error);
    } finally {
      setDeleting(null);
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
        <h1>About Us 페이지 편집</h1>
        <p className={styles.helpText}>
          {editingId ? (
            <>
              <span className={styles.editingIndicator}>✏️ 편집 중</span>
              <span className={styles.separator}>•</span>
              <span>아래 저장 버튼을 눌러 변경사항을 저장하세요</span>
            </>
          ) : (
            <>섹션 위에 마우스를 올리고 <strong>연필 아이콘(✏️)</strong>을 클릭하여 편집하세요</>
          )}
        </p>
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
                  <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? '⏳' : '✓'}
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    ✕
                  </button>
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
                      <button
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? '⏳' : '✓'}
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(section.id, 'section', section)}
                        disabled={deleting === section.id}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteSection(section.id)}
                        disabled={deleting === section.id}
                      >
                        {deleting === section.id ? '⏳' : '✕'}
                      </button>
                    </>
                  )}
                </div>
              )}

              <section className={`${styles.section} ${section.title === 'Lab Director' ? styles.directorSection : ''}`}>
                {editingId === section.id && editingType === 'section' ? (
                  <div className={styles.editingContainer}>
                    <div className={styles.editingHeader}>
                      <span className={styles.editingBadge}>편집 중</span>
                      <span className={styles.sectionName}>{section.title}</span>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>섹션 제목</label>
                      <input
                        type="text"
                        value={editingData.title || ''}
                        onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        className={styles.editSectionTitle}
                        placeholder="섹션 제목을 입력하세요"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>레이아웃 스타일</label>
                      <div className={styles.layoutSelector}>
                        <button
                          type="button"
                          className={`${styles.layoutOption} ${editingData.layout === 'full-width' ? styles.active : ''}`}
                          onClick={() => setEditingData({ ...editingData, layout: 'full-width' })}
                        >
                          <div className={styles.layoutIcon}>▭</div>
                          <span>기본</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.layoutOption} ${editingData.layout === 'centered' ? styles.active : ''}`}
                          onClick={() => setEditingData({ ...editingData, layout: 'centered' })}
                        >
                          <div className={styles.layoutIcon}>▬</div>
                          <span>중앙</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.layoutOption} ${editingData.layout === 'highlight' ? styles.active : ''}`}
                          onClick={() => setEditingData({ ...editingData, layout: 'highlight' })}
                        >
                          <div className={styles.layoutIcon}>┃</div>
                          <span>강조</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.layoutOption} ${editingData.layout === 'grid' ? styles.active : ''}`}
                          onClick={() => setEditingData({ ...editingData, layout: 'grid' })}
                        >
                          <div className={styles.layoutIcon}>▦</div>
                          <span>그리드</span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      {editingData.layout === 'grid' ? (
                        <>
                          <label className={styles.fieldLabel}>
                            섹션 설명
                            <span className={styles.fieldHint}>💡 그리드 카드 위에 표시될 설명입니다</span>
                          </label>
                          <textarea
                            value={(() => {
                              try {
                                const parsed: GridSectionData = JSON.parse(editingData.content || '{"cards":[]}');
                                return parsed.description || '';
                              } catch {
                                return '';
                              }
                            })()}
                            onChange={(e) => {
                              try {
                                const parsed: GridSectionData = JSON.parse(editingData.content || '{"cards":[]}');
                                parsed.description = e.target.value;
                                setEditingData({ ...editingData, content: JSON.stringify(parsed) });
                              } catch {
                                setEditingData({ ...editingData, content: JSON.stringify({ description: e.target.value, cards: [] }) });
                              }
                            }}
                            className={styles.editSectionContent}
                            placeholder="섹션 설명을 입력하세요..."
                            rows={2}
                          />

                          <label className={styles.fieldLabel} style={{ marginTop: '1.5rem' }}>
                            그리드 카드 내용
                            <span className={styles.fieldHint}>💡 각 카드는 그리드 형태로 배치됩니다</span>
                          </label>
                          <GridCardEditor
                            cards={(() => {
                              try {
                                const parsed: GridSectionData = JSON.parse(editingData.content || '{"cards":[]}');
                                return Array.isArray(parsed.cards) ? parsed.cards : [];
                              } catch {
                                return [];
                              }
                            })()}
                            onChange={(cards) => {
                              try {
                                const parsed: GridSectionData = JSON.parse(editingData.content || '{"cards":[]}');
                                parsed.cards = cards;
                                setEditingData({ ...editingData, content: JSON.stringify(parsed) });
                              } catch {
                                setEditingData({ ...editingData, content: JSON.stringify({ cards }) });
                              }
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <label className={styles.fieldLabel}>
                            섹션 내용
                            <span className={styles.fieldHint}>💡 텍스트를 선택하고 도구 버튼으로 서식을 지정하세요 (볼드, 이탤릭, 링크 등)</span>
                          </label>
                          <RichTextEditor
                            content={editingData.content || ''}
                            onChange={(html) => setEditingData({ ...editingData, content: html })}
                            placeholder="섹션 내용을 입력하세요..."
                          />
                        </>
                      )}
                    </div>

                    <div className={styles.actionButtons}>
                      <button
                        className={styles.saveBtnLarge}
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? '⏳ 저장 중...' : '✓ 저장하기'}
                      </button>
                      <button
                        className={styles.cancelBtnLarge}
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        ✕ 취소
                      </button>
                    </div>
                  </div>
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
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(section.content, {
                          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'div', 'span'],
                          ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class']
                        })
                      }}
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
            <button
              className={styles.addNewBtn}
              onClick={handleAddSection}
              disabled={adding}
            >
              <div className={styles.addNewContent}>
                {adding ? (
                  <>
                    <div className={styles.addIcon}>⏳</div>
                    <span>섹션 추가 중...</span>
                  </>
                ) : (
                  <>
                    <div className={styles.addIcon}>+</div>
                    <span>새 섹션 추가</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}