import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BsThreeDotsVertical, BsGripVertical } from 'react-icons/bs';
import { FiTrash2, FiCopy, FiPlus } from 'react-icons/fi';
import { HiOutlineLanguage } from 'react-icons/hi2';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';

const FlashcardFormItem = ({ flashcard, index, onAddBelow }) => {
  const [showAddButton, setShowAddButton] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { updateFlashcard, removeFlashcard, duplicateFlashcard, flashcards } = useAddFlashcardStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: flashcard.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const menuItems = [
    {
      label: 'Sao chép thẻ',
      icon: <FiCopy className="w-4 h-4" />,
      onClick: () => duplicateFlashcard(flashcard.id),
    },
    ...(flashcards.length > 2 ? [{
      label: 'Xóa thẻ',
      icon: <FiTrash2 className="w-4 h-4" />,
      onClick: () => removeFlashcard(flashcard.id),
      className: 'text-red-600 hover:bg-red-50',
    }] : []),
  ];

  return (
    <div className="relative">
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
        className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 ${
          isDragging 
            ? 'opacity-50 shadow-2xl border-blue-200 bg-blue-50/50' 
            : focusedField 
            ? 'border-blue-200 shadow-lg' 
            : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
        }`}
      >
        {/* Card Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Drag Handle */}
              <div
                {...attributes}
                {...listeners}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
              >
                <BsGripVertical className="w-4 h-4 text-gray-400" />
              </div>
              
              {/* Index */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">{index}</span>
                </div>
                <div className="w-4 h-0.5 bg-gray-200"></div>
              </div>
            </div>
            
            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <BsThreeDotsVertical className="w-4 h-4 text-gray-400" />
              </button>
              
              <DropdownMenu isOpen={showMenu} onClose={() => setShowMenu(false)} items={menuItems} />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Front Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  Thuật ngữ
                </label>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineLanguage className="w-3 h-3" />
                  Chọn ngôn ngữ
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  value={flashcard.front}
                  onChange={(e) => updateFlashcard(flashcard.id, 'front', e.target.value)}
                  onFocus={() => setFocusedField('front')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Nhập thuật ngữ"
                  className="w-full px-4 py-4 border-0 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 text-lg font-medium placeholder-gray-400"
                  rows={2}
                />
                {focusedField === 'front' && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
                  />
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-white px-4">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-gray-300 rotate-90"></div>
                    <div className="w-4 h-0.5 bg-gray-300 -ml-4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Định nghĩa
                </label>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineLanguage className="w-3 h-3" />
                  Chọn ngôn ngữ
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  value={flashcard.back}
                  onChange={(e) => updateFlashcard(flashcard.id, 'back', e.target.value)}
                  onFocus={() => setFocusedField('back')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Nhập định nghĩa"
                  className="w-full px-4 py-4 border-0 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 text-lg placeholder-gray-400"
                  rows={2}
                />
                {focusedField === 'back' && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full transition-colors ${flashcard.front.trim() ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-colors ${flashcard.back.trim() ? 'bg-green-400' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </motion.div>

      {/* Add Button Below */}
      <AnimatePresence>
        {showAddButton && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onAddBelow}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            >
              <FiPlus className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Menu Component
const DropdownMenu = ({ isOpen, onClose, items }) => {
  React.useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.dropdown-menu')) {
          onClose();
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="dropdown-menu absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-20 min-w-[160px] overflow-hidden"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 w-full text-left transition-colors ${
                item.className || 'text-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlashcardFormItem;