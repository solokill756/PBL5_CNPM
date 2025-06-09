import { useAuthStore } from '@/store/useAuthStore';

export const useRole = () => {
  const { user } = useAuthStore();
  
  return {
    user,
    role: user?.role,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    hasRole: (role) => user?.role === role,
    canAccessAdmin: user?.role === 'admin'
  };
};

// Usage in components:
// const { isAdmin, canAccessAdmin } = useRole();