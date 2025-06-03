import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSettings, FiShuffle } from 'react-icons/fi';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';

const FlashcardFormHeader = () => {
  const { title, setTitle, addFlashcard, flashcards } = useAddFlashcardStore();

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
            Tạo một học phần mới
          </h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            className="text-2xl font-bold w-full border-none outline-none bg-transparent placeholder-gray-400 text-gray-900"
          />
          <input
            type="text"
            placeholder="Thêm mô tả..."
            className="text-base w-full border-none outline-none bg-transparent placeholder-gray-400 text-gray-600 mt-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addFlashcard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FiPlus className="w-4 h-4" />
              Thêm thẻ
            </motion.button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiShuffle className="w-4 h-4" />
              Tạo từ ghi chú
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiSettings className="w-4 h-4" />
              Cài đặt
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Gợi ý</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <IoColorPaletteOutline className="w-5 h-5 text-blue-600" />
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Bàn phím
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FiSettings className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 text-sm text-gray-500">
          {flashcards.filter(card => card.front.trim() || card.back.trim()).length} thuật ngữ
        </div>
      </div>
    </div>
  );
};

export default FlashcardFormHeader;