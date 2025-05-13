import React from 'react';
import { FaAngleDown } from 'react-icons/fa6';

const TranslationTypeSelect = ({ value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="vi-ja">Việt - Nhật</option>
        <option value="ja-vi">Nhật - Việt</option>
      </select>
      <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default TranslationTypeSelect;