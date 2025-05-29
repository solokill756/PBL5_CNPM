import React from 'react';
import { motion } from 'framer-motion';

const FlashcardModal = ({ isOpen, onClose, onConfirm, topicName, vocabulariesCount }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-bold mb-4">Tạo bộ Flashcard</h3>
        <p className="text-gray-700 mb-6">
          Bạn có muốn tạo bộ flashcard từ {vocabulariesCount} từ vựng trong chủ đề 
          "{topicName}" không?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Tạo Flashcard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlashcardModal;