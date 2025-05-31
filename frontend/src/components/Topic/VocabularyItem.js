import React from 'react';
import { motion } from 'framer-motion';
import { IoBookmarkOutline, IoBookmark, IoCheckmarkCircle } from 'react-icons/io5';
import useTopicStore from '@/store/useTopicStore';

const VocabularyItem = ({
  vocabulary,
  isSelected,
  onClick,
  onToggleBookmark,
  onMarkLearned,
  index,
  total,
}) => {
  const { isBookmarkUpdating, isLearningUpdating } = useTopicStore();
  const { vocab_id, word, pronunciation, meaning, level } = vocabulary;
  
  const isBookmarked = vocabulary.VocabularyUsers?.[0]?.is_saved || vocabulary.isBookmarked || false;
  const isKnown = vocabulary.VocabularyUsers?.[0]?.had_learned || vocabulary.isKnown || false;
  
  // Check loading state cho vocabulary cụ thể này
  const isThisBookmarkUpdating = isBookmarkUpdating(vocab_id);
  const isThisLearningUpdating = isLearningUpdating(vocab_id);

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
      } ${isKnown ? "border-green-400 " : ""}`}
    >
      <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
        {/* Content section */}
        <div className="min-w-0">
          <div className="flex items-start gap-3 mb-1">
            <h3 className={`text-lg font-semibold break-words flex-1 ${
              'text-gray-900'
            }`}>
              {word}
            </h3>
            {isKnown && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs text-green-600 font-medium flex items-center gap-1 flex-shrink-0 bg-green-100 px-2 py-1 rounded-full mt-0.5"
              >
                Đã học
              </motion.span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mb-1 overflow-hidden text-ellipsis">
            {pronunciation}
          </p>
          
          <p className={`line-clamp-2 text-sm ${
            isKnown ? 'text-gray-600' : 'text-gray-700'
          }`}>
            {meaning}
          </p>
        </div>
        
        {/* Actions section */}
        <div className="flex flex-col items-end gap-2">
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
                if (!isThisBookmarkUpdating) onToggleBookmark(vocab_id);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked
                  ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              } ${isThisBookmarkUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isThisBookmarkUpdating}
              title={isBookmarked ? "Bỏ bookmark" : "Thêm bookmark"}
            >
              <motion.div
                animate={{ 
                  scale: isBookmarked ? [1, 1.2, 1] : 1,
                  rotate: isBookmarked ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {isThisBookmarkUpdating ? (
                  <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                ) : isBookmarked ? (
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
                  if (!isThisLearningUpdating) onMarkLearned(vocab_id);
                }}
                className={`p-1.5 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors ${
                  isThisLearningUpdating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isThisLearningUpdating}
                title="Đánh dấu đã học"
              >
                {isThisLearningUpdating ? (
                  <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IoCheckmarkCircle className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VocabularyItem;