import React from 'react';
import { motion } from 'framer-motion';
import { IoGameController, IoSearch } from 'react-icons/io5';

const BattleWaitingScreen = ({ onJoinQueue, connected, loading }) => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-8 flex items-center justify-center shadow-lg"
      >
        <IoGameController className="text-white text-4xl" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Battle Arena
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-10 text-lg leading-relaxed"
      >
        Thách đấu với người chơi khác và khẳng định kiến thức của bạn!
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onJoinQueue}
        disabled={!connected || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
            />
            <span>Đang tìm đối thủ...</span>
          </>
        ) : (
          <>
            <IoSearch className="text-2xl" />
            <span>Tìm đối thủ</span>
          </>
        )}
      </motion.button>
    </motion.div>
  </div>
);

export default BattleWaitingScreen;