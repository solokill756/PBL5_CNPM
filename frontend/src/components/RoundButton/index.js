import React, { useState, useRef, useEffect } from "react";
import { cloneElement } from "react";
import Dropdown from "../Dropdown";

const RoundButton = ({ 
  icon, 
  className = "", 
  onClick = () => {}, 
  border, 
  menu = [], 
  isDropdown = false, 
  isSaved = false,
  isActive = false,
  label = "" 
}) => {
  const [active, setActive] = useState(false);
  const buttonRef = useRef();

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setActive((prev) => !prev);
    onClick();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const styledIcon = icon
    ? cloneElement(icon, {
        className: `${icon.props.className || ""} ${
          isSaved ? "text-red-400" : isActive ? "text-red-400" : ""
        } size-5 font-semibold text-gray-600`,
      })
    : null;

  const displayLabel = label || (isSaved ? "Đã lưu" : "");

  return (
    <div className={`relative inline-block text-left ${className}`} ref={buttonRef}>
      <button
        className={`flex border-2 ${border} ${
          isSaved
            ? "bg-red-50 hover:bg-red-100 text-red-500 border-red-300"
            : isActive
            ? "bg-red-50 hover:bg-red-100 text-red-500 border-red-300"
            : "border-gray-300 bg-white hover:bg-zinc-100"
        } items-center text-sm font-medium gap-2 p-2 text-gray-600 rounded-full`}
        onClick={toggleDropdown}
      >
        {styledIcon}
        {displayLabel && <span>{displayLabel}</span>}
      </button>

      {isDropdown && active && (
        <Dropdown
          menu={menu}
          onSelect={() => setActive(false)} 
        />
      )}
    </div>
  );
};

export default RoundButton;