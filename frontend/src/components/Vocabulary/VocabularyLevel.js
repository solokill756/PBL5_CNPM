import React from "react";
import { motion } from "framer-motion";
import { IoRibbonOutline } from "react-icons/io5";
import { GrAchievement } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";

const VocabularyLevel = ({ userLevel }) => {
  const {
    current_level,
    total_points,
    levelThreshold,
    total_words_mastered,
    total_topics_completed,
    progress_percent,
  } = userLevel;

  const pointsNeeded = levelThreshold - total_points;

  // Thông tin phần thưởng cho cấp độ tiếp theo
  const getNextLevelRewards = (level) => {
    const rewardsByLevel = {
      1: {
        topics: ["Điện toán đám mây"],
        badges: ["Cloud Beginner"],
        themes: ["Cloud Theme"],
      },
      2: {
        topics: ["AI và Machine Learning"],
        badges: ["AI Explorer"],
        themes: ["Tech Theme"],
      },
      3: {
        topics: ["Blockchain & Web3"],
        badges: ["Blockchain Master"],
        themes: ["Crypto Theme"],
      },
      4: {
        topics: ["DevOps & Infrastructure"],
        badges: ["DevOps Expert"],
        themes: ["Dark Tech Theme"],
      },
      default: {
        topics: ["Advanced Topics"],
        badges: ["Expert"],
        themes: ["Premium Theme"],
      }
    };

    return rewardsByLevel[current_level] || rewardsByLevel.default;
  };

  const nextLevelRewards = getNextLevelRewards(current_level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100 mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-3xl font-bold shadow-md"
          >
            {current_level}
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Cấp độ {current_level}</h2>
            <div className="flex flex-wrap items-center gap-x-4 text-gray-600">
              <div className="flex items-center gap-1 text-sm font-medium">
                <FaRegStar className="text-yellow-500 size-4" />
                <span>{total_words_mastered} từ vựng</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <GrAchievement className="text-green-500 size-4" />
                <span>{total_topics_completed} chủ đề</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">
              {total_points} / {levelThreshold} điểm
            </span>
            <span className="text-gray-500">Cấp {current_level}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress_percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full flex items-center justify-end"
            >
              {progress_percent > 20 && (
                <span className="text-xs text-white font-bold mr-2">
                  {progress_percent}%
                </span>
              )}
            </motion.div>
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">
            {pointsNeeded > 0 
              ? `Còn ${pointsNeeded} điểm để lên cấp ${current_level + 1}`
              : `Đã đạt tối đa cấp độ!`
            }
          </p>
        </div>
      </div>

      {/* Rewards Section - Only show if not at max level */}
      {pointsNeeded > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <IoRibbonOutline className="text-indigo-500" />
            Phần thưởng mở khóa ở cấp {current_level + 1}:
          </h3>
          <div className="flex flex-wrap gap-3">
            {nextLevelRewards.topics.map((topic) => (
              <motion.span
                key={topic}
                whileHover={{ y: -2 }}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm flex items-center gap-1"
              >
                Chủ đề: {topic}
              </motion.span>
            ))}
            {nextLevelRewards.badges.map((badge) => (
              <motion.span
                key={badge}
                whileHover={{ y: -2 }}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center gap-1"
              >
                Huy hiệu: "{badge}"
              </motion.span>
            ))}
            {nextLevelRewards.themes.map((theme) => (
              <motion.span
                key={theme}
                whileHover={{ y: -2 }}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1"
              >
                {theme}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VocabularyLevel;