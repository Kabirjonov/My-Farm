import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../permissions';
import { PermissionAction, UserRole } from '../types';

export function useAuth() {
  const { user, isAuthenticated, login, register, updateProfile, logout, switchRole, switchFarm } = useAuthStore();

  const checkPermission = (action: PermissionAction): boolean => {
    if (!user) return false;
    return hasPermission(user.role, action);
  };

  return {
    user,
    role: user?.role || ('VIEWER' as UserRole),
    isAuthenticated,
    login,
    register,
    updateProfile,
    logout,
    switchRole,
    switchFarm,
    can: checkPermission,
  };
}
