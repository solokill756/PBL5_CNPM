import React from 'react';
import { BsPeople } from 'react-icons/bs';
import { SlGraduation } from "react-icons/sl";
import { MdOutlineDeleteOutline } from "react-icons/md";

const CourseInfoComponent = ({studentCount, listCount, class_name, class_id, canDelete = false, onDelete} ) => {

  const handleDelete = (e) => {
    e.stopPropagation();
    if (canDelete && onDelete) {
      onDelete(class_id);
    }
  };
 
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-2xl hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)] cursor-pointer"  >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-800 mr-2">{listCount} học phần </span>
          </div>
          <div className="flex items-center space-x-2">
            <BsPeople  className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800 mr-2">{studentCount} thành viên </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlGraduation className="w-5 h-5 text-red-800" />
          <span className="text-xl font-bold text-red-800">{class_name}</span>
        </div>
        {canDelete && (
          <MdOutlineDeleteOutline 
            className="w-6 h-6 text-gray-500 hover:text-red-500 cursor-pointer" 
            onClick={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default CourseInfoComponent;