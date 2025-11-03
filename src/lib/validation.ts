import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Settings validation schemas
export const updateSettingsSchema = z.object({
  showNewsCarousel: z.boolean().optional(),
  showRecruitmentBanner: z.boolean().optional(),
}).strict();

// People validation schemas
export const createPersonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  title: z.string().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required').max(100, 'Category is too long'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().max(50, 'Phone is too long').optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  image: z.string().max(500, 'Image URL is too long').optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const updatePersonSchema = createPersonSchema.partial();

// Publication validation schemas
export const createPublicationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  authors: z.string().min(1, 'Authors are required'),
  venue: z.string().min(1, 'Venue is required').max(200, 'Venue is too long'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  url: z.string().optional().or(z.literal('')),
  pdfUrl: z.string().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required').max(100, 'Category is too long'),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const updatePublicationSchema = createPublicationSchema.partial();

// News validation schemas
export const newsLinkSchema = z.object({
  text: z.string().min(1, 'Text is required').max(100, 'Text is too long'),
  url: z.string().url('Invalid URL format'),
});

export const createNewsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required'),
  order: z.number().int().min(0).optional(),
  links: z.array(newsLinkSchema).optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

// Course validation schemas
export const createCourseSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code is too long'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  semester: z.string().min(1, 'Semester is required').max(50, 'Semester is too long'),
  year: z.number().int().min(2000).max(2100),
  instructor: z.string().min(1, 'Instructor is required').max(100, 'Instructor is too long'),
  description: z.string().optional().or(z.literal('')),
  credits: z.number().int().min(0).max(10).optional(),
  syllabus: z.string().max(500, 'Syllabus URL is too long').optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

// Page/Section validation schemas
export const createSectionSchema = z.object({
  pageId: z.string().min(1, 'Page ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  layout: z.string().min(1, 'Layout is required').max(50, 'Layout is too long'),
  order: z.number().int().min(0),
});

export const updateSectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  layout: z.string().min(1, 'Layout is required').max(50, 'Layout is too long').optional(),
  order: z.number().int().min(0).optional(),
});

// Gallery validation schemas
export const createGalleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional().or(z.literal('')),
  image: z.string().min(1, 'Image is required').max(500, 'Image URL is too long'),
  category: z.string().max(100, 'Category is too long').optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial();

// File upload validation
// Note: File validation is done in the upload route handlers directly
// since File is a browser API and not available in Node.js server environment

// Helper function to validate request body
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
}
