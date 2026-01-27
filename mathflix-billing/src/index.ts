import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import {
  students,
  studentBilling,
  billingPayments,
  teacherExemptions,
  teacherPolicies,
  appSettings,
} from "./schema";
import { asc, eq, inArray } from "drizzle-orm";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
  }),
);

const FREE_CLASS_QUOTA = Number(process.env.FREE_CLASS_QUOTA || 1);
const STUDENTS_PER_CLASS = Number(process.env.STUDENTS_PER_CLASS || 30);
const PRICE_PER_CLASS = Number(process.env.PRICE_PER_CLASS || 49000);
const GRACE_DAYS = Number(process.env.GRACE_DAYS || 7);
const BILLING_PERIOD_DAYS = Number(process.env.BILLING_PERIOD_DAYS || 30);

const toDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toIso = (value?: Date | null) => (value ? value.toISOString() : null);

const withDays = (start: Date, days: number) => {
  const copy = new Date(start.getTime());
  copy.setDate(copy.getDate() + days);
  return copy;
};

const normalizeName = (name?: string | null) => {
  return (name || "").trim().toLowerCase();
};

const getStudentsForTeacher = async (teacherId?: string | null) => {
  if (!teacherId) {
    return db.select().from(students).orderBy(asc(students.createdAt));
  }
  return db
    .select()
    .from(students)
    .where(eq(students.teacherId, teacherId))
    .orderBy(asc(students.createdAt));
};

const fetchTeacherExemptions = async () => {
  return db.select().from(teacherExemptions);
};

const fetchTeacherPolicies = async () => {
  return db.select().from(teacherPolicies);
};

const normalizeStudentPayload = (input: any) => {
  const createdAt = input?.created_at || input?.createdAt || null;
  return {
    id: String(input?.id || ""),
    nisn: input?.nisn || null,
    fullName: input?.full_name || input?.fullName || "",
    major: input?.major || null,
    gradeLevel: input?.grade_level || input?.gradeLevel || null,
    school: input?.school || null,
    teacherId: input?.teacher_id || input?.teacherId || null,
    teacherName:
      (input?.teacher_name || input?.teacherName || null)?.trim() || null,
    createdAt: createdAt || new Date().toISOString(),
  };
};

const getBillingMap = async (studentIds: string[]) => {
  if (studentIds.length === 0) return new Map<string, any>();
  const rows = await db
    .select()
    .from(studentBilling)
    .where(inArray(studentBilling.studentId, studentIds));
  return new Map(rows.map((row) => [row.studentId, row]));
};

const resolveStudentStatus = (params: {
  index: number;
  student: any;
  billing?: any | null;
  now: Date;
  graceDays: number;
}) => {
  const { index, student, billing, now, graceDays } = params;

  const freeStudentQuota = FREE_CLASS_QUOTA * STUDENTS_PER_CLASS;
  if (index < freeStudentQuota) {
    return {
      status: "free",
      graceUntil: null,
      paidUntil: null,
    };
  }

  const paidUntil = toDate(billing?.paidUntil || null);
  if (paidUntil && paidUntil >= now) {
    return {
      status: "paid",
      graceUntil: null,
      paidUntil,
    };
  }

  const graceUntilStored = toDate(billing?.graceUntil || null);
  if (graceUntilStored && graceUntilStored >= now) {
    return {
      status: "grace",
      graceUntil: graceUntilStored,
      paidUntil: paidUntil || null,
    };
  }

  const createdAt = toDate(student.createdAt) || now;
  const graceUntilDefault = withDays(createdAt, graceDays);
  if (graceUntilDefault >= now) {
    return {
      status: "grace",
      graceUntil: graceUntilDefault,
      paidUntil: paidUntil || null,
    };
  }

  return {
    status: "blocked",
    graceUntil: graceUntilStored || graceUntilDefault || null,
    paidUntil: paidUntil || null,
  };
};

