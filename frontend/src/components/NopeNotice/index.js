import React from "react";
import BlueButton from "../BlueButton";
import NopeImage from "@/assets/images/LogoIcon.png";

const NopeNotice = ({ type }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
      <img src={NopeImage} alt="Empty" className="w-44" />
      <p className="text-lg font-semibold text-gray-700 mb-2">
        Oops, bạn chưa có {type} gần đây nào cả!
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Hãy bắt đầu học tập bằng cách tham gia một {type} mới nhé.
      </p>
      <BlueButton
        name={`Khám phá ${type}`}
        isActive={"login"}
        size={"w-36 h-8 !bg-red-700 hover:!bg-red-800"}
      />
    </div>
  );
};

export default NopeNotice;
