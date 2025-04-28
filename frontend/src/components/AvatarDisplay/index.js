import React from "react";
import { BsFire } from "react-icons/bs";
import { ReactComponent as StreakIcon } from "@/assets/icons/streak.svg";

const AvatarDisplay = ({ avatar, streak, username, onClick }) => (
  <div className="flex w-full items-center">
    <div className="w-2/4 h-full flex flex-col items-start text-sm font-semibold text-gray-500">
      <span className="h-1/2">{username}</span>
      <span className="flex flex-1 items-center gap-1">
        <div className="relative flex items-center">
          <StreakIcon className="w-6 h-6" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
            {streak}
          </span>
        </div>
      </span>
    </div>
    <div className="flex-1">
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