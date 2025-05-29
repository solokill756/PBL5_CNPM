import React from 'react';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import { TbCards } from 'react-icons/tb';

const TopicHeader = ({ 
  topic, 
  onBack, 
  onCreateFlashcard,
  topicProgress,
  learnedCount,
  totalCount
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <IoArrowBack className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={topic?.image_url}
              alt={topic?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://placehold.co/64x64/indigo/white/png?text=IT";
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {topic?.name}
            </h1>
            <p className="text-gray-600">{topic?.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Progress indicator */}
        <div className="flex flex-col items-end justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {topicProgress}% hoàn thành
            </span>
            <span className="text-xs text-gray-500">
              {learnedCount}/{totalCount} từ
            </span>
          </div>
          <div className="w-40 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${topicProgress}%` }}
            ></div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateFlashcard}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <TbCards className="w-5 h-5" />
          Tạo Flashcard
        </motion.button>
      </div>
    </div>
  );
};

export default TopicHeader;