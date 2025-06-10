import React, { useState,useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { CreateClass } from '@/api/createClass'; 
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

export default function CreateClassModal({ isOpen, setIsOpen, onClassCreated}) {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const axiosPrivate = useAxiosPrivate();
   const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      // Delay unmount để animation hoàn tất
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isMounted) return null;
  const handleCreate = async () => {
    if (!className.trim()) {
      setError('Tên lớp học không được để trống');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const newClass = await CreateClass(axiosPrivate, className.trim(), description.trim());
      setClassName('');
      setDescription('');
      setIsOpen(false);

      if (onClassCreated) {
        onClassCreated(newClass);
      }
      
      console.log('Tạo lớp thành công:', newClass);
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo lớp học. Vui lòng thử lại.');
      console.error('Lỗi tạo lớp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setClassName('');
    setDescription('');
    setError('');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
            <div className="flex justify-end p-4">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
            </div>
            <div className="px-8 pb-8 pt-0">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center relative">
                  <Users size={32} className="text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-gray-800 text-lg font-semibold text-center mb-6">
                Tạo lớp học miễn phí của bạn
              </h2>
              
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Tên lớp học (bắt buộc)"
                    className="w-full text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả lớp học (tùy chọn)"
                    rows={3}
                    className="w-full text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 resize-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleCreate}
                  disabled={!className.trim() || isLoading}
                  className="bg-red-700 hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo lớp'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}