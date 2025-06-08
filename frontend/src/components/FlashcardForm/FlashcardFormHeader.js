import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import ToggleSwitch from '../ToggleSwitch';
import { useToast, TOAST_TYPES } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';

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

const FlashcardFormHeader = () => {
  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef(null)
  const sentinelRef = useRef(null)

  // Motion values for smooth animations
  const scrollY = useMotionValue(0)
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95])
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98])

  const {
    isAutoSaving,
    lastSavedAt,
    hasDraft,
    title,
    setTitle,
    description,
    setDescription,
    saving,
    saveFlashcardSet,
    flashcards,
    resetForm,
    successMessage
  } = useAddFlashcardStore()

  const { addToast } = useToast();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  // Optimized intersection observer
  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldBeSticky = !entry.isIntersecting
        setIsSticky(shouldBeSticky)
      },
      {
        threshold: 0,
        rootMargin: "-1px 0px 0px 0px",
      },
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  // Smooth scroll tracking
  useEffect(() => {
    const updateScrollY = () => scrollY.set(window.scrollY)
    window.addEventListener("scroll", updateScrollY, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollY)
  }, [scrollY])

  const validFlashcards = flashcards.filter((card) => card.front.trim() && card.back.trim())

  const handleSave = useCallback(async () => {
    const result = await saveFlashcardSet(axios);
    
    if (result.status === "success") {
      resetForm()
      addToast("Tạo bộ flashcard thành công!", TOAST_TYPES.SUCCESS)
      navigate(`/flashcard/${result.data.list_id}`)
    }
  }, [saveFlashcardSet, resetForm])

  const formatLastSaved = useCallback((timestamp) => {
    if (!timestamp) return ""
    const now = new Date()
    const saved = new Date(timestamp)
    const diffMinutes = Math.floor((now - saved) / (1000 * 60))

    if (diffMinutes < 1) return "ngay bây giờ"
    if (diffMinutes < 60) return `${diffMinutes} phút trước`
    return saved.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }, [])

  return (
    <div className="w-full">
      {/* Sentinel for intersection observer */}
      <div ref={sentinelRef} className="h-px w-full" />

      {/* Sticky Header */}
      <motion.div
        ref={headerRef}
        className={`transition-all duration-300 ease-out ${
          isSticky
            ? "fixed top-0 left-0 mb-8 right-0 mx-auto bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-50"
            : "relative mt-8 bg-white border-b border-gray-100"
        }`}
        style={{
          opacity: headerOpacity,
          scale: headerScale,
        }}
      >
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title and Status */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <motion.h2
                className="text-lg font-semibold text-gray-900 truncate"
                animate={{
                  fontSize: isSticky ? "1rem" : "1.125rem",
                }}
                transition={{ duration: 0.2 }}
              >
                {title || "Học phần mới"}
              </motion.h2>

              <div className="flex items-center space-x-3">
                {/* Flashcard count */}
                <motion.div
                  className="flex items-center space-x-1 bg-gray-100 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.1 }}
                >
                  <span className="text-sm font-medium text-gray-700">{validFlashcards.length}</span>
                  <span className="text-xs text-gray-500">thẻ</span>
                </motion.div>

                {/* Auto-save status */}
                <AnimatePresence mode="wait">
                  {isAutoSaving ? (
                    <motion.div
                      key="saving"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm"
                    >
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="font-medium">Đang lưu...</span>
                    </motion.div>
                  ) : hasDraft && lastSavedAt ? (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm"
                    >
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Đã lưu {formatLastSaved(lastSavedAt)}</span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Save Button */}
            <motion.button
              onClick={handleSave}
              disabled={saving || !title.trim() || validFlashcards.length < 2}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                saving || !title.trim() || validFlashcards.length < 2
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
              }`}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>Tạo và ôn luyện</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Spacer when sticky */}
      {isSticky && <div className="h-40" />}

      {/* Form Fields - only show when not sticky */}
      <AnimatePresence>
        {!isSticky && (
          <motion.div
            className="mt-6 w-full mx-auto"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-6">
              <FloatingInput label="Tiêu đề học phần" value={title} onChange={setTitle} />

              <FloatingInput
                label="Mô tả (không bắt buộc)"
                value={description}
                onChange={setDescription}
                multiline={true}
                rows={3}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FlashcardFormHeader