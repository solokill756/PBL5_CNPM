import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoRibbonOutline } from "react-icons/io5";
import { GrAchievement } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";
import useTopicStore from "../../store/useTopicStore";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const VocabularyLevel = ({ userLevel }) => {
  const {
    current_level,
    total_points,
    levelThreshold,
    total_words_mastered,
    total_topics_completed,
    progress_percent,
  } = userLevel;

  const [nextLevelRewards, setNextLevelRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const { getNextLevelRewards } = useTopicStore();
  const axios = useAxiosPrivate();

  const pointsNeeded = levelThreshold - total_points;

  // Fetch rewards for next level
  useEffect(() => {
    const fetchNextLevelRewards = async () => {
      if (pointsNeeded > 0) {
        try {
          setLoadingRewards(true);
          const rewards = await getNextLevelRewards(axios, current_level + 1);
          setNextLevelRewards(rewards);
        } catch (error) {
          console.error("Error fetching next level rewards:", error);
          setNextLevelRewards([]);
        } finally {
          setLoadingRewards(false);
        }
      }
    };

    fetchNextLevelRewards();
  }, [current_level, pointsNeeded, getNextLevelRewards, axios]);

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
          
          {loadingRewards ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              {/* <span className="ml-2 text-gray-500">Đang tải phần thưởng...</span> */}
            </div>
          ) : nextLevelRewards.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {nextLevelRewards.map((reward) => (
                <motion.div
                  key={reward.achievement_id}
                  whileHover={{ y: -2 }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full flex items-center gap-3 shadow-sm"
                >
                  <img 
                    src={reward.icon} 
                    alt={reward.title}
                    className="w-6 h-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-indigo-700">
                      {reward.title}
                    </span>
                    <span className="text-xs text-gray-600">
                      {/* {reward.description} */}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Không có phần thưởng nào cho cấp độ tiếp theo.
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default VocabularyLevel;