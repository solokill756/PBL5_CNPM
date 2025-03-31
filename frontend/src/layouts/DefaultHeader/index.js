import AvatarRight from "@/components/Avatar/AvatarRight";
import SearchInput from '@/components/SearchInput';
import React, { useState, useRef, useEffect } from 'react';

const DefaultHeader = () => {
  const [active, setActive] = useState(false);
  const avatarRef = useRef(null);

  // Xử lý click bên ngoài để ẩn popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [active, setActive] = useState(false);
  const avatarRef = useRef(null);

  // Xử lý click bên ngoài để ẩn popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='sticky top-0 z-50 w-full bg-white h-20 flex items-center justify-center'>
        <div className='flex w-3/4 justify-center'><SearchInput /></div>
        <div className='flex-1 flex justify-center p-2 relative' ref={avatarRef}>
            <AvatarRight 
              onClick={() => setActive(!active)} 
              isActive={active}
              username={'yw.hnaht'} 
              streak={'8'} 
              avatar={'https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg'} 
              email={'hothanhhuy24062004@gmail.com'}
            />
        </div>
    </div>
  );
}

export default DefaultHeader;

export default DefaultHeader;
