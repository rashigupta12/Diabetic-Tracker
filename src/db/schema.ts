// db/schema.ts
import { pgTable, serial, integer, timestamp, text, decimal, boolean, pgEnum, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Create an enum for meal types
export const mealTypeEnum = pgEnum('meal_type', [
  'before_breakfast', 
  'after_breakfast', 
  'before_lunch', 
  'after_lunch', 
  'before_dinner', 
  'after_dinner', 
  'bedtime'
]);

// User authentication table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (users) => {
  return {
    emailIndex: uniqueIndex('email_idx').on(users.email),
  };
});

// User sessions table
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Simple blood sugar readings table
export const bloodSugarReadings = pgTable('blood_sugar_readings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  glucose: integer('glucose').notNull(), // mg/dL
  readingTime: timestamp('reading_time', { withTimezone: true }).defaultNow().notNull(),
  mealType: mealTypeEnum('meal_type').notNull(),
  notes: text('notes'), // Optional notes
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Medication tracking (simple)
export const medications = pgTable('medications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  dosage: text('dosage').notNull(), // e.g., "10mg", "5 units"
  frequency: text('frequency').notNull(), // e.g., "Once daily", "Twice daily"
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Daily medication logs (did they take it?)
export const medicationLogs = pgTable('medication_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  medicationId: integer('medication_id').references(() => medications.id, { onDelete: 'cascade' }).notNull(),
  takenAt: timestamp('taken_at', { withTimezone: true }).defaultNow().notNull(),
  taken: boolean('taken').default(true).notNull(),
  notes: text('notes'),
});

// Simple weight tracking
export const weightReadings = pgTable('weight_readings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).notNull(), // kg
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Blood pressure (optional, many diabetics also track this)
export const bloodPressureReadings = pgTable('blood_pressure_readings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  systolic: integer('systolic').notNull(),
  diastolic: integer('diastolic').notNull(),
  pulse: integer('pulse'), // Optional
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  bloodSugarReadings: many(bloodSugarReadings),
  medications: many(medications),
  medicationLogs: many(medicationLogs),
  weightReadings: many(weightReadings),
  bloodPressureReadings: many(bloodPressureReadings),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const bloodSugarReadingsRelations = relations(bloodSugarReadings, ({ one }) => ({
  user: one(users, {
    fields: [bloodSugarReadings.userId],
    references: [users.id],
  }),
}));

export const medicationsRelations = relations(medications, ({ many, one }) => ({
  logs: many(medicationLogs),
  user: one(users, {
    fields: [medications.userId],
    references: [users.id],
  }),
}));

export const medicationLogsRelations = relations(medicationLogs, ({ one }) => ({
  medication: one(medications, {
    fields: [medicationLogs.medicationId],
    references: [medications.id],
  }),
  user: one(users, {
    fields: [medicationLogs.userId],
    references: [users.id],
  }),
}));

export const weightReadingsRelations = relations(weightReadings, ({ one }) => ({
  user: one(users, {
    fields: [weightReadings.userId],
    references: [users.id],
  }),
}));

export const bloodPressureReadingsRelations = relations(bloodPressureReadings, ({ one }) => ({
  user: one(users, {
    fields: [bloodPressureReadings.userId],
    references: [users.id],
  }),
}));

// Export types for use in the app
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type BloodSugarReading = typeof bloodSugarReadings.$inferSelect;
export type NewBloodSugarReading = typeof bloodSugarReadings.$inferInsert;
export type Medication = typeof medications.$inferSelect;
export type NewMedication = typeof medications.$inferInsert;
export type MedicationLog = typeof medicationLogs.$inferSelect;
export type NewMedicationLog = typeof medicationLogs.$inferInsert;
export type WeightReading = typeof weightReadings.$inferSelect;
export type NewWeightReading = typeof weightReadings.$inferInsert;
export type BloodPressureReading = typeof bloodPressureReadings.$inferSelect;
export type NewBloodPressureReading = typeof bloodPressureReadings.$inferInsert;