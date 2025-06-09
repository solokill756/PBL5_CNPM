// Utility functions để kiểm tra quyền người dùng
export const isAdmin = (user) => {
    return user?.role === 'admin';
  };
  
  export const isUser = (user) => {
    return user?.role === 'user';
  };
  
  export const hasRole = (user, role) => {
    return user?.role === role;
  };
  
  export const canAccessAdmin = (user) => {
    return isAdmin(user);
  };
  
  // Có thể mở rộng thêm các quyền khác trong tương lai
  export const ROLES = {
    ADMIN: 'admin',
    USER: 'user'
  };