import React from 'react';
import { motion } from 'framer-motion';

const BattleConnectionStatus = ({ connected, connectionError, user }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-xl mb-6 ${
      connected 
        ? "bg-green-50 border-2 border-green-200" 
        : "bg-red-50 border-2 border-red-200"
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ 
            scale: connected ? [1, 1.2, 1] : 1,
            opacity: connected ? [1, 0.7, 1] : 1 
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-4 h-4 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className={`font-semibold ${
          connected ? "text-green-700" : "text-red-700"
        }`}>
          {connected ? "Đã kết nối" : "Mất kết nối"}
        </span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <img
            src={user.profile_picture}
            alt={user.username}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
          <span className="font-medium text-gray-700">{user.username}</span>
        </div>
      )}
    </div>
    {connectionError && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="text-red-600 text-sm mt-3 font-medium"
      >
        {connectionError}
      </motion.p>
    )}
  </motion.div>
);

export default BattleConnectionStatus;