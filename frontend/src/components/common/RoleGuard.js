import { useAuthStore } from '@/store/useAuthStore';

const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  fallback = null, 
  requireAll = false 
}) => {
  const { user } = useAuthStore();
  
  if (!user) return fallback;
  
  const userRole = user.role;
  
  // Kiểm tra quyền
  const hasPermission = allowedRoles.includes(userRole);
  
  return hasPermission ? children : fallback;
};

export default RoleGuard;

// Usage example:
// <RoleGuard allowedRoles={['admin']}>
//   <AdminButton />
// </RoleGuard>