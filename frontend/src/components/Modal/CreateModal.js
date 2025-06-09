import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUsers, FiRefreshCw } from 'react-icons/fi';
import { TbCards } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const CreateModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { loadFromForgottenWords, resetForm } = useAddFlashcardStore();

  const createOptions = [
    {
      id: 'flashcard-new',
      title: 'Học phần',
      description: 'Tạo học phần mới với thẻ ghi nhớ',
      icon: <TbCards className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      onClick: () => {
        // Reset form để đảm bảo bắt đầu với form trống
        resetForm();
        navigate('/add-flashcard');
        onClose();
      }
    },
    {
      id: 'flashcard-forgotten',
      title: 'Từ hay quên',
      description: 'Tạo từ những từ bạn hay quên',
      icon: <FiRefreshCw className="w-6 h-6" />,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      onClick: async () => {
        try {
          // Reset form trước
          resetForm();
          // Navigate trước để user thấy trang đang load
          navigate('/add-flashcard?mode=forgotten');
          onClose();
          // Gọi API để load từ hay quên
          await loadFromForgottenWords(axios, 40);
        } catch (error) {
          console.error('Error loading forgotten words:', error);
          // Nếu có lỗi, navigate về trang bình thường
          navigate('/add-flashcard');
        }
      }
    },
    {
      id: 'class',
      title: 'Lớp học',
      description: 'Tạo lớp học mới cho học sinh',
      icon: <FiUsers className="w-6 h-6" />,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      onClick: () => {
        console.log('Create class functionality');
         navigate('/classes');
        onClose();
      }
    }
  ];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Tạo mới</h3>
                <p className="text-gray-500 text-sm">Chọn loại nội dung bạn muốn tạo</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
              >
                <FiX className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {createOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={option.onClick}
                  className="w-full p-5 bg-white border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-lg transition-all duration-200 text-left group relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${option.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <div className={option.textColor}>
                        {option.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-gray-700">
                        {option.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Bạn có thể thay đổi cài đặt sau khi tạo
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default CreateModal;