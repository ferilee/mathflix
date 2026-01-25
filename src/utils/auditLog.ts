import api from '../api';
import { getStaffActorId, getStaffDisplayName, getStaffUser } from './auth';

export type AuditAction = 'create' | 'update' | 'delete';
export type AuditEntity = 'material' | 'quiz' | 'announcement' | 'assignment';

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  entity: AuditEntity;
  entity_id: string;
  summary: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  timestamp: string;
}

export const getAuditLogs = async (params?: {
  action?: string;
  entity?: string;
  actor_id?: string;
}): Promise<AuditLogEntry[]> => {
  const { data } = await api.get('/audit-logs', { params });
  return Array.isArray(data) ? data : data?.data || [];
};

export const addAuditLog = async (entry: {
  action: AuditAction;
  entity: AuditEntity;
  entity_id?: string;
  summary?: string;
}) => {
  const user = getStaffUser();
  const payload = {
    action: entry.action,
    entity: entry.entity,
    entity_id: entry.entity_id || '-',
    summary: entry.summary || '',
    actor_id: getStaffActorId(user),
    actor_name: getStaffDisplayName(user) || getStaffActorId(user),
    actor_role: user?.role || 'system',
  };
  const { data } = await api.post('/audit-logs', payload);
  return data;
};
