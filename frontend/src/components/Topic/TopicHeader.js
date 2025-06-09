import React from "react";
import { motion } from "framer-motion";
import { IoArrowBack, IoSchool } from "react-icons/io5";
import { TbCards } from "react-icons/tb";

// ... existing code ...

const TopicHeader = ({
  topic,
  onBack,
  onCreateFlashcard,
  onTakeTest,
  topicProgress,
  learnedCount,
  totalCount,
  isTopicCompleted = false,
  hasTestTaken = false, // Prop để check test đã làm chưa cho topic này
}) => {
  // Logic: phải học hết từ vựng và chưa làm test
  const canTakeTest = isTopicCompleted && !hasTestTaken;
  const testButtonText = hasTestTaken ? "Đã hoàn thành test" : "Làm bài test";

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
                e.target.src =
                  "https://placehold.co/64x64/indigo/white/png?text=IT";
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{topic?.name}</h1>
            <p className="text-gray-600">{topic?.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
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
              className={`h-2 rounded-full transition-all duration-300 ${
                isTopicCompleted ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${topicProgress}%` }}
            ></div>
          </div>
          {isTopicCompleted && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-green-600 font-medium mt-1"
            >
              🎉 Hoàn thành!
            </motion.span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Test button - hiển thị khi học xong và chưa làm test */}
          {canTakeTest && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTakeTest}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors"
            >
              <IoSchool className="w-5 h-5" />
              {testButtonText}
            </motion.button>
          )}

          {/* Test button disabled - hiển thị khi đã làm test */}
          {hasTestTaken && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-200"
            >
              <IoSchool className="w-5 h-5" />
              {testButtonText}
            </motion.div>
          )}

          {/* Hiển thị thông báo nếu chưa học hết */}
          {!isTopicCompleted && (
            <div className="text-sm flex items-center text-gray-500 px-4 py-2 bg-gray-100 rounded-full">
              Học hết {totalCount - learnedCount} từ còn lại để mở khóa test
            </div>
          )}

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
    </div>
  );
};

export default TopicHeader;