const buildStatusList = async (teacherId?: string | null) => {
  const now = new Date();
  const [exemptions, policies, studentRows] = await Promise.all([
    fetchTeacherExemptions(),
    fetchTeacherPolicies(),
    getStudentsForTeacher(teacherId),
  ]);
  const matchingExemptions = exemptions.filter((row) => {
    if (teacherId && row.teacherId === teacherId) return true;
    const rowName = normalizeName(row.teacherName);
    return (
      rowName &&
      studentRows.some((s) => normalizeName(s.teacherName) === rowName)
    );
  });
  const exemptionCutoff =
    matchingExemptions
      .map((row) => toDate(row.createdAt))
      .filter((value): value is Date => !!value)
      .sort((a, b) => b.getTime() - a.getTime())[0] || null;
  const studentName = normalizeName(studentRows[0]?.teacherName);
  const policyById =
    !!teacherId && policies.find((row) => row.teacherId === teacherId);
  const policyByName =
    !!studentName &&
    policies.find((row) => normalizeName(row.teacherName) === studentName);
  const graceDays =
    policyById?.graceDays ?? policyByName?.graceDays ?? GRACE_DAYS;
  const ids = studentRows.map((row) => row.id);
  const billingMap = await getBillingMap(ids);

  const statuses = studentRows.map((student, index) => {
    const studentCreatedAt = toDate(student.createdAt || null);
    const exempt =
      !!exemptionCutoff &&
      !!studentCreatedAt &&
      studentCreatedAt.getTime() <= exemptionCutoff.getTime();
    if (exempt) {
      return {
        student_id: student.id,
        status: "free",
        grace_until: null,
        paid_until: null,
      };
    }
    const billing = billingMap.get(student.id);
    const resolved = resolveStudentStatus({
      index,
      student,
      billing,
      now,
      graceDays,
    });
    return {
      student_id: student.id,
      status: resolved.status,
      grace_until: toIso(resolved.graceUntil),
      paid_until: toIso(resolved.paidUntil),
    };
  });

  return { statuses, total: studentRows.length, graceDays };
};

app.get("/", (c) => {
  return c.json({ status: "ok", service: "mathflix-billing" });
});

app.get("/billing/summary", async (c) => {
  const teacherId = c.req.query("teacher_id");
  const { statuses, total, graceDays } = await buildStatusList(teacherId);
  const exempt = total > 0 && statuses.every((item) => item.status === "free");

  const paidStudents = statuses.filter((item) => item.status === "paid").length;
  const graceStudents = statuses.filter(
    (item) => item.status === "grace",
  ).length;
  const blockedStudents = statuses.filter(
    (item) => item.status === "blocked",
  ).length;

  const dueCount = graceStudents + blockedStudents;
  const dueClassCount = Math.ceil(dueCount / STUDENTS_PER_CLASS);

  return c.json({
    total_students: total,
    free_quota: exempt ? total : FREE_CLASS_QUOTA * STUDENTS_PER_CLASS,
    free_classes: exempt
      ? Math.ceil(total / STUDENTS_PER_CLASS)
      : FREE_CLASS_QUOTA,
    paid_students: paidStudents,
    price_per_class: PRICE_PER_CLASS,
    students_per_class: STUDENTS_PER_CLASS,
    amount_due: exempt ? 0 : dueClassCount * PRICE_PER_CLASS,
    grace_days: graceDays,
    overdue_students: exempt ? 0 : blockedStudents,
    grace_students: exempt ? 0 : graceStudents,
    is_exempt: exempt,
  });
});

app.get("/billing/students", async (c) => {
  const teacherId = c.req.query("teacher_id");
  const { statuses } = await buildStatusList(teacherId);
  return c.json(statuses);
});

app.get("/billing/access", async (c) => {
  const studentId = c.req.query("student_id");
  if (!studentId) {
    return c.json({ error: "student_id required" }, 400);
  }

  const studentRows = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId));
  const student = studentRows[0];
  if (!student) {
    return c.json({ error: "student not found" }, 404);
  }

  const { statuses } = await buildStatusList(student.teacherId || null);
  const match = statuses.find((item) => item.student_id === studentId);
  if (!match) {
    return c.json({ error: "status not found" }, 404);
  }

  return c.json({
    student_id: studentId,
    status: match.status,
    grace_until: match.grace_until,
    paid_until: match.paid_until,
  });
});

app.get("/billing/teachers/exemptions", async (c) => {
  const rows = await fetchTeacherExemptions();
  return c.json(rows);
});

app.get("/billing/teachers/policies", async (c) => {
  const rows = await fetchTeacherPolicies();
  return c.json(rows);
});

