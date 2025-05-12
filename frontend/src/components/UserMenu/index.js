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
  const profile_picture = useAuthStore((state) => state.user?.profile_picture);
  const avatarURL = profile_picture ? `${profile_picture}?t=${new Date().getTime()}` : null;

  // const username = useAuthStore((state) => state.user?.username);

  

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
    if (!user) return null;
  return (
    <div className='flex-1 flex justify-center p-2 relative' ref={avatarRef}>
      <AvatarDisplay
        onClick={() => setActive(!active)}
        isActive={active}
        username={user.username}
        streak={'8'}
        avatar={avatarURL}
      />
      {active && (
        <DropdownMenu
          username={user.username}
          email={user.email}
           avatar={avatarURL}
          onLogout={handleLogout}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default UserMenu;