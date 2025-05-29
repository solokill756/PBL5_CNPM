import React from 'react';
import { motion } from 'framer-motion';
import { IoBookmarkOutline, IoBookmark, IoCheckmarkCircle } from 'react-icons/io5';

const VocabularyItem = ({
  vocabulary,
  isSelected,
  onClick,
  onToggleBookmark,
  onMarkLearned,
  index,
  total,
}) => {
  const { vocab_id, word, pronunciation, meaning, level, isBookmarked, isKnown } = vocabulary;

  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className={`p-4 border rounded-lg mb-3 cursor-pointer transition-all ${
        isSelected
          ? "border-indigo-300 bg-indigo-50"
          : "border-gray-200 hover:border-indigo-200"
      } ${isKnown ? "border-green-200 bg-green-50" : ""}`}
    >
      <div className="flex justify-between items-start">
        {/* Phần nội dung chính với overflow và ellipsis */}
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Từ vựng có thể dài, nên dùng truncate và flex-wrap */}
            <h3 className="text-lg font-semibold text-gray-900 break-words">
              {word}
            </h3>
            {isKnown && (
              <span className="text-xs text-green-500 font-medium flex items-center gap-1 flex-shrink-0">
                <IoCheckmarkCircle /> Đã học
              </span>
            )}
          </div>
          
          {/* Cách đọc - nên dùng overflow-ellipsis */}
          <p className="text-sm text-gray-500 mb-1 overflow-hidden text-ellipsis">
            {pronunciation}
          </p>
          
          {/* Nghĩa - giới hạn 2 dòng với line-clamp */}
          <p className="text-gray-700 line-clamp-2 text-sm">
            {meaning}
          </p>
        </div>
        
        {/* Phần nút và nhãn cấp độ */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {level && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium whitespace-nowrap">
                {level}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(vocab_id);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked
                  ? "bg-yellow-50 text-yellow-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {isBookmarked ? (
                <IoBookmark className="w-5 h-5" />
              ) : (
                <IoBookmarkOutline className="w-5 h-5" />
              )}
            </motion.button>
            
            {!isKnown && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkLearned(vocab_id);
                }}
                className="p-1.5 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50"
              >
                <IoCheckmarkCircle className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VocabularyItem;