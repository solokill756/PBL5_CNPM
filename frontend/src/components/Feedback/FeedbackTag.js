import React from "react";

const FeedbackTag = ({ value, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 rounded-md cursor-pointer text-sm font-semibold
        ${selected 
          ? "bg-red-300 text-white border-red-300" 
          : "bg-red-100 text-gray-600 hover:text-white hover:bg-red-300"
        }`}
    >
      {value}
    </div>
  );
};

export default FeedbackTag;
