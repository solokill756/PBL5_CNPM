import React from 'react';
import useVocabularyStore from '@/store/useVocabularyStore';
import { motion } from 'framer-motion';

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

const CategoryCard = ({ topic_id, name, description, image_url, loading = false, index = 0 }) => {
  const { fetchVocabularyByCategory } = useVocabularyStore();
  const colors = getColorByIndex(index);

  const handleClick = () => {
    fetchVocabularyByCategory(topic_id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleClick}
      className={`
        rounded-xl p-6 cursor-pointer
        bg-gradient-to-r ${colors.bg} ${colors.hover}
        border ${colors.border}
        transition-all duration-300 ease-in-out
        hover:shadow-lg
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className={`text-xl font-bold truncate max-w-[200px] mb-2 ${colors.text}`}>
              {name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {description}
            </p>
          </div>
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://placehold.co/64x64/indigo/white/png?text=IT';
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;