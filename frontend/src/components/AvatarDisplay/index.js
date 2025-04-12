import React from 'react';
import { BsFire } from "react-icons/bs";
import DefaultAvatar from '@/assets/images/avatar.jpg'

const AvatarDisplay = ({ avatar = DefaultAvatar, streak, username, onClick }) => (
  <div className="flex w-full items-center">
    <div className="w-2/4 flex flex-col items-start text-sm font-semibold text-gray-500">
      <span>{username}</span>
      <span className="flex items-center gap-1">
        {streak} <BsFire color="red" />
      </span>
    </div>
    <div className='flex-1'>
        <img
          className="size-12 cursor-pointer rounded-full"
          onClick={onClick}
          src={avatar}
          alt="avatar"
        />
    </div>
  </div>
);

export default AvatarDisplay;
