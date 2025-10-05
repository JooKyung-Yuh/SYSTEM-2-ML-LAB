'use client';

import { useState, useEffect } from 'react';
import styles from './InlineCoursesManager.module.css';
import { showToast, toastMessages } from '@/lib/toast';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string | null;
  semester: string;
  year: number;
  instructor: string;
  credits: number | null;
  syllabus: string | null;
  published: boolean;
  order: number;
}

export default function InlineCoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Course>>({});
  const [originalData, setOriginalData] = useState<Partial<Course>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
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

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.sort((a: Course, b: Course) => {
          if (b.year !== a.year) return b.year - a.year;
          const semesterOrder = ['Spring', 'Summer', 'Fall', 'Winter'];
          return semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester);
        }));
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Course) => {
    setEditingId(item.id);
    setEditingData({ ...item });
    setOriginalData({ ...item });
    setPreviewMode(false);
  };

  const handleSave = async () => {
    if (!editingId || !editingData || saving) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/courses/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        const updatedItems = courses.map(item =>
          item.id === editingId ? updatedData : item
        );
        updatedItems.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          const semesterOrder = ['Spring', 'Summer', 'Fall', 'Winter'];
          return semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester);
        });
        setCourses(updatedItems);
        setEditingId(null);
        setEditingData({});
        setOriginalData({});
        showToast.success(toastMessages.courses.updated);
      } else {
        showToast.error(toastMessages.courses.error);
      }
    } catch (error) {
      console.error('Failed to save course:', error);
      showToast.error(toastMessages.courses.error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
    setOriginalData({});
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('이 강의를 삭제하시겠습니까?')) return;

    setDeleting(itemId);
    try {
      const response = await fetch(`/api/admin/courses/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const filteredItems = courses.filter(item => item.id !== itemId);
        setCourses(filteredItems);
        showToast.success(toastMessages.courses.deleted);
      } else {
        showToast.error(toastMessages.courses.error);
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
      showToast.error(toastMessages.courses.error);
    } finally {
      setDeleting(null);
    }
  };

  const handleAddNew = async () => {
    const currentYear = new Date().getFullYear();
    const newOrder = (courses[0]?.order || 0) + 1;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticItem = {
      id: optimisticId,
      code: 'ELEC000',
      title: 'New Course Title',
      description: 'Course description...',
      semester: 'Fall',
      year: currentYear,
      instructor: 'Instructor Name',
      credits: 3,
      syllabus: null,
      published: true,
      order: newOrder
    };

    const optimisticItems = [optimisticItem, ...courses];
    setCourses(optimisticItems);
    const itemData = { ...optimisticItem };
    setEditingId(optimisticId);
    setEditingData(itemData);
    setOriginalData(itemData);
    setPreviewMode(false);

    requestAnimationFrame(() => {
      const element = document.querySelector(`[data-course-id="${optimisticId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    fetch('/api/admin/courses', {
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
      setCourses(currentItems =>
        currentItems.map(item =>
          item.id === optimisticId ? newData : item
        )
      );
      setEditingId(currentId => currentId === optimisticId ? newData.id : currentId);
      setEditingData(currentData => currentData.id === optimisticId ? { ...newData } : currentData);
      setOriginalData(currentData => currentData.id === optimisticId ? { ...newData } : currentData);
      showToast.success(toastMessages.courses.created);

      setTimeout(() => {
        const element = document.querySelector(`[data-course-id="${newData.id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    })
    .catch(error => {
      console.error('Failed to create course:', error);
      setCourses(courses);
      setEditingId(null);
      setEditingData({});
      setOriginalData({});
      showToast.error(toastMessages.courses.error);
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} inline-editor`}>
      {editingId && <div className={styles.overlay} onClick={handleEscapeKey} />}

      <div className={styles.header}>
        <h1>Courses</h1>
        <div className={styles.headerActions}>
          <p>Click on any course to edit. Press ESC to exit editing.</p>
          <button
            className={styles.togglePreviewBtn}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? '📝 Edit Mode' : '👁️ Preview Mode'}
          </button>
        </div>
      </div>

      {previewMode && !editingId ? (
        // Preview Mode
        <div className={styles.previewContainer}>
          <div className={styles.coursesPreview}>
            {courses.map((course) => (
              <div
                key={course.id}
                data-course-id={course.id}
                className={styles.coursePreview}
                onMouseEnter={() => setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {hoveredId === course.id && (
                  <div className={styles.previewControls}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(course)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                )}
                <div className={styles.courseEntry}>
                  <div className={styles.courseHeader}>
                    <div>
                      <h3 className={styles.courseTitle}>
                        {course.code}: {course.title}
                      </h3>
                      <p className={styles.courseInstructor}>{course.instructor}</p>
                    </div>
                    <div className={styles.courseMeta}>
                      <span className={styles.courseSemester}>{course.semester} {course.year}</span>
                      {course.credits && (
                        <span className={styles.courseCredits}>{course.credits} credits</span>
                      )}
                    </div>
                  </div>
                  {course.description && (
                    <p className={styles.courseDescription}>{course.description}</p>
                  )}
                  {course.syllabus && (
                    <a
                      href={course.syllabus}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.syllabusLink}
                    >
                      📄 Syllabus
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addNewContainer}>
            <button className={styles.addNewBtn} onClick={handleAddNew}>
              <div className={styles.addNewContent}>
                <div className={styles.addIcon}>+</div>
                <span>Add New Course</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <div
              key={course.id}
              data-course-id={course.id}
              className={`${styles.courseItem} ${editingId === course.id ? styles.editing : ''}`}
              onMouseEnter={() => setHoveredId(course.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {(hoveredId === course.id || editingId === course.id) && (
                <div className={styles.controls}>
                  {editingId === course.id ? (
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
                        onClick={() => handleEdit(course)}
                        disabled={deleting === course.id}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(course.id)}
                        disabled={deleting === course.id}
                      >
                        {deleting === course.id ? '⏳' : '✕'}
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className={styles.courseCard}>
                {editingId === course.id ? (
                  <>
                    <div className={styles.editRow}>
                      <input
                        type="text"
                        value={editingData.code || ''}
                        onChange={(e) => setEditingData({ ...editingData, code: e.target.value })}
                        className={styles.editCode}
                        placeholder="Course Code"
                      />
                      <input
                        type="number"
                        value={editingData.credits || ''}
                        onChange={(e) => setEditingData({ ...editingData, credits: parseInt(e.target.value) })}
                        className={styles.editCredits}
                        placeholder="Credits"
                      />
                    </div>
                    <input
                      type="text"
                      value={editingData.title || ''}
                      onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                      className={styles.editTitle}
                      placeholder="Course Title"
                    />
                    <input
                      type="text"
                      value={editingData.instructor || ''}
                      onChange={(e) => setEditingData({ ...editingData, instructor: e.target.value })}
                      className={styles.editInstructor}
                      placeholder="Instructor"
                    />
                    <div className={styles.editRow}>
                      <select
                        value={editingData.semester || 'Fall'}
                        onChange={(e) => setEditingData({ ...editingData, semester: e.target.value })}
                        className={styles.editSemester}
                      >
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Fall">Fall</option>
                        <option value="Winter">Winter</option>
                      </select>
                      <input
                        type="number"
                        value={editingData.year || ''}
                        onChange={(e) => setEditingData({ ...editingData, year: parseInt(e.target.value) })}
                        className={styles.editYear}
                        placeholder="Year"
                      />
                    </div>
                    <textarea
                      value={editingData.description || ''}
                      onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                      className={styles.editDescription}
                      placeholder="Course Description"
                      rows={3}
                    />
                    <input
                      type="url"
                      value={editingData.syllabus || ''}
                      onChange={(e) => setEditingData({ ...editingData, syllabus: e.target.value })}
                      className={styles.editSyllabus}
                      placeholder="Syllabus URL (optional)"
                    />
                  </>
                ) : (
                  <>
                    <div className={styles.courseHeader}>
                      <div className={styles.courseCode}>{course.code}</div>
                      {course.credits && (
                        <div className={styles.courseCredits}>{course.credits} credits</div>
                      )}
                    </div>
                    <h3
                      className={styles.courseTitle}
                      onClick={() => handleEdit(course)}
                    >
                      {course.title}
                    </h3>
                    <p
                      className={styles.courseInstructor}
                      onClick={() => handleEdit(course)}
                    >
                      {course.instructor}
                    </p>
                    <div className={styles.courseMeta}>
                      <span className={styles.courseSemester}>
                        {course.semester} {course.year}
                      </span>
                    </div>
                    {course.description && (
                      <p
                        className={styles.courseDescription}
                        onClick={() => handleEdit(course)}
                      >
                        {course.description}
                      </p>
                    )}
                    {course.syllabus && (
                      <a
                        href={course.syllabus}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.syllabusLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        📄 Syllabus
                      </a>
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
                  <span>Add New Course</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
