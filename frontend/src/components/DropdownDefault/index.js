import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const DropdownDefault = ({
  icon,
  menu = [],
  border = true,
  className = "",
  buttonLabel = "",
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

  const filteredMenu = menu.filter(item => item.label !== currentLabel);

  const itemsWithIcon = filteredMenu.filter(item => item.icon);
  const itemsWithoutIcon = filteredMenu.filter(item => !item.icon);

  return (
    <div
      className={`${className} relative inline-block text-left`}
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className={`text-gray-600 h-full ${border ? "border-2 border-gray-200 text-sm" : "text-base hover:bg-red-50"} focus:outline-none font-medium rounded-full px-3.5 py-2.5 inline-flex items-center`}
      >
        <div className="flex">{icon && !border && <span className="mr-2">{icon}</span>}</div>
        {currentLabel}
        <IoIosArrowDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div className="absolute mt-0.5 z-10 border border-solid border-zinc-100 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
          {itemsWithIcon.map((item, idx) => (
              <li key={idx} className="flex items-center">
                <Link
                  to={item.to || "#"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                  className="inline-flex items-center w-full gap-4 px-5 py-2.5 hover:bg-red-50 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {item.icon && (
                    <span className="text-gray-500 dark:text-gray-300 flex items-center justify-center">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-gray-600 font-medium text-sm">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}

            {/* Separator line if both types of items exist */}
            {itemsWithIcon.length > 0 && itemsWithoutIcon.length > 0 && (
              <hr className="my-2 border-gray-200" />
            )}

            {/* Items without icons */}
            {itemsWithoutIcon.map((item, idx) => (
              <li key={idx} className="flex items-center">
                <Link
                  to={item.to || "#"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                  className="inline-flex items-center w-full px-5 py-2.5 hover:bg-red-50 dark:hover:bg-gray-600 dark:hover:text-white"
                >
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
