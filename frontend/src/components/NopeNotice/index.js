import React from "react";
import BlueButton from "../BlueButton";
import NopeImage from "@/assets/images/LogoIcon.png";

const NopeNotice = ({ type = "lớp học", customMessage, actionText, actionPath }) => {
  const getDefaultMessage = () => {
    switch (type) {
      case "hoạt động":
        return "Bạn chưa có hoạt động học tập gần đây nào";
      case "lớp học":
        return "Bạn chưa có lớp học gần đây nào cả";
      case "flashcard":
        return "Bạn chưa có flashcard gần đây nào";
      default:
        return `Bạn chưa có ${type} gần đây nào cả`;
    }
  };

  const getDefaultAction = () => {
    switch (type) {
      case "hoạt động":
        return { text: "Bắt đầu học", path: "/vocabulary" };
      case "lớp học":
        return { text: "Tham gia lớp học", path: "/classes" };
      case "flashcard":
        return { text: "Tạo flashcard", path: "/add-flashcard" };
      default:
        return { text: `Khám phá ${type}`, path: "/vocabulary" };
    }
  };

  const message = customMessage || getDefaultMessage();
  const defaultAction = getDefaultAction();
  const buttonText = actionText || defaultAction.text;
  const buttonPath = actionPath || defaultAction.path;

  return (
    <div className="flex flex-col items-center justify-center mx-3 py-8 bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/30 rounded-xl border border-red-100/50 shadow-sm">
      <div className="w-36 h-20">
        <img src={NopeImage} alt="Empty" className="w-full h-full object-contain opacity-80" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        Oops! {message}
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 text-center max-w-xs">
        Hãy bắt đầu hành trình học tập để tạo ra những khoảnh khắc đáng nhớ nhé!
      </p>
      
      <BlueButton
        name={buttonText}
        isActive="login"
        path={buttonPath}
        size="px-6 py-2 h-10 !bg-red-700 hover:!bg-red-800 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
      />
    </div>
  );
};

export default NopeNotice;