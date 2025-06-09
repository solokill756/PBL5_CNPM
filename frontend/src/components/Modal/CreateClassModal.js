import React, { useState } from 'react';
import { X, Users, Plus } from 'lucide-react';

export default function CreateClassModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const handleCreate = () => {
    if (className.trim()) {
      console.log('Tạo lớp:', { className, schoolName });
      setClassName('');
      setSchoolName('');
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setClassName('');
    setSchoolName('');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <Plus size={20} />
        Tạo lớp học mới
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal Content */}
          <div className="bg-slate-800 rounded-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
            {/* Header with close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 pb-8 pt-0">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users size={32} className="text-white" />
                  <div className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-8 -mt-2">
                    <Plus size={16} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-white text-2xl font-bold text-center mb-2">
                Tạo lớp học miễn phí của bạn
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-center mb-8 leading-relaxed">
                Trao cho học sinh quyền truy cập không giản đoạn vào chế độ 
                Học và Kiểm tra đối với tất cả nội dung trong lớp của bạn. Hoàn 
                toàn miễn phí!
              </p>

              {/* Form */}
              <div className="space-y-4">
                {/* Class Name Input */}
                <div>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Lớp học mới của bạn"
                    className="w-full bg-slate-700 text-white placeholder-gray-400 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* School Name Input */}
                <div>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Tên trường"
                    className="w-full bg-slate-700 text-white placeholder-gray-400 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Create Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleCreate}
                  disabled={!className.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Tạo lớp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}