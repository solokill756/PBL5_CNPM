import React from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BiUser } from 'react-icons/bi';

const BattleGameFoundScreen = ({ user, gameData, totalQuestions }) => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-8 flex items-center justify-center shadow-lg"
      >
        <IoCheckmarkCircle className="text-white text-4xl" />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-8 text-green-700"
      >
        🎮 Đã tìm thấy đối thủ!
      </motion.h2>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 border-2 border-blue-200"
      >
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={user?.profile_picture}
              alt={user?.username}
              className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-blue-400 shadow-lg"
            />
            <p className="font-bold text-blue-700 text-lg">{user?.username}</p>
            <p className="text-blue-500 text-sm">Bạn</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-2xl shadow-lg"
          >
            VS
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center border-4 border-purple-400 shadow-lg"
            >
              <BiUser className="text-white text-3xl" />
            </motion.div>
            <p className="font-bold text-purple-700 text-lg">{gameData?.opponent?.username}</p>
            <p className="text-purple-500 text-sm">Đối thủ</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 gap-6 mb-8"
      >
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-blue-600 font-semibold">Tổng câu hỏi</p>
          <p className="text-2xl font-bold text-blue-800">{totalQuestions}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <p className="text-purple-600 font-semibold">Thời gian/câu</p>
          <p className="text-2xl font-bold text-purple-800">10 giây</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center text-blue-600 font-semibold text-lg"
      >
        ⚡ Đang chuẩn bị bắt đầu...
      </motion.div>
    </motion.div>
  </div>
);

export default BattleGameFoundScreen;