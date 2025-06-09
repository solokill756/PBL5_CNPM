import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoWarning, IoClose } from 'react-icons/io5';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-100',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-100',
      button: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const colors = colorClasses[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl max-w-md w-full"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-full ${colors.bg}`}>
                <IoWarning className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600 text-sm mt-1">{message}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${colors.button}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;