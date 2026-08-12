export type UserRole = 'OWNER' | 'MANAGER' | 'WORKER' | 'VET' | 'VIEWER';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  currentFarmId: string;
  currentFarmName: string;
}

export type PermissionAction =
  | 'ANIMAL_READ'
  | 'ANIMAL_CREATE'
  | 'ANIMAL_EDIT'
  | 'ANIMAL_DELETE'
  | 'FEED_READ'
  | 'FEED_TRANSACTION_ADD'
  | 'FEED_MANAGE'
  | 'LAND_READ'
  | 'LAND_MANAGE'
  | 'HEALTH_READ'
  | 'HEALTH_MANAGE'
  | 'FINANCE_READ'
  | 'FINANCE_MANAGE'
  | 'USER_MANAGE';
