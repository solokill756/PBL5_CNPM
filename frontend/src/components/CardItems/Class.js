import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Class = ({ title, infor, link }) => {
  const [isOn, setIsOn] = useState(false);
  const toggle = () => setIsOn(!isOn);

  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <Link to={link} className="text-red-700 font-semibold hover:underline text-base">
          {title}
        </Link>
        {infor && (
          <p className="text-sm text-gray-500 mt-1">{infor}</p>
        )}
      </div>
      <div className="w-11 flex justify-end">
        <div
          onClick={toggle}
          className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
            isOn ? 'bg-red-200' : 'bg-gray-200'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              isOn ? 'translate-x-5 bg-red-800' : 'translate-x-0 bg-white'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Class;
