import React, { useState, useEffect } from 'react';
import FlashcardInClass from '@/components/ClassCard/FlashcardCurrent';
import { addFlashcardToLearn } from '@/api/addFlashcardToLearn'; 
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddFlashcardToClass = ({ 
  isOpen, 
  onClose, 
  onAddFlashcard, 

  classId,
  onSuccess, 
  onNotification 
}) => {
  const [addedFlashcards, setAddedFlashcards] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/add-flashcard`);
    };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setAddedFlashcards(new Set());
    }
  }, [isOpen]);

  const handleAddFlashcard = async (listId) => {
    if (!classId) {
      if (onNotification) {
        onNotification('error', 'Lỗi: Không tìm thấy thông tin lớp học');
      }
      return;
    }

    if (addedFlashcards.has(listId)) {
      if (onNotification) {
        onNotification('error', 'Học phần này đã được thêm vào lớp học!');
      }
      return;
    }

    setIsAdding(true);
    
    try {
      await addFlashcardToLearn(axiosPrivate, classId, listId); 
      
      setAddedFlashcards(prev => new Set([...prev, listId]));
      
      if (onSuccess) {
        await onSuccess();
      }
      
      if (onAddFlashcard) {
        onAddFlashcard(listId);
      }
      
      if (onNotification) {
        onNotification('success', 'Đã thêm học phần vào lớp học thành công!');
      }
      
    } catch (error) {
      console.error('Error adding flashcard to class:', error);
      if (onNotification) {
        onNotification('error', 'Có lỗi xảy ra khi thêm học phần. Vui lòng thử lại!');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleComplete = () => {
    if (addedFlashcards.size > 0) {
      if (onNotification) {
        onNotification('success', `Đã thêm ${addedFlashcards.size} học phần vào lớp học!`);
      }
    } else {
      if (onNotification) {
        onNotification('success', 'Hoàn tất thêm học phần!');
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-3xl p-10 w-full max-w-4xl max-h-[90vh] overflow-hidden mx-5 text-gray-900 relative shadow-2xl animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xl text-gray-600 transition-all duration-300 hover:rotate-90 z-10"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex-shrink-0 mb-8">
          <h1 className="text-3xl font-semibold mb-4 tracking-tight text-gray-800">
            Thêm học phần
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-800">
                Học phần của bạn
              </span>
              {addedFlashcards.size > 0 && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Đã thêm: {addedFlashcards.size}
                </span>
              )}
            </div>
            <button
              onClick={handleClick}
              className="text-red-700 hover:text-red-800 text-sm flex items-center gap-2 hover:bg-red-50 px-3 py-2 rounded-full transition-all duration-300"
            >
              <span className="text-lg">+</span>
              Tạo mới
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 pr-2">
          <FlashcardInClass 
            showAddButton={true} 
            classId={classId}     
            onAddFlashcard={handleAddFlashcard}
            addedFlashcards={addedFlashcards}
            isAdding={isAdding}
            onSuccess={onSuccess} 
          />
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleComplete}
            disabled={isAdding}
            className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {isAdding ? 'Đang thêm...' : 'Hoàn tất'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

AddFlashcardToClass.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddFlashcard: PropTypes.func,
  onCreateNew: PropTypes.func,
  classId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onNotification: PropTypes.func // Thêm prop validation
};

export default AddFlashcardToClass;