import { useEffect, useRef } from 'react';
import { useAddFlashcardStore, forceReloadFlashcardStore } from '@/store/useAddFlashcardStore';
import Cookies from 'js-cookie';

export const useUserChangeListener = () => {
  const checkAndLoadUserData = useAddFlashcardStore(state => state.checkAndLoadUserData);
  const prevUserIdRef = useRef(null);
  
  useEffect(() => {
    const getCurrentUserId = () => {
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          const user = JSON.parse(userCookie);
          return user.id;
        }
        return null;
      } catch (error) {
        return null;
      }
    };

    const checkUserChange = () => {
      const currentUserId = getCurrentUserId();
      
      // Nếu user thay đổi, force reload
      if (currentUserId !== prevUserIdRef.current) {
        console.log('User changed from', prevUserIdRef.current, 'to', currentUserId);
        forceReloadFlashcardStore();
        prevUserIdRef.current = currentUserId;
      }
    };

    // Check ngay khi hook chạy
    checkUserChange();
    
    // Listen for cookies change
    const interval = setInterval(checkUserChange, 500);
    
    // Listen for storage events (khi user login/logout ở tab khác)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        setTimeout(checkUserChange, 100);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};