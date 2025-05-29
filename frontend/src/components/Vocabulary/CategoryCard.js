import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLockClosed, IoLockOpenOutline } from 'react-icons/io5';

// Mảng màu gradient cho các category
const CATEGORY_COLORS = [
  {
    bg: 'from-blue-50 to-indigo-100',
    border: 'border-indigo-100',
    text: 'text-indigo-900',
    hover: 'hover:from-blue-100 hover:to-indigo-200'
  },
  {
    bg: 'from-purple-50 to-pink-100',
    border: 'border-pink-100',
    text: 'text-pink-900',
    hover: 'hover:from-purple-100 hover:to-pink-200'
  },
  {
    bg: 'from-green-50 to-emerald-100',
    border: 'border-emerald-100',
    text: 'text-emerald-900',
    hover: 'hover:from-green-100 hover:to-emerald-200'
  },
  {
    bg: 'from-orange-50 to-amber-100',
    border: 'border-amber-100',
    text: 'text-amber-900',
    hover: 'hover:from-orange-100 hover:to-amber-200'
  },
  {
    bg: 'from-red-50 to-rose-100',
    border: 'border-rose-100',
    text: 'text-rose-900',
    hover: 'hover:from-red-100 hover:to-rose-200'
  },
  {
    bg: 'from-cyan-50 to-sky-100',
    border: 'border-sky-100',
    text: 'text-sky-900',
    hover: 'hover:from-cyan-100 hover:to-sky-200'
  }
];

const getColorByIndex = (index) => {
  // Đảm bảo luôn có màu bằng cách lấy phần dư
  const safeIndex = Math.abs(index) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[safeIndex];
};

const CategoryCard = ({ 
  topic_id, 
  name, 
  description, 
  image_url, 
  loading = false, 
  index = 0,
  required_level = 1,
  user_level = 1, // Default level 1
  total_words = 0,
  mastered_words = 0
}) => {
  const navigate = useNavigate();
  const colors = getColorByIndex(index);
  const isLocked = user_level < required_level;
  const progressPercent = total_words > 0 ? Math.round((mastered_words / total_words) * 100) : 0;

  const handleClick = () => {
    if (!isLocked) {
      navigate(`/vocabulary/topic/${topic_id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleClick}
      className={`
        rounded-xl p-5 cursor-pointer
        bg-gradient-to-r ${colors.bg} ${colors.hover}
        border ${colors.border}
        transition-all duration-300 ease-in-out
        ${isLocked ? 'opacity-75 hover:opacity-90' : 'hover:shadow-lg'}
        relative
      `}
    >
      {/* Level badge */}
      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md">
        N{required_level}
      </div>
      
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-xl font-bold truncate max-w-[160px] ${colors.text}`}>
                {name}
              </h3>
              {isLocked ? (
                <IoLockClosed className="text-gray-500" />
              ) : (
                <IoLockOpenOutline className="text-green-600" />
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {description}
            </p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{mastered_words}/{total_words} từ</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
            <img
              src={image_url}
              alt={name}
              className={`w-full h-full object-cover ${isLocked ? 'filter grayscale' : ''}`}
              onError={(e) => {
                e.target.src = 'https://placehold.co/64x64/indigo/white/png?text=IT';
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-10 rounded-xl flex flex-col items-center justify-center">
          <div className="bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-md text-center">
            <p className="text-gray-800 font-semibold">Mở khóa ở cấp độ {required_level}</p>
            <p className="text-xs text-gray-600">Cấp độ hiện tại: {user_level}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryCard;