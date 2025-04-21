import React, { useState, useRef, useEffect } from "react";
import { cloneElement } from "react";
import Dropdown from "../Dropdown";

const RoundButton = ({ icon, onClick = () => {}, border, menu = [], isDropdown = false }) => {
  const [active, setActive] = useState(false);
  const buttonRef = useRef();

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setActive((prev) => !prev);
    onClick(); // vẫn gọi callback nếu có
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
          active ? "text-red-400" : ""
        } size-5 text-gray-600`,
      })
    : null;

  return (
    <div className="relative inline-block text-left" ref={buttonRef}>
      <button
        className={`flex border-2 ${border} ${
          active
            ? "bg-red-50 hover:bg-red-100 border-red-300"
            : "border-gray-300 bg-white hover:bg-zinc-100"
        } items-center text-sm font-medium gap-2 p-2 text-gray-600 rounded-full`}
        onClick={toggleDropdown}
      >
        {styledIcon}
      </button>

      {isDropdown && active && (
        <Dropdown
          menu={menu}
          onSelect={() => setActive(false)} // đóng dropdown khi chọn
        />
      )}
    </div>
  );
};

export default RoundButton;
