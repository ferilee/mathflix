import api from '../api';

export type TeacherRequestStatus = 'pending' | 'approved' | 'rejected';

export type TeacherRequest = {
  id: string;
  nip: string;
  full_name: string;
  school: string;
  status?: TeacherRequestStatus;
  requested_at?: string;
  created_at?: string;
};

export const createTeacherRequest = async (payload: {
  nip: string;
  full_name: string;
  school: string;
}) => {
  const { data } = await api.post('/teachers/requests', payload);
  return data as TeacherRequest;
};

export const fetchPendingTeacherRequests = async () => {
  const { data } = await api.get('/teachers/requests', { params: { status: 'pending' } });
  return Array.isArray(data) ? data : data?.data || [];
};

export const approveTeacherRequest = async (id: string) => {
  const { data } = await api.post(`/teachers/requests/${id}/approve`);
  return data as TeacherRequest;
};

export const rejectTeacherRequest = async (id: string) => {
  const { data } = await api.post(`/teachers/requests/${id}/reject`);
  return data as TeacherRequest;
};
