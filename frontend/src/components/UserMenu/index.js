import React, { useState, useRef, useEffect, useContext } from 'react';
import AvatarDisplay from '../AvatarDisplay';
import DropdownMenu from '../DropdownMenu';
import { fetchLogout } from '@/api/logout';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useAuthStore } from '@/store/useAuthStore';

const UserMenu = () => {
  const [active, setActive] = useState(false);
  const avatarRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleClickOutside = (event) => {
    if (avatarRef.current && !avatarRef.current.contains(event.target)) {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetchLogout(axiosPrivate);
      if (res.message) {
        logout();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='flex-1 flex justify-center p-2 relative' ref={avatarRef}>
      <AvatarDisplay
        onClick={() => setActive(!active)}
        isActive={active}
        username={user.username}
        streak={'8'}
        avatar={user.profile_picture}
      />
      {active && (
        <DropdownMenu
          username={user.username}
          email={user.email}
          avatar={user.profile_picture}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default UserMenu;