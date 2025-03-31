import React from "react";
import { BsFire } from "react-icons/bs";
import AvatarLeft from "./AvatarLeft";
import MenuItem from "../MenuItem";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { MdLockPerson } from "react-icons/md";

const AvatarRight = ({ avatar, streak, username, email, isActive, onClick }) => {
  return (
    <>
    <div className="w-1/4"></div>
      <div className="w-2/4 flex flex-col items-start justify-center text-sm font-semibold text-gray-500">
        <span>{username}</span>
        <span className="flex items-center gap-2">
          {streak} <BsFire color="orange" />
        </span>
      </div>
      <div className="flex-1">
        <img
          onClick={onClick}
          className="size-12 rounded-full cursor-pointer"
          src={avatar}
        />
        {isActive && (
            <div className="absolute w-[336px] h-auto top-full right-5 border border-solid border-gray-100 shadow-md rounded-md bg-white">
            <div className="mx-3 text-gray-600 font-medium">
                <AvatarLeft username={username} email={email} avatar={avatar} avatarSize="size-16"/>
                <MenuItem icon={<GrAchievement />} title={'Thành tựu'} height={'h-[36px]'} textSize="text-sm"/>
                <MenuItem icon={<IoSettingsOutline />} title={'Cài đặt'} height={'h-[36px]'} textSize="text-sm"/>
                <MenuItem icon={<FaRegMoon />} title={'Tối'} height={'h-[36px]'} textSize="text-sm"/>
                <div className="border-t border-solid"></div>
                <MenuItem icon={<FiLogOut />} title={'Đăng xuất'} height={'h-[36px]'} textSize="text-sm"/>
                <div className="border-t border-solid"></div>
                <MenuItem icon={<MdLockPerson />} title={'Quyền riêng tư'} height={'h-[36px]'} textSize="text-sm"/>
                <MenuItem icon={<FiHelpCircle />} title={'Giúp đỡ và phản hồi'} height={'h-[36px]'} textSize="text-sm"/>
            </div>
        </div>
        )}
      </div>
      
    </>
  );
};

export default AvatarRight;
