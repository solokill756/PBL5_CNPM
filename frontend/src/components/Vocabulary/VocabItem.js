import React from "react";

const VocabItem = ({ imgUrl, name, description, onError }) => {
  return (
    <div className="flex items-center bg-white shadow-md rounded-lg p-4 w-full hover:bg-slate-100 hover:shadow-lg transition-all cursor-pointer">
      {/* Icon hoặc hình ảnh */}
      <div className="p-1 border rounded-lg">
        <img onError={onError} src={imgUrl} alt="Img" className="size-12 rounded-md" />
      </div>

      {/* Nội dung */}
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default VocabItem;
