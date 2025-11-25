import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  priority: text('priority').notNull().default('medium'),
  createdAt: text('created_at').notNull(),
});

export const dashboardNotes = sqliteTable('dashboard_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  timestamp: text('timestamp').notNull(),
  createdAt: text('created_at').notNull(),
});

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  streak: integer('streak').notNull().default(0),
  checkedToday: integer('checked_today', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export const bookmarks = sqliteTable('bookmarks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  url: text('url').notNull(),
  category: text('category').notNull(),
  createdAt: text('created_at').notNull(),
});

export const toolNotes = sqliteTable('tool_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  timestamp: text('timestamp').notNull(),
  createdAt: text('created_at').notNull(),
});

export const toolFiles = sqliteTable('tool_files', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  size: text('size').notNull(),
  timestamp: text('timestamp').notNull(),
  createdAt: text('created_at').notNull(),
});

export const communityPosts = sqliteTable('community_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  author: text('author').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  createdAt: text('created_at').notNull(),
});

export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});