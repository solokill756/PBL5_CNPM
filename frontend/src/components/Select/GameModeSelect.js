import React from 'react';
import { motion } from 'framer-motion';
import { IoLanguage, IoGrid } from 'react-icons/io5';

const modeOptions = [
  {
    id: 'vocabulary',
    title: 'Đấu từ vựng',
    description: 'Chọn nghĩa đúng của từ vựng tiếng Nhật',
    icon: <IoLanguage className="w-8 h-8" />,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'matching',
    title: 'Ghép thẻ từ vựng',
    description: 'Ghép từ tiếng Nhật với nghĩa tiếng Việt tương ứng',
    icon: <IoGrid className="w-8 h-8" />,
    color: 'from-green-500 to-teal-600'
  }
];

const GameModeSelect = ({ selectedMode, onSelectMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Chọn chế độ chơi:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modeOptions.map((mode) => (
          <motion.div
            key={mode.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode(mode.id)}
            className={`
              cursor-pointer rounded-xl p-4 border-2 transition-all 
              ${selectedMode === mode.id 
                ? `border-indigo-500 bg-gradient-to-r ${mode.color} text-white` 
                : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
              }
            `}
          >
            <div className="flex items-center">
              <div className={`
                rounded-full p-2 mr-3
                ${selectedMode === mode.id 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-indigo-100'
                }
              `}>
                {mode.icon}
              </div>
              <div>
                <h4 className={`font-bold ${selectedMode === mode.id ? 'text-white' : 'text-gray-800'}`}>{mode.title}</h4>
                <p className={`text-sm ${selectedMode === mode.id ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                  {mode.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GameModeSelect;