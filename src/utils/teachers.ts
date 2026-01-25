import api from '../api';

export interface TeacherAccount {
  id: string;
  nip: string;
  full_name: string;
  school: string;
  created_at: string;
}

export const getTeacherAccounts = async (): Promise<TeacherAccount[]> => {
  const { data } = await api.get('/teachers');
  return Array.isArray(data) ? data : data?.data || [];
};

export const findTeacherByNip = async (nip: string): Promise<TeacherAccount | null> => {
  const { data } = await api.get('/teachers', { params: { nip } });
  const list = Array.isArray(data) ? data : data?.data || [];
  return list[0] || null;
};

export const addTeacherAccount = async (input: {
  nip: string;
  full_name: string;
  school: string;
}): Promise<TeacherAccount> => {
  const { data } = await api.post('/teachers', input);
  return data;
};

export const removeTeacherAccount = async (id: string): Promise<void> => {
  await api.delete(`/teachers/${id}`);
};
