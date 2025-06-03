import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiLoader } from 'react-icons/fi';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const SaveSection = () => {
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const {
    saving,
    error,
    successMessage,
    saveFlashcardSet,
    validateForm,
    clearMessages
  } = useAddFlashcardStore();

  const handleSave = async () => {
    clearMessages();
    const result = await saveFlashcardSet(axios);
    
    if (result) {
      setTimeout(() => {
        navigate(`/flashcard/${result.id}`);
      }, 1500);
    }
  };

  const handleCreateAndStudy = async () => {
    clearMessages();
    const result = await saveFlashcardSet(axios);
    
    if (result) {
      setTimeout(() => {
        navigate(`/flashcard/${result.id}/learn`);
      }, 1500);
    }
  };

  const validation = validateForm();

  return (
    <div className="bg-white border-t border-gray-100 sticky bottom-0">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm mb-2 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                {error}
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-sm mb-2 flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                {successMessage}
              </motion.div>
            )}
            
            {!validation.isValid && validation.errors.length > 0 && (
              <div className="text-orange-600 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                {validation.errors[0]}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              disabled={saving}
              className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving || !validation.isValid}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2 text-gray-700"
            >
              Tạo
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateAndStudy}
              disabled={saving || !validation.isValid}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[160px] justify-center font-medium"
            >
              {saving ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo và ôn luyện"
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSection;