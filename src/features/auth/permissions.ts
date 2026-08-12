import { UserRole, PermissionAction } from './types';

export const PERMISSION_MATRIX: Record<UserRole, PermissionAction[]> = {
  OWNER: [
    'ANIMAL_READ',
    'ANIMAL_CREATE',
    'ANIMAL_EDIT',
    'ANIMAL_DELETE',
    'FEED_READ',
    'FEED_TRANSACTION_ADD',
    'FEED_MANAGE',
    'LAND_READ',
    'LAND_MANAGE',
    'HEALTH_READ',
    'HEALTH_MANAGE',
    'FINANCE_READ',
    'FINANCE_MANAGE',
    'USER_MANAGE',
  ],
  MANAGER: [
    'ANIMAL_READ',
    'ANIMAL_CREATE',
    'ANIMAL_EDIT',
    'FEED_READ',
    'FEED_TRANSACTION_ADD',
    'FEED_MANAGE',
    'LAND_READ',
    'LAND_MANAGE',
    'HEALTH_READ',
    'HEALTH_MANAGE',
    'FINANCE_READ',
    'FINANCE_MANAGE',
  ],
  WORKER: [
    'ANIMAL_READ',
    'FEED_READ',
    'FEED_TRANSACTION_ADD',
    'LAND_READ',
  ],
  VET: [
    'ANIMAL_READ',
    'HEALTH_READ',
    'HEALTH_MANAGE',
  ],
  VIEWER: [
    'ANIMAL_READ',
    'FEED_READ',
    'LAND_READ',
    'HEALTH_READ',
    'FINANCE_READ',
  ],
};

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const allowedActions = PERMISSION_MATRIX[role] || [];
  return allowedActions.includes(action);
}
