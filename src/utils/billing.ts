import billingApi from "../api/billing";

export interface BillingSummary {
  total_students?: number;
  free_quota?: number;
  paid_students?: number;
  price_per_student?: number;
  amount_due?: number;
  grace_days?: number;
  overdue_students?: number;
  grace_students?: number;
}

export interface BillingStudentStatus {
  student_id: string;
  status: "free" | "paid" | "grace" | "blocked";
  grace_until?: string | null;
  paid_until?: string | null;
}

export const fetchBillingSummary = async (teacherId?: string | null) => {
  try {
    const { data } = await billingApi.get("/billing/summary", {
      params: teacherId ? { teacher_id: teacherId } : undefined,
    });
    return (data?.data || data) as BillingSummary;
  } catch (error) {
    return null;
  }
};

export const fetchBillingStatuses = async (teacherId?: string | null) => {
  try {
    const { data } = await billingApi.get("/billing/students", {
      params: teacherId ? { teacher_id: teacherId } : undefined,
    });
    const rows = (data?.data || data) as BillingStudentStatus[];
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    return null;
  }
};

export const payBilling = async (payload: {
  teacher_id?: string | null;
  amount: number;
  student_count: number;
  student_ids?: string[];
}) => {
  const { data } = await billingApi.post("/billing/pay", payload);
  return data;
};

export const syncBillingStudents = async (payload: any[] | any) => {
  const { data } = await billingApi.post("/billing/students/sync", payload);
  return data;
};

export const fetchTeacherExemptions = async () => {
  const { data } = await billingApi.get("/billing/teachers/exemptions");
  return Array.isArray(data) ? data : [];
};

export const setTeacherExemption = async (
  teacherId: string,
  payload?: { reason?: string; teacher_name?: string },
) => {
  const { data } = await billingApi.post(
    `/billing/teachers/${teacherId}/exempt`,
    payload || {},
  );
  return data;
};

export const removeTeacherExemption = async (teacherId: string) => {
  const { data } = await billingApi.delete(
    `/billing/teachers/${teacherId}/exempt`,
  );
  return data;
};

export const fetchTeacherPolicies = async () => {
  const { data } = await billingApi.get("/billing/teachers/policies");
  return Array.isArray(data) ? data : [];
};

export const setTeacherPolicy = async (
  teacherId: string,
  payload: { grace_days: number; teacher_name?: string },
) => {
  const { data } = await billingApi.post(
    `/billing/teachers/${teacherId}/policy`,
    payload,
  );
  return data;
};

export const removeTeacherPolicy = async (teacherId: string) => {
  const { data } = await billingApi.delete(
    `/billing/teachers/${teacherId}/policy`,
  );
  return data;
};

export const confirmTeacherPayment = async (
  teacherId: string,
  payload?: { period_days?: number },
) => {
  const { data } = await billingApi.post(
    `/billing/teachers/${teacherId}/confirm-payment`,
    payload || {},
  );
  return data;
};

export const fetchBillingSettings = async () => {
  const { data } = await billingApi.get("/billing/settings");
  return data || {};
};

export const saveBillingSettings = async (payload: {
  payment_url?: string;
}) => {
  const { data } = await billingApi.post("/billing/settings", payload);
  return data;
};

export const fetchBillingPayments = async (teacherId?: string, limit = 50) => {
  const { data } = await billingApi.get("/billing/payments", {
    params: teacherId ? { teacher_id: teacherId, limit } : { limit },
  });
  return Array.isArray(data) ? data : [];
};

export const fetchTeacherPayments = async (teacherId: string, limit = 50) => {
  const { data } = await billingApi.get(
    `/billing/teachers/${teacherId}/payments`,
    {
      params: { limit },
    },
  );
  return Array.isArray(data) ? data : [];
};
