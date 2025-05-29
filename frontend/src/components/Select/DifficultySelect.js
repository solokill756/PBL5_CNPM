import React from 'react';
import { motion } from 'framer-motion';

const difficulties = [
  { id: 'easy', name: 'Dễ', color: 'bg-green-100 text-green-800', border: 'border-green-300' },
  { id: 'medium', name: 'Trung bình', color: 'bg-blue-100 text-blue-800', border: 'border-blue-300' },
  { id: 'hard', name: 'Khó', color: 'bg-orange-100 text-orange-800', border: 'border-orange-300' }
];

const DifficultySelect = ({ selectedDifficulty, onSelectDifficulty }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Chọn độ khó:</h3>
      <div className="flex flex-wrap gap-3">
        {difficulties.map((difficulty) => (
          <motion.button
            key={difficulty.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDifficulty(difficulty.id)}
            className={`
              px-5 py-2 rounded-full transition-all
              ${selectedDifficulty === difficulty.id 
                ? `${difficulty.color} border-2 ${difficulty.border}` 
                : 'bg-gray-100 text-gray-800 border-2 border-gray-200 hover:bg-gray-200'
              }
            `}
          >
            {difficulty.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelect;