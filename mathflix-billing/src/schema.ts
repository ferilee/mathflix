import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const teachers = sqliteTable("teachers", {
  id: text("id").primaryKey(),
  nip: text("nip"),
  fullName: text("full_name"),
  school: text("school"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const students = sqliteTable("students", {
  id: text("id").primaryKey(),
  nisn: text("nisn"),
  fullName: text("full_name").notNull(),
  major: text("major"),
  gradeLevel: integer("grade_level"),
  school: text("school"),
  teacherId: text("teacher_id"),
  teacherName: text("teacher_name"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const studentBilling = sqliteTable("student_billing", {
  studentId: text("student_id").primaryKey(),
  paidUntil: text("paid_until"),
  graceUntil: text("grace_until"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const billingPayments = sqliteTable("billing_payments", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  amount: integer("amount").notNull(),
  studentCount: integer("student_count").notNull(),
  studentIds: text("student_ids"),
  paidUntil: text("paid_until"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const teacherExemptions = sqliteTable("teacher_exemptions", {
  teacherId: text("teacher_id").primaryKey(),
  teacherName: text("teacher_name"),
  reason: text("reason"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const teacherPolicies = sqliteTable("teacher_policies", {
  teacherId: text("teacher_id").primaryKey(),
  teacherName: text("teacher_name"),
  graceDays: integer("grace_days"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
