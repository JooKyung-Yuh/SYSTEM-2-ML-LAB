'use client';

import { useState, useEffect } from 'react';
import styles from './Manager.module.css';

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
  createdAt: string;
  updatedAt: string;
}

export default function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const semesters = ['Spring', 'Summer', 'Fall', 'Winter'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const courseData = {
      code: formData.get('code') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      semester: formData.get('semester') as string,
      year: parseInt(formData.get('year') as string),
      instructor: formData.get('instructor') as string,
      credits: parseInt(formData.get('credits') as string) || null,
      syllabus: formData.get('syllabus') as string,
      order: parseInt(formData.get('order') as string) || 0,
      published: formData.get('published') === 'on'
    };

    try {
      const url = editingCourse
        ? `/api/admin/courses/${editingCourse.id}`
        : '/api/admin/courses';

      const response = await fetch(url, {
        method: editingCourse ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        fetchCourses();
        setEditingCourse(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleTogglePublished = async (course: Course) => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...course, published: !course.published })
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (selectedSemester !== 'all' && course.semester !== selectedSemester) return false;
    if (selectedYear !== 'all' && course.year.toString() !== selectedYear) return false;
    return true;
  });

  const years = [...new Set(courses.map(course => course.year.toString()))].sort((a, b) => parseInt(b) - parseInt(a));

  if (loading) {
    return <div className={styles.loading}>Loading courses...</div>;
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Courses Management</h2>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingCourse(null);
            setShowForm(true);
          }}
        >
          Add Course
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Semesters</option>
          {semesters.map(semester => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Grid */}
      <div className={styles.grid}>
        {filteredCourses
          .sort((a, b) => b.year - a.year || a.order - b.order)
          .map((course) => (
            <div key={course.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.courseInfo}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseCode}>{course.code}</p>
                  <div className={styles.courseMeta}>
                    <span className={styles.semester}>{course.semester} {course.year}</span>
                    <span className={styles.instructor}>{course.instructor}</span>
                    {course.credits && (
                      <span className={styles.credits}>{course.credits} credits</span>
                    )}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={`${styles.toggleBtn} ${course.published ? styles.published : styles.unpublished}`}
                    onClick={() => handleTogglePublished(course)}
                  >
                    {course.published ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>

              <div className={styles.cardContent}>
                {course.description && (
                  <p className={styles.description}>
                    {course.description.substring(0, 150)}
                    {course.description.length > 150 ? '...' : ''}
                  </p>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditingCourse(course);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="code">Course Code *</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    defaultValue={editingCourse?.code || ''}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={editingCourse?.title || ''}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="semester">Semester *</label>
                  <select
                    id="semester"
                    name="semester"
                    defaultValue={editingCourse?.semester || 'Fall'}
                    required
                  >
                    {semesters.map(semester => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="year">Year *</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    defaultValue={editingCourse?.year || new Date().getFullYear()}
                    min="2000"
                    max="2100"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="instructor">Instructor *</label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    defaultValue={editingCourse?.instructor || ''}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="credits">Credits</label>
                  <input
                    type="number"
                    id="credits"
                    name="credits"
                    defaultValue={editingCourse?.credits || ''}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="order">Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  defaultValue={editingCourse?.order || 0}
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={editingCourse?.description || ''}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="syllabus">Syllabus</label>
                <textarea
                  id="syllabus"
                  name="syllabus"
                  rows={6}
                  defaultValue={editingCourse?.syllabus || ''}
                  placeholder="Course syllabus, topics covered, prerequisites, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editingCourse?.published ?? true}
                  />
                  Published
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}