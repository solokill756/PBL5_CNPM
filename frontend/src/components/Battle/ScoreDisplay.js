import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';
import DefaultAvatar from '../../assets/images/avatar.jpg';

const ScoreDisplay = memo(({ player, opponent }) => {
  return (
    <div className="flex justify-between items-center bg-indigo-100 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <img 
          src={player.profile_picture || DefaultAvatar} 
          alt={player.name} 
          className="w-10 h-10 rounded-full mr-2 border-2 border-indigo-500" 
        />
        <div>
          <p className="font-bold text-sm">{player.name}</p>
          <div className="flex items-center">
            <motion.span 
              key={`player-${player.score}`}
              // initial={{ scale: 1.2 }}
              // animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-bold text-lg text-gray-900"
            >
              {player.score}
            </motion.span>
            <span className="text-gray-500 text-sm ml-1">điểm</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full">
        <FaFire className="text-yellow-300" />
        <span className="font-bold">VS</span>
      </div>
      
      <div className="flex items-center">
        <div className="text-right mr-2">
          <p className="font-bold text-sm">{opponent.name}</p>
          <div className="flex items-center justify-end">
            <motion.span 
              key={`opponent-${opponent.score}`}
              // initial={{ scale: 1.2 }}
              // animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-bold text-lg text-gray-900"
            >
              {opponent.score}
            </motion.span>
            <span className="text-gray-500 text-sm ml-1">điểm</span>
          </div>
        </div>
        <img 
          src={opponent.profile_picture || DefaultAvatar} 
          alt={opponent.name} 
          className="w-10 h-10 rounded-full border-2 border-indigo-500" 
        />
      </div>
    </div>
  );
});

ScoreDisplay.displayName = 'ScoreDisplay';

export default ScoreDisplay;