import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchInput = ({
  searchIcon = true,
  closeIcon = true,
  placeholder = "Tìm kiếm...",
  className = "",
  editable = true,
  onSearch,
  value, // Thêm prop value
  onChange, // Thêm prop onChange
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Lấy giá trị từ URL nếu có
  const urlQuery = searchParams.get('q') || '';
  
  // Sử dụng giá trị từ props hoặc URL
  const [inputValue, setInputValue] = useState(value || urlQuery);

  useEffect(() => {
    // Cập nhật input value khi props value thay đổi
    if (value !== undefined) {
      setInputValue(value);
    } else {
      // Hoặc cập nhật từ URL
      setInputValue(urlQuery);
    }
  }, [value, urlQuery]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) onChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    
    navigate(`/search-results?q=${(trimmedValue)}`);
    if (onSearch) onSearch(trimmedValue);
  };

  const handleReset = () => {
    setInputValue("");
    if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`form relative w-5/6 ${className}`}
    >
      {searchIcon && (
        <button 
          type="submit" 
          className="absolute left-2 -translate-y-1/2 top-1/2 p-1"
          aria-label="Search"
        >
          <svg
            width={17}
            height={16}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        value={inputValue}
        onChange={handleChange}
        className={`input selection:bg-red-100 rounded-md bg-zinc-100 font-semibold text-gray-600 w-full ${
          searchIcon ? "px-8" : "px-4"
        } py-2 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 overflow-hidden whitespace-nowrap text-ellipsis`}
        placeholder={placeholder}
        type="text"
        aria-label="Search input"
      />

      {closeIcon && inputValue && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-3 -translate-y-1/2 top-1/2 p-1"
          aria-label="Clear search"
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