import React from 'react';
import { motion } from 'framer-motion';
import { BiUser } from 'react-icons/bi';

const BattleScoreHeader = ({ user, gameData, scores, questionNumber, totalQuestions }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-center"
      >
        <motion.img
          key={scores[user?.user_id]}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          src={user?.profile_picture}
          alt={user?.username}
          className="w-16 h-16 rounded-full mx-auto mb-2 border-3 border-blue-400 shadow-lg"
        />
        <p className="font-bold text-sm text-blue-700">{user?.username}</p>
        <motion.p
          key={scores[user?.user_id]}
          initial={{ scale: 1.5, color: '#3B82F6' }}
          animate={{ scale: 1, color: '#1E40AF' }}
          className="text-3xl font-bold"
        >
          {scores[user?.user_id] || 0}
        </motion.p>
        <p className="text-xs text-gray-500">điểm</p>
      </motion.div>

      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg">
          <p className="font-bold text-lg">Câu {questionNumber}/{totalQuestions}</p>
        </div>
        <motion.div
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-3 mx-auto"
          style={{ maxWidth: '200px' }}
        />
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-center"
      >
        <motion.div
          key={scores[gameData?.opponent?.user_id]}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 rounded-full mx-auto mb-2 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center border-3 border-purple-400 shadow-lg"
        >
          <BiUser className="text-white text-2xl" />
        </motion.div>
        <p className="font-bold text-sm text-purple-700">{gameData?.opponent?.username}</p>
        <motion.p
          key={scores[gameData?.opponent?.user_id]}
          initial={{ scale: 1.5, color: '#A855F7' }}
          animate={{ scale: 1, color: '#7C3AED' }}
          className="text-3xl font-bold"
        >
          {scores[gameData?.opponent?.user_id] || 0}
        </motion.p>
        <p className="text-xs text-gray-500">điểm</p>
      </motion.div>
    </div>
  </motion.div>
);

export default BattleScoreHeader;