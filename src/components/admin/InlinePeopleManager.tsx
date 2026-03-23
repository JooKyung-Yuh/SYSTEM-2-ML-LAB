'use client';

import { useState, useEffect } from 'react';
import styles from './InlinePeopleManager.module.css';
import { showToast, toastMessages } from '@/lib/toast';

interface Person {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  image: string | null;
  bio: string | null;
  category: string;
  education: string | null;
  researchArea: string | null;
  googleScholar: string | null;
  startYear: number | null;
  endYear: number | null;
  order: number;
  published: boolean;
}

export default function InlinePeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Person>>({});
  const [originalData, setOriginalData] = useState<Partial<Person>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchPeople();
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

  const fetchPeople = async () => {
    try {
      const response = await fetch('/api/admin/people');
      if (response.ok) {
        const data = await response.json();
        setPeople(data.sort((a: Person, b: Person) => {
          if (a.category !== b.category) {
            const categoryOrder = ["faculty", "student", "alumni"];
            return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
          }
          return a.order - b.order;
        }));
      }
    } catch (error) {
      console.error('Failed to fetch people:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (person: Person) => {
    const personData = { ...person };
    setEditingId(person.id);
    setEditingData(personData);
    setOriginalData(personData);
  };

  const handleSave = async () => {
    if (!editingId || !editingData || saving) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/people/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });

      if (response.ok) {
        const updatedData = await response.json();

        const updatedItems = people.map(person =>
          person.id === editingId ? updatedData : person
        );
        updatedItems.sort((a, b) => {
          if (a.category !== b.category) {
            const categoryOrder = ["faculty", "student", "alumni"];
            return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
          }
          return a.order - b.order;
        });
        setPeople(updatedItems);

        setEditingId(null);
        setEditingData({});
        setOriginalData({});
        showToast.success(toastMessages.people.updated);
      } else {
        showToast.error(toastMessages.people.error);
      }
    } catch (error) {
      console.error('Failed to save person:', error);
      showToast.error(toastMessages.people.error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
    setOriginalData({});
  };

  const handleImageUpload = async (personId: string, file: File) => {
    if (!file) return;

    setUploading(personId);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setEditingData({ ...editingData, image: data.url });
        showToast.success('이미지가 업로드되었습니다');
      } else {
        const error = await response.json();
        showToast.error(error.error || '이미지 업로드 실패');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      showToast.error('이미지 업로드 중 오류가 발생했습니다');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (personId: string) => {
    if (!confirm('이 팀원을 삭제하시겠습니까?')) return;

    setDeleting(personId);
    try {
      const response = await fetch(`/api/admin/people/${personId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const filteredItems = people.filter(person => person.id !== personId);
        setPeople(filteredItems);
        showToast.success(toastMessages.people.deleted);
      } else {
        showToast.error(toastMessages.people.error);
      }
    } catch (error) {
      console.error('Failed to delete person:', error);
      showToast.error(toastMessages.people.error);
    } finally {
      setDeleting(null);
    }
  };

  const handleAddNew = async (afterIndex?: number, category?: string) => {
    let newOrder;
    let newCategory = category || 'faculty';

    if (afterIndex === undefined) {
      newOrder = (people[people.length - 1]?.order || 0) + 1;
    } else {
      const currentOrder = people[afterIndex]?.order || 0;
      const nextOrder = people[afterIndex + 1]?.order || currentOrder + 2;
      newOrder = currentOrder + (nextOrder - currentOrder) / 2;
      newCategory = people[afterIndex]?.category || 'faculty';
    }

    const optimisticId = `temp-${Date.now()}`;
    const optimisticItem = {
      id: optimisticId,
      name: 'New Team Member',
      title: null,
      email: null,
      phone: null,
      website: null,
      image: null,
      bio: null,
      education: null,
      researchArea: null,
      googleScholar: null,
      startYear: null,
      endYear: null,
      category: newCategory,
      order: newOrder,
      published: true
    };

    const snapshotItems = [...people];
    const optimisticItems = [...people];
    if (afterIndex === undefined) {
      optimisticItems.push(optimisticItem);
    } else {
      optimisticItems.splice(afterIndex + 1, 0, optimisticItem);
    }
    optimisticItems.sort((a, b) => {
      if (a.category !== b.category) {
        const categoryOrder = ["faculty", "student", "alumni"];
        return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      }
      return a.order - b.order;
    });

    setPeople(optimisticItems);
    const personData = { ...optimisticItem };
    setEditingId(optimisticId);
    setEditingData(personData);
    setOriginalData(personData);
    
    requestAnimationFrame(() => {
      const element = document.querySelector(`[data-person-id="${optimisticId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    fetch('/api/admin/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: optimisticItem.name,
        title: optimisticItem.title,
        email: optimisticItem.email,
        phone: optimisticItem.phone,
        website: optimisticItem.website,
        image: optimisticItem.image,
        bio: optimisticItem.bio,
        education: optimisticItem.education,
        researchArea: optimisticItem.researchArea,
        googleScholar: optimisticItem.googleScholar,
        startYear: optimisticItem.startYear,
        endYear: optimisticItem.endYear,
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
      setPeople(currentItems =>
        currentItems.map(person =>
          person.id === optimisticId ? newData : person
        )
      );

      setEditingId(currentId => currentId === optimisticId ? newData.id : currentId);
      setEditingData(currentData => {
        if (currentData.id === optimisticId) {
          return { ...newData };
        }
        return currentData;
      });
      setOriginalData(currentData => {
        if (currentData.id === optimisticId) {
          return { ...newData };
        }
        return currentData;
      });
      showToast.success(toastMessages.people.created);

      setTimeout(() => {
        const element = document.querySelector(`[data-person-id="${newData.id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    })
    .catch(error => {
      console.error('Failed to create person:', error);
      setPeople(snapshotItems);
      setEditingId(null);
      setEditingData({});
      setOriginalData({});
      showToast.error(toastMessages.people.error);
      });
  };

  const groupedPeople = people.reduce((acc, person) => {
    if (!acc[person.category]) {
      acc[person.category] = [];
    }
    acc[person.category].push(person);
    return acc;
  }, {} as Record<string, Person[]>);

  const categoryOrder = ["faculty", "postdoc", "phd", "ms_phd", "ms", "intern", "alumni"];
  const categoryLabels: Record<string, string> = {
    faculty: "Faculty",
    postdoc: "Postdoctoral Researchers",
    phd: "Ph.D. Students",
    ms_phd: "M.S./Ph.D. Students",
    ms: "M.S. Students",
    intern: "Undergraduate Interns",
    alumni: "Alumni",
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading team members...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} inline-editor`}>
      {editingId && <div className={styles.overlay} onClick={handleEscapeKey} />}

      <div className={styles.header}>
        <h1>People</h1>
        <p>Click on any person to edit their information, hover to see controls. Press ESC to exit editing.</p>
      </div>

      <div className={styles.peopleGrid}>
        {categoryOrder.map((category) => {
          const members = groupedPeople[category] || [];
          if (members.length === 0 && !editingId) return null;

          return (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>
                {categoryLabels[category] || category}
              </h2>

              {members.map((person, index) => (
                <div
                  key={person.id}
                  data-person-id={person.id}
                  className={`${styles.personItem} ${editingId === person.id ? styles.editing : ''}`}
                  onMouseEnter={() => setHoveredId(person.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {(hoveredId === person.id || editingId === person.id) && (
                    <div className={styles.controls}>
                      {editingId === person.id ? (
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
                            onClick={() => handleEdit(person)}
                            disabled={deleting === person.id}
                          >
                            ✏️
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(person.id)}
                            disabled={deleting === person.id}
                          >
                            {deleting === person.id ? '⏳' : '✕'}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <div className={styles.personCard}>
                    <div className={styles.personImageContainer}>
                      {editingId === person.id ? (
                        <div className={styles.imageUploadWrapper}>
                          {editingData.image && (
                            <img
                              src={editingData.image}
                              alt="Preview"
                              className={styles.imagePreview}
                            />
                          )}
                          <label className={styles.imageUploadLabel}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(person.id, file);
                              }}
                              className={styles.imageInput}
                              disabled={uploading === person.id}
                            />
                            <span className={styles.uploadButtonText}>
                              {uploading === person.id ? '⏳ 업로드 중...' : editingData.image ? '📷 이미지 변경' : '📷 이미지 업로드'}
                            </span>
                          </label>
                          {editingData.image && (
                            <button
                              type="button"
                              onClick={() => setEditingData({ ...editingData, image: null })}
                              className={styles.removeImageBtn}
                            >
                              ✕ 제거
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          {person.image ? (
                            <img
                              src={person.image}
                              alt={person.name}
                              className={styles.personImage}
                            />
                          ) : (
                            <div className={styles.personImagePlaceholder}>
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className={styles.personContent}>
                      {editingId === person.id ? (
                        <>
                          <input
                            type="text"
                            value={editingData.name || ''}
                            onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                            className={styles.editName}
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={editingData.title || ''}
                            onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                            className={styles.editTitle}
                            placeholder="Title"
                          />
                          <input
                            type="email"
                            value={editingData.email || ''}
                            onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                            className={styles.editEmail}
                            placeholder="Email"
                          />
                          <input
                            type="tel"
                            value={editingData.phone || ''}
                            onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                            className={styles.editPhone}
                            placeholder="Phone"
                          />
                          <input
                            type="url"
                            value={editingData.website || ''}
                            onChange={(e) => setEditingData({ ...editingData, website: e.target.value })}
                            className={styles.editWebsite}
                            placeholder="Website"
                          />
                          <select
                            value={editingData.category || 'faculty'}
                            onChange={(e) => setEditingData({ ...editingData, category: e.target.value })}
                            className={styles.editCategory}
                          >
                            <option value="faculty">Faculty</option>
                            <option value="postdoc">Postdoc</option>
                            <option value="phd">Ph.D. Student</option>
                            <option value="ms_phd">M.S./Ph.D. Student</option>
                            <option value="ms">M.S. Student</option>
                            <option value="intern">Undergraduate Intern</option>
                            <option value="alumni">Alumni</option>
                          </select>
                          <input
                            type="text"
                            value={editingData.education || ''}
                            onChange={(e) => setEditingData({ ...editingData, education: e.target.value })}
                            className={styles.editEmail}
                            placeholder="Education (e.g., B.S. Korea University)"
                          />
                          <input
                            type="text"
                            value={editingData.researchArea || ''}
                            onChange={(e) => setEditingData({ ...editingData, researchArea: e.target.value })}
                            className={styles.editEmail}
                            placeholder="Research Area (e.g., Meta-Learning, LLM Reasoning)"
                          />
                          <input
                            type="url"
                            value={editingData.googleScholar || ''}
                            onChange={(e) => setEditingData({ ...editingData, googleScholar: e.target.value })}
                            className={styles.editWebsite}
                            placeholder="Google Scholar URL"
                          />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="number"
                              value={editingData.startYear || ''}
                              onChange={(e) => setEditingData({ ...editingData, startYear: e.target.value ? parseInt(e.target.value) : null })}
                              className={styles.editPhone}
                              placeholder="Start Year"
                              min={2000}
                              max={2100}
                            />
                            <input
                              type="number"
                              value={editingData.endYear || ''}
                              onChange={(e) => setEditingData({ ...editingData, endYear: e.target.value ? parseInt(e.target.value) : null })}
                              className={styles.editPhone}
                              placeholder="End Year (alumni)"
                              min={2000}
                              max={2100}
                            />
                          </div>
                          <textarea
                            value={editingData.bio || ''}
                            onChange={(e) => setEditingData({ ...editingData, bio: e.target.value })}
                            className={styles.editBio}
                            placeholder="Bio (optional)"
                            rows={3}
                          />
                        </>
                      ) : (
                        <>
                          <h3
                            className={styles.personName}
                            onClick={() => handleEdit(person)}
                          >
                            {person.name}
                          </h3>
                          {person.title && (
                            <p
                              className={styles.personTitle}
                              onClick={() => handleEdit(person)}
                            >
                              {person.title}
                            </p>
                          )}
                          <div className={styles.personContacts}>
                            {person.email && (
                              <a href={`mailto:${person.email}`} className={styles.personEmail}>
                                {person.email}
                              </a>
                            )}
                            {person.phone && (
                              <span className={styles.personPhone}>
                                {person.phone}
                              </span>
                            )}
                            {person.website && (
                              <a href={person.website} target="_blank" rel="noopener noreferrer" className={styles.personWebsite}>
                                Website
                              </a>
                            )}
                          </div>
                          {person.bio && (
                            <p
                              className={styles.personBio}
                              onClick={() => handleEdit(person)}
                            >
                              {person.bio}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {(hoveredId === person.id && !editingId) && (
                    <div className={styles.addBetween}>
                      <button
                        className={styles.addBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddNew(index, person.category);
                        }}
                      >
                        + Add After
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {!editingId && (
                <div className={styles.addNewContainer}>
                  <button
                    className={styles.addNewBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNew(undefined, category);
                    }}
                  >
                    <div className={styles.addNewContent}>
                      <div className={styles.addIcon}>+</div>
                      <span>Add New {categoryLabels[category] || category}</span>
                    </div>
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}