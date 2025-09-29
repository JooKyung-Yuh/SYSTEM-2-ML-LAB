'use client';

import { useState, useEffect } from 'react';
import styles from './Manager.module.css';

interface Person {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  bio: string | null;
  category: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['faculty', 'student', 'alumni'];

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch('/api/admin/people');
      if (response.ok) {
        const data = await response.json();
        setPeople(data);
      }
    } catch (error) {
      console.error('Failed to fetch people:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const personData = {
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
      category: formData.get('category') as string,
      order: parseInt(formData.get('order') as string) || 0,
      published: formData.get('published') === 'on'
    };

    try {
      const url = editingPerson
        ? `/api/admin/people/${editingPerson.id}`
        : '/api/admin/people';

      const response = await fetch(url, {
        method: editingPerson ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData)
      });

      if (response.ok) {
        fetchPeople();
        setEditingPerson(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save person:', error);
    }
  };

  const handleDelete = async (personId: string) => {
    if (!confirm('Are you sure you want to delete this person?')) return;

    try {
      const response = await fetch(`/api/admin/people/${personId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPeople();
      }
    } catch (error) {
      console.error('Failed to delete person:', error);
    }
  };

  const handleTogglePublished = async (person: Person) => {
    try {
      const response = await fetch(`/api/admin/people/${person.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...person, published: !person.published })
      });

      if (response.ok) {
        fetchPeople();
      }
    } catch (error) {
      console.error('Failed to update person:', error);
    }
  };

  const filteredPeople = selectedCategory === 'all'
    ? people
    : people.filter(person => person.category === selectedCategory);

  if (loading) {
    return <div className={styles.loading}>Loading people...</div>;
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>People Management</h2>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingPerson(null);
            setShowForm(true);
          }}
        >
          Add Person
        </button>
      </div>

      {/* Category Filter */}
      <div className={styles.filters}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* People Grid */}
      <div className={styles.grid}>
        {filteredPeople
          .sort((a, b) => a.order - b.order)
          .map((person) => (
            <div key={person.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={styles.cardInfo}>
                  <h3>{person.name}</h3>
                  <p className={styles.title}>{person.title}</p>
                  <span className={`${styles.category} ${styles[person.category]}`}>
                    {person.category}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={`${styles.toggleBtn} ${person.published ? styles.published : styles.unpublished}`}
                    onClick={() => handleTogglePublished(person)}
                  >
                    {person.published ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>

              <div className={styles.cardContent}>
                {person.email && (
                  <p className={styles.contact}>
                    <strong>Email:</strong> {person.email}
                  </p>
                )}
                {person.phone && (
                  <p className={styles.contact}>
                    <strong>Phone:</strong> {person.phone}
                  </p>
                )}
                {person.bio && (
                  <p className={styles.bio}>
                    {person.bio.substring(0, 150)}
                    {person.bio.length > 150 ? '...' : ''}
                  </p>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditingPerson(person);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(person.id)}
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
              <h3>{editingPerson ? 'Edit Person' : 'Add New Person'}</h3>
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
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={editingPerson?.name || ''}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={editingPerson?.title || ''}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={editingPerson?.email || ''}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={editingPerson?.phone || ''}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingPerson?.category || 'faculty'}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="order">Order</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    defaultValue={editingPerson?.order || 0}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  defaultValue={editingPerson?.bio || ''}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editingPerson?.published ?? true}
                  />
                  Published
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                  {editingPerson ? 'Update Person' : 'Add Person'}
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