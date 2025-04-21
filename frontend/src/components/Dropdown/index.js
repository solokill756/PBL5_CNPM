import React from "react";
import { Link } from "react-router-dom";

const Dropdown = ({ menu = [], onSelect }) => {
  return (
    <div className="absolute z-10 mt-2 right-0 border border-solid border-zinc-100 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-56 h-auto dark:bg-gray-700">
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        {menu.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.href || "#"}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect(); // đóng dropdown
                if (item.onClick) item.onClick(); // hành động riêng
              }}
              className="flex items-center gap-5 px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {item.icon && (
                <span className="text-gray-500 dark:text-gray-300 size-4">
                  {item.icon}
                </span>
              )}
              <span className="text-gray-600 font-medium text-[15px]">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
