import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import ToggleSwitch from '../ToggleSwitch';

const FloatingInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  multiline = false, 
  rows = 3,
  className = '',
  icon = null 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value && value.trim().length > 0);
  }, [value]);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const inputClasses = `w-full px-4 ${multiline ? 'py-3 pt-6' : 'pb-2 pt-6'} text-sm bg-gray-50 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer transition-all duration-200 resize-none ${className}`;

  const labelClasses = `absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
    isFocused || hasValue ? 'text-blue-600 scale-75 -translate-y-4' : 'text-gray-500 scale-100 translate-y-0'
  }`;

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          className={inputClasses}
        />
      )}
      
      <label className={labelClasses}>
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </label>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, isPublic, setIsPublic, allowStudyFromClass, setAllowStudyFromClass }) => {
  if (!isOpen) return null;

  // Handle toggle changes - extract checked value from event
  const handlePublicToggle = (e) => {
    setIsPublic(e.target.checked);
  };

  const handleClassToggle = (e) => {
    setAllowStudyFromClass(e.target.checked);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt học phần</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-gray-900">Công khai</h4>
                <p className="text-sm text-gray-500">Mọi người có thể tìm thấy và học bộ thẻ này</p>
              </div>
              <ToggleSwitch 
                checked={isPublic} 
                onChange={handlePublicToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-gray-900">Học từ lớp</h4>
                <p className="text-sm text-gray-500">Thành viên trong lớp có thể truy cập và học</p>
              </div>
              <ToggleSwitch 
                checked={allowStudyFromClass} 
                onChange={handleClassToggle}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Xong
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const FlashcardFormHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [hideDefaultHeader, setHideDefaultHeader] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const sentinelRef = useRef(null);
  const containerRef = useRef(null); // Thêm ref cho container
  const axios = useAxiosPrivate();
  
  const { 
    isAutoSaving, 
    lastSavedAt, 
    hasDraft,
    title,
    setTitle,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    allowStudyFromClass,
    setAllowStudyFromClass,
    saving,
    error,
    successMessage,
    saveFlashcardSet,
    flashcards
  } = useAddFlashcardStore();

  // Measure header height khi mount và khi content thay đổi
  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
    }
  }, [isSticky, title, isAutoSaving, hasDraft]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Khi sentinel không visible = header đã chạm top = cần sticky
        const shouldBeSticky = !entry.isIntersecting;
        setIsSticky(shouldBeSticky);
        
        // Logic ẩn DefaultHeader khi sticky
        setHideDefaultHeader(shouldBeSticky);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px'
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Effect để ẩn/hiện DefaultHeader
  useEffect(() => {
    const defaultHeader = document.querySelector('[data-default-header]');
    
    if (defaultHeader) {
      if (hideDefaultHeader) {
        defaultHeader.style.transform = 'translateY(-100%)';
        defaultHeader.style.transition = 'transform 0.3s ease-in-out';
      } else {
        defaultHeader.style.transform = 'translateY(0)';
        defaultHeader.style.transition = 'transform 0.3s ease-in-out';
      }
    }
  }, [hideDefaultHeader]);

  const validFlashcards = flashcards.filter(
    card => card.front.trim() && card.back.trim()
  );

  const handleSave = async () => {
    const result = await saveFlashcardSet(axios);
    if (result) {
      // Navigation logic here if needed
    }
  };

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const saved = new Date(timestamp);
    const diffMinutes = Math.floor((now - saved) / (1000 * 60));
    
    if (diffMinutes < 1) return 'ngay bây giờ';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    return saved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div ref={containerRef} className="w-full mx-auto">
      {/* Sentinel element - đặt chính xác tại vị trí cần detect */}
      <div 
        ref={sentinelRef} 
        className="h-px w-full pointer-events-none" 
        style={{ position: 'relative' }}
      />

      {/* Sticky Action Bar */}
      <motion.div
        ref={headerRef}
        className={`transition-all duration-300 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-[60]' 
            : 'relative bg-inherit border-b border-gray-100'
        }`}
        initial={false}
        animate={{
          y: isSticky ? 0 : 0,
          opacity: 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title and Status */}
            <div className="flex items-center space-x-4">
              <motion.h2 
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: isSticky ? 0.95 : 1 
                }}
                transition={{ duration: 0.2 }}
                className="text-lg font-semibold text-gray-900 truncate max-w-xs"
              >
                {title || 'Học phần mới'}
              </motion.h2>
              
              <div className="flex items-center space-x-3">
                {/* Flashcard count */}
                <motion.div 
                  className="flex items-center space-x-1 bg-gray-100 px-3 py-1.5 rounded-full"
                  animate={{ scale: isSticky ? 0.9 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm text-gray-600">{validFlashcards.length}</span>
                  <span className="text-xs text-gray-500">thẻ</span>
                </motion.div>

                {/* Auto-save status */}
                {isAutoSaving ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: isSticky ? 0.9 : 1 }}
                    className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm"
                  >
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="font-medium">Đang lưu...</span>
                  </motion.div>
                ) : hasDraft && lastSavedAt ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: isSticky ? 0.9 : 1 }}
                    className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm"
                  >
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Đã lưu {formatLastSaved(lastSavedAt)}</span>
                  </motion.div>
                ) : null}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                title="Cài đặt"
              >
                <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <motion.button
                onClick={handleSave}
                disabled={saving || !title.trim() || validFlashcards.length < 2}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  saving || !title.trim() || validFlashcards.length < 2
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                }`}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
                animate={{ scale: isSticky ? 0.95 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Tạo và ôn luyện</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spacer khi sticky để tránh content bị nhảy - sử dụng headerHeight thực tế */}
      {isSticky && (
        <div style={{ height: `${headerHeight}px` }} />
      )}

      {/* Form Fields - chỉ hiện khi không sticky */}
      {!isSticky && (
        <motion.div 
          className="px-4 mt-2"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <div className="space-y-6">
            <FloatingInput
              label="Tiêu đề học phần"
              value={title}
              onChange={setTitle}
            />

            <FloatingInput
              label="Mô tả (không bắt buộc)"
              value={description}
              onChange={setDescription}
              multiline={true}
              rows={3}
            />

            {/* Settings Preview */}
            <div className="flex items-center space-x-4 text-sm">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
                isPublic ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">{isPublic ? 'Công khai' : 'Riêng tư'}</span>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
                allowStudyFromClass ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                <span className="font-medium">{allowStudyFromClass ? 'Cho phép học từ lớp' : 'Không cho phép học từ lớp'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        allowStudyFromClass={allowStudyFromClass}
        setAllowStudyFromClass={setAllowStudyFromClass}
      />
    </div>
  );
};

export default FlashcardFormHeader;