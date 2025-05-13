// frontend/src/components/ReviewLearnRound/ReviewItem.js
import React from "react";

const ReviewItem = ({ index, frontText, backText }) => (
  <li className="p-4 border-2 rounded-lg border-gray-100">
    <div className="flex flex-row w-full">
      {/* Số thứ tự */}
      <div className="w-24 min-w-[200px] space-x-2 flex-shrink-0 flex items-center justify-start text-gray-500 font-medium">
        <div>{index}</div>
        <div className="whitespace-pre-line text-gray-900 text-base leading-relaxed">
          {frontText}
        </div>
      </div>
      
      {/* Nội dung */}
      <div className="flex-1 border-l flex items-center bg-white px-5 py-2">
        <div className="whitespace-pre-line text-gray-700 text-base">
          {backText}
        </div>
      </div>
    </div>
  </li>
);

export default ReviewItem;