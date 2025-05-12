import React from 'react';
import MenuItem from '../MenuItem';
import { GrAchievement } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { MdLockPerson } from "react-icons/md";
import AvatarLeft from '../AvatarLeft';

const DropdownMenu = ({ username, userId, email, avatar, onLogout, onToggleDarkMode }) => (
  <div className="absolute w-[336px] top-full right-5 border border-gray-100 shadow-md rounded-md bg-white z-50">
    <div className="mx-3 py-2 text-gray-600 font-medium">
      <AvatarLeft username={username} email={email} avatar={avatar} avatarSize="size-16" />
      <MenuItem icon={<GrAchievement />} title={'Thành tựu'} />
      <MenuItem icon={<IoSettingsOutline />} path={`/accounts/${userId}`} title={'Cài đặt'} />
      {/* <MenuItem icon={<FaRegMoon />} title={'Chế độ tối'} onClick={onToggleDarkMode} /> */}
      <div className="border-t my-1" />
      <MenuItem icon={<FiLogOut />} title={'Đăng xuất'} onClick={onLogout} />
      <div className="border-t my-1" />
      <MenuItem icon={<MdLockPerson />} title={'Quyền riêng tư'} />
      <MenuItem icon={<FiHelpCircle />} title={'Giúp đỡ và phản hồi'} />
    </div>
  </div>
);

export default DropdownMenu;
