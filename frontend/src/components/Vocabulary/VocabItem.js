import React from "react";
import { FaLaptopCode } from "react-icons/fa"; // Icon đại diện (có thể thay bằng ảnh)

const VocabItem = ({ icon, titleJP, titleVN, description }) => {
  return (
    <div className="flex items-center bg-white shadow-md rounded-lg p-4 w-80 hover:shadow-lg transition-all cursor-pointer">
      {/* Icon hoặc hình ảnh */}
      <div className="p-3 border rounded-lg bg-red-50">
        {icon ? (icon) : <FaLaptopCode className="text-red-600 size-12" />}
      </div>

      {/* Nội dung */}
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{titleJP}</h3>
        <p className="text-sm text-gray-600">{titleVN}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default VocabItem;
