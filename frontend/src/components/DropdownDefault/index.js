import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const DropdownDefault = ({
  menu = [],
  className = "",
  buttonLabel = "Dropdown",
}) => {
  const [open, setOpen] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(buttonLabel);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    setCurrentLabel(item.label);
    if (item.onClick) item.onClick(); // Gọi hàm nếu có
    setOpen(false); // Đóng dropdown
  };

  return (
    <div className={`${className} relative inline-block text-left`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-600 h-full border-2 border-gray-200 focus:outline-none font-medium rounded-full text-sm px-3.5 py-2.5 inline-flex items-center"
      >
        {currentLabel}
        <IoIosArrowDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div className="absolute mt-0.5 z-10 border border-solid border-zinc-100 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {menu.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.href || "#"}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn nổi bọt
                    handleItemClick(item);
                  }}
                  className="flex items-center gap-5 px-5 py-2.5 hover:bg-red-50 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {item.icon && (
                    <span className="text-gray-500 dark:text-gray-300 size-4">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-gray-600 font-medium text-sm">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownDefault;
