import React from "react";

const AvatarLeft = ({
  username,
  email,
  avatar,
  avatarSize = "",
  textSize = "text-sm",
  height = "",
}) => {
  return (
    <div className={`flex w-full p-2 justify-center items-center gap-3 ${height}`}>
      <div className={`${avatarSize}`}>
        <img className="rounded-full" alt="avatar" src={avatar} />
      </div>
      <div className={`flex-1 flex flex-col ${textSize}`}>
        <span className="text-gray-800">{username}</span>
        <span className="text-gray-500 font-medium">{email}</span>
      </div>
    </div>
  );
};

export default AvatarLeft;