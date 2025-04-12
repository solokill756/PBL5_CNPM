import React, { useState, useRef, useEffect, useContext } from 'react';
import AuthContext from '@/context/AuthProvider';
import AvatarDisplay from '../AvatarDisplay';
import DropdownMenu from '../DropdownMenu';
import DefaultAvatar from '@/assets/images/avatar.jpg'

const UserMenu = () => {
  const [active, setActive] = useState(false);
  const avatarRef = useRef(null);
  const { auth, logout } = useContext(AuthContext);
  const user = auth.user;
  console.log('====================================');
  console.log(user);
  console.log('====================================');

  const handleClickOutside = (event) => {
    if (avatarRef.current && !avatarRef.current.contains(event.target)) {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); 
  };

  const handleToggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    // Có thể lưu trạng thái vào localStorage nếu muốn giữ trạng thái
  };

  return (
    <div className='flex-1 flex justify-center p-2 relative' ref={avatarRef}>
      <AvatarDisplay
        onClick={() => setActive(!active)}
        isActive={active}
        username={user.username}
        streak={'8'}
        avatar={user.avatar}
      />
      {active && (
        <DropdownMenu
          username={user.username}
          email={user.email}
          avatar={user.avatar}
          onLogout={handleLogout}
          onToggleDarkMode={handleToggleDarkMode}
        />
      )}
    </div>
  );
};

export default UserMenu;
