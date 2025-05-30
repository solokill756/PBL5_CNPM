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
  const { vocab_id, word, pronunciation, meaning, level } = vocabulary;
  
  // Kiểm tra trạng thái từ cả hai nguồn để đảm bảo sync
  const isBookmarked = vocabulary.VocabularyUsers?.[0]?.is_saved || vocabulary.isBookmarked || false;
  const isKnown = vocabulary.VocabularyUsers?.[0]?.had_learned || vocabulary.isKnown || false;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
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
            <h3 className={`text-lg font-semibold break-words ${
              'text-gray-900'
            }`}>
              {word}
            </h3>
            {isKnown && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs text-green-600 font-medium flex items-center gap-1 flex-shrink-0 bg-green-100 px-2 py-1 rounded-full"
              >
                <IoCheckmarkCircle className="w-3 h-3" /> Đã học
              </motion.span>
            )}
          </div>
          
          {/* Cách đọc - nên dùng overflow-ellipsis */}
          <p className="text-sm text-gray-500 mb-1 overflow-hidden text-ellipsis">
            {pronunciation}
          </p>
          
          <p className={`line-clamp-2 text-sm ${
            isKnown ? 'text-gray-600' : 'text-gray-700'
          }`}>
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
                  ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
              title={isBookmarked ? "Bỏ bookmark" : "Thêm bookmark"}
            >
              <motion.div
                animate={{ 
                  scale: isBookmarked ? [1, 1.2, 1] : 1,
                  rotate: isBookmarked ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {isBookmarked ? (
                  <IoBookmark className="w-5 h-5" />
                ) : (
                  <IoBookmarkOutline className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>
            
            {!isKnown && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkLearned(vocab_id);
                }}
                className="p-1.5 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Đánh dấu đã học"
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