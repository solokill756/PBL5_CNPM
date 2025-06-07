import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import { IoLogOut } from 'react-icons/io5';

const BattleQueueScreen = ({ queuePosition, onLeaveQueue }) => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-8 flex items-center justify-center shadow-lg"
      >
        <FiUsers className="text-white text-4xl" />
      </motion.div>

      <motion.h2
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-3xl font-bold mb-6 text-yellow-700"
      >
        Đang tìm đối thủ...
      </motion.h2>
      
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-yellow-200">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-center"
        >
          <p className="text-yellow-700 font-semibold text-lg mb-2">
            Vị trí trong hàng đợi
          </p>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl font-bold text-yellow-600"
          >
            #{queuePosition}
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-gray-500 mb-8 text-lg"
      >
        Đang tìm đối thủ phù hợp...
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLeaveQueue}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
      >
        <IoLogOut className="text-xl" />
        Rời hàng đợi
      </motion.button>
    </motion.div>
  </div>
);

export default BattleQueueScreen;