app.get("/billing/payments", async (c) => {
  const teacherId = c.req.query("teacher_id");
  const limit = Number(c.req.query("limit") || 50);
  const baseQuery = db.select().from(billingPayments);
  const rows = teacherId
    ? await baseQuery
        .where(eq(billingPayments.teacherId, teacherId))
        .orderBy(billingPayments.createdAt)
        .limit(limit)
    : await baseQuery.orderBy(billingPayments.createdAt).limit(limit);
  return c.json(rows);
});

app.get("/billing/teachers/:teacherId/payments", async (c) => {
  const teacherId = c.req.param("teacherId");
  const limit = Number(c.req.query("limit") || 50);
  const rows = await db
    .select()
    .from(billingPayments)
    .where(eq(billingPayments.teacherId, teacherId))
    .orderBy(billingPayments.createdAt)
    .limit(limit);
  return c.json(rows);
});

app.post("/billing/teachers/:teacherId/exempt", async (c) => {
  const teacherId = c.req.param("teacherId");
  const body = await c.req.json();
  const reason = body?.reason || null;
  const teacherName = body?.teacher_name || body?.teacherName || null;
  if (!teacherId) return c.json({ error: "teacherId required" }, 400);
  await db
    .insert(teacherExemptions)
    .values({
      teacherId,
      teacherName,
      reason,
      createdAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: teacherExemptions.teacherId,
      set: {
        teacherName,
        reason,
        createdAt: new Date().toISOString(),
      },
    });
  return c.json({ status: "ok" });
});

app.post("/billing/teachers/:teacherId/policy", async (c) => {
  const teacherId = c.req.param("teacherId");
  const body = await c.req.json();
  const graceDays = Number(body?.grace_days ?? body?.graceDays ?? GRACE_DAYS);
  const teacherName = body?.teacher_name || body?.teacherName || null;
  if (!teacherId || Number.isNaN(graceDays)) {
    return c.json({ error: "teacherId and grace_days required" }, 400);
  }
  await db
    .insert(teacherPolicies)
    .values({
      teacherId,
      teacherName,
      graceDays,
      createdAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: teacherPolicies.teacherId,
      set: {
        teacherName,
        graceDays,
        createdAt: new Date().toISOString(),
      },
    });
  return c.json({ status: "ok" });
});

app.delete("/billing/teachers/:teacherId/policy", async (c) => {
  const teacherId = c.req.param("teacherId");
  if (!teacherId) return c.json({ error: "teacherId required" }, 400);
  await db
    .delete(teacherPolicies)
    .where(eq(teacherPolicies.teacherId, teacherId));
  return c.json({ status: "ok" });
});

app.post("/billing/teachers/:teacherId/confirm-payment", async (c) => {
  const teacherId = c.req.param("teacherId");
  if (!teacherId) return c.json({ error: "teacherId required" }, 400);
  const body = await c.req.json();
  const periodDays = Number(body?.period_days ?? BILLING_PERIOD_DAYS);
  if (Number.isNaN(periodDays) || periodDays <= 0) {
    return c.json({ error: "period_days must be > 0" }, 400);
  }

  const allStudents = await getStudentsForTeacher(teacherId);
  const ordered = allStudents.map((row) => row.id);
  const freeStudentQuota = FREE_CLASS_QUOTA * STUDENTS_PER_CLASS;
  const payableIds = ordered.slice(freeStudentQuota);
  const targetIds =
    Array.isArray(body?.student_ids) && body.student_ids.length > 0
      ? body.student_ids
      : payableIds;

  if (targetIds.length === 0) {
    return c.json({
      status: "ok",
      paid_students: 0,
      message: "no payable students found",
    });
  }

  const now = new Date();
  const paidUntil = withDays(now, periodDays);
  const classCount = Math.ceil(targetIds.length / STUDENTS_PER_CLASS);

  for (const id of targetIds) {
    await db
      .insert(studentBilling)
      .values({
        studentId: id,
        paidUntil: paidUntil.toISOString(),
        graceUntil: null,
        updatedAt: now.toISOString(),
      })
      .onConflictDoUpdate({
        target: studentBilling.studentId,
        set: {
          paidUntil: paidUntil.toISOString(),
          graceUntil: null,
          updatedAt: now.toISOString(),
        },
      });
  }

  await db.insert(billingPayments).values({
    id: crypto.randomUUID(),
    teacherId,
    amount: classCount * PRICE_PER_CLASS,
    studentCount: targetIds.length,
    studentIds: JSON.stringify(targetIds),
    paidUntil: paidUntil.toISOString(),
    createdAt: now.toISOString(),
  });

  return c.json({
    status: "ok",
    paid_students: targetIds.length,
    paid_until: paidUntil.toISOString(),
  });
});

