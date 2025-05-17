import React from "react";
import { Link, useLocation } from "react-router-dom";

const MenuItem = ({ icon, title, path, textSize = "text-base", height, onClick }) => {
  const location = useLocation();
  const isActive = path && (
    path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path)
  );

  return (
    <Link
      className={`${
        isActive ? "bg-red-50" : ""
      } flex items-center text-base gap-4 my-2 p-3 active:bg-red-200 rounded-md cursor-pointer hover:bg-red-50 transition-all duration-300`}
      to={path || "#"}
      onClick={onClick}
    >
      <div className={`${isActive ? "text-red-900" : "text-gray-600"}`}>
        {icon}
      </div>
      <span
        className={`font-semibold transition-all duration-300 ${
          isActive ? " text-red-900" : "text-gray-600"
        }`}
      >
        {title}
      </span>
    </Link>
  );
};

export default MenuItem;
