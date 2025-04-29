import React from "react";

const SearchInput = ({
  searchIcon = true,
  closeIcon = true,
  placeholder = "Tìm kiếm...",
  className = "",
  editable = true,
  value,
}) => {
  return (
    <form className={`form relative w-5/6 ${className}`}>
      {searchIcon && (
        <button className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
          <svg
            width={17}
            height={16}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
            className="w-5 h-5 text-gray-700"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <input
        readOnly={!editable}
        value={value}
        className={`input selection:bg-red-100 rounded-md bg-zinc-100 font-semibold text-gray-600 w-full ${
          searchIcon ? "px-8" : "px-4"
        } py-2 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 overflow-hidden whitespace-nowrap text-ellipsis`}
        placeholder={placeholder}
        required
        type="text"
      />

      {closeIcon && (
        <button
          type="reset"
          className="absolute right-3 -translate-y-1/2 top-1/2 p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchInput;