app.delete("/billing/teachers/:teacherId/exempt", async (c) => {
  const teacherId = c.req.param("teacherId");
  if (!teacherId) return c.json({ error: "teacherId required" }, 400);
  await db
    .delete(teacherExemptions)
    .where(eq(teacherExemptions.teacherId, teacherId));
  return c.json({ status: "ok" });
});

app.get("/billing/settings", async (c) => {
  const rows = await db.select().from(appSettings);
  const map: Record<string, string> = {};
  rows.forEach((row) => {
    if (row.key) map[row.key] = row.value || "";
  });
  return c.json(map);
});

app.post("/billing/settings", async (c) => {
  const body = await c.req.json();
  const paymentUrl = body?.payment_url ?? body?.paymentUrl ?? "";
  await db
    .insert(appSettings)
    .values({
      key: "payment_url",
      value: paymentUrl,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: {
        value: paymentUrl,
        updatedAt: new Date().toISOString(),
      },
    });
  return c.json({ status: "ok", payment_url: paymentUrl });
});

app.post("/billing/students/sync", async (c) => {
  const payload = await c.req.json();
  const rows = Array.isArray(payload) ? payload : [payload];
  const now = new Date().toISOString();
  let upserted = 0;

  for (const row of rows) {
    const normalized = normalizeStudentPayload(row);
    if (!normalized.id || !normalized.fullName) continue;
    await db
      .insert(students)
      .values({
        ...normalized,
        createdAt: normalized.createdAt || now,
      })
      .onConflictDoUpdate({
        target: students.id,
        set: {
          nisn: normalized.nisn,
          fullName: normalized.fullName,
          major: normalized.major,
          gradeLevel: normalized.gradeLevel,
          school: normalized.school,
          teacherId: normalized.teacherId,
          teacherName: normalized.teacherName,
          createdAt: normalized.createdAt || now,
        },
      });
    upserted += 1;
  }

  return c.json({ status: "ok", upserted });
});

app.post("/billing/pay", async (c) => {
  const payload = await c.req.json();
  const teacherId = payload?.teacher_id as string | undefined;
  const amount = Number(payload?.amount || 0);
  const studentCount = Number(payload?.student_count || 0);
  const studentIds = Array.isArray(payload?.student_ids)
    ? payload.student_ids
    : null;

  if (!teacherId) {
    return c.json({ error: "teacher_id required" }, 400);
  }

  const allStudents = await getStudentsForTeacher(teacherId);
  const ordered = allStudents.map((row) => row.id);
  const freeStudentQuota = FREE_CLASS_QUOTA * STUDENTS_PER_CLASS;
  const defaultPayIds = ordered.slice(freeStudentQuota);
  const targetIds =
    studentIds && studentIds.length > 0 ? studentIds : defaultPayIds;

  if (targetIds.length === 0) {
    return c.json({ error: "no payable students found" }, 400);
  }

  const classCount = Math.ceil(targetIds.length / STUDENTS_PER_CLASS);
  const resolvedAmount =
    amount && amount > 0 ? amount : classCount * PRICE_PER_CLASS;

  const now = new Date();
  const paidUntil = withDays(now, BILLING_PERIOD_DAYS);

  for (const id of targetIds) {
    await db
      .insert(studentBilling)
      .values({
        studentId: id,
        paidUntil: paidUntil.toISOString(),
        graceUntil: null,
        updatedAt: now.toISOString(),
      })
      .onConflictDoUpdate({
        target: studentBilling.studentId,
        set: {
          paidUntil: paidUntil.toISOString(),
          graceUntil: null,
          updatedAt: now.toISOString(),
        },
      });
  }

  await db.insert(billingPayments).values({
    id: crypto.randomUUID(),
    teacherId,
    amount: resolvedAmount,
    studentCount: studentCount || targetIds.length,
    studentIds: JSON.stringify(targetIds),
    paidUntil: paidUntil.toISOString(),
    createdAt: now.toISOString(),
  });

  return c.json({
    status: "ok",
    paid_students: targetIds.length,
    paid_until: paidUntil.toISOString(),
  });
});

const port = Number(process.env.PORT || 3000);

console.log(`[mathflix-billing] listening on http://localhost:${port}`);

Bun.serve({
  port,
  fetch: app.fetch,
});
