import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useVocabularyStore from '@/store/useVocabularyStore';

const SuggestionInputs = ({ suggestions, onSelect, isVisible }) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mt-3 space-y-2"
    >
      <div className="text-xs text-blue-600 font-medium mb-2">GỢI Ý:</div>
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <motion.button
          key={index}
          type="button"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(suggestion.word)}
          className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
        >
          <div className="text-sm font-medium text-gray-900">{suggestion.word}</div>
          {/* {suggestion.pronunciation && (
            <div className="text-xs text-blue-600 mt-1">{suggestion.pronunciation}</div>
          )} */}
        </motion.button>
      ))}
    </motion.div>
  );
};

const FlashcardFormItem = ({ flashcard, index }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [showAddButton, setShowAddButton] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [frontFocused, setFrontFocused] = useState(false)
  const [backFocused, setBackFocused] = useState(false)

  const dragControls = useDragControls()
  const itemRef = useRef<HTMLDivElement>(null)
  const axios = useAxiosPrivate();

  const { updateFlashcard, removeFlashcard, duplicateFlashcard, reorderFlashcards, flashcards, addFlashcardAt } =
    useAddFlashcardStore()

  const { searchVocabulary } = useVocabularyStore()

  // Memoized suggestions fetcher
  const fetchSuggestions = useCallback(
    async (term) => {
      if (!term.trim() || term.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        const results = await searchVocabulary(axios, term, "Japanese")
        setSuggestions(results || [])
        setShowSuggestions(results && results.length > 0)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
        setShowSuggestions(false)
      }
    },
    [searchVocabulary],
  )

  // Optimized input change handler
  const handleInputChange = useCallback(
    (field, value) => {
      updateFlashcard(flashcard.id, field, value)

      if (field === "front") {
        if (!value.trim()) {
          setShowSuggestions(false)
          setSuggestions([])
          return
        }

        // Debounced suggestion fetch
        const timeoutId = setTimeout(() => {
          fetchSuggestions(value)
        }, 300)

        return () => clearTimeout(timeoutId)
      }
    },
    [flashcard.id, updateFlashcard, fetchSuggestions],
  )

  const handleSuggestionSelect = useCallback(
    (word) => {
      updateFlashcard(flashcard.id, "front", word)
      setShowSuggestions(false)
      setSuggestions([])
    },
    [flashcard.id, updateFlashcard],
  )

  const handleDragEnd = useCallback(
    (event, info) => {
      setIsDragging(false)

      // Simple reorder logic based on drag distance
      const dragDistance = info.offset.y
      const threshold = 100

      if (Math.abs(dragDistance) > threshold) {
        const direction = dragDistance > 0 ? 1 : -1
        const newIndex = Math.max(0, Math.min(flashcards.length - 1, index + direction))

        if (newIndex !== index) {
          reorderFlashcards(index, newIndex)
        }
      }
    },
    [index, flashcards.length, reorderFlashcards],
  )

  const canDelete = flashcards.length > 2

  // Memoized handlers
  const handleDelete = useCallback(() => {
    if (canDelete) {
      removeFlashcard(flashcard.id)
    }
  }, [canDelete, flashcard.id, removeFlashcard])

  const handleDuplicate = useCallback(() => {
    duplicateFlashcard(index)
  }, [index, duplicateFlashcard])

  const handleAddCard = useCallback(() => {
    addFlashcardAt(index)
  }, [index, addFlashcardAt])

  return (
    <motion.div
      ref={itemRef}
      className={`group relative bg-white rounded-xl border transition-all duration-200 ${
        isDragging ? "opacity-80 scale-[0.98] shadow-2xl z-10" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      layout
      transition={{
        layout: { duration: 0.3, ease: "easeInOut" },
        default: { duration: 0.2 },
      }}
      drag="y"
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
      whileHover={{ scale: isDragging ? 1 : 1.01 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-b border-gray-100 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <motion.div
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onPointerDown={(e) => dragControls.start(e)}
          >
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
          </motion.div>

          <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium text-sm">
            {index + 1}
          </div>
        </div>

        <motion.div
          className="flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={handleDuplicate}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Nhân bản"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </motion.button>

          {canDelete && (
            <motion.button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Xóa"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Japanese input */}
          <div className="space-y-2 relative">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Tiếng Nhật</label>
            <div className="relative">
              <input
                type="text"
                value={flashcard.front}
                onChange={(e) => handleInputChange("front", e.target.value)}
                onFocus={() => {
                  setFrontFocused(true)
                  if (flashcard.front.length >= 2) {
                    fetchSuggestions(flashcard.front)
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setFrontFocused(false)
                    // setShowSuggestions(false)
                  }, 150)
                }}
                className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 text-sm ${
                  frontFocused
                    ? "border-blue-400 ring-2 ring-blue-100 bg-blue-50/30"
                    : flashcard.front
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50"
                } focus:outline-none`}
                placeholder="Nhập từ tiếng Nhật..."
              />

              <AnimatePresence>
                <SuggestionInputs
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                  isVisible={showSuggestions && frontFocused}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Vietnamese input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Tiếng Việt</label>
            <input
              type="text"
              value={flashcard.back}
              onChange={(e) => handleInputChange("back", e.target.value)}
              onFocus={() => setBackFocused(true)}
              onBlur={() => setBackFocused(false)}
              className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 text-sm ${
                backFocused
                  ? "border-green-400 ring-2 ring-green-100 bg-green-50/30"
                  : flashcard.back
                    ? "border-gray-300 bg-white"
                    : "border-gray-200 bg-gray-50"
              } focus:outline-none`}
              placeholder="Nhập nghĩa tiếng Việt..."
            />
          </div>
        </div>
      </div>

      {/* Add button */}
      <AnimatePresence>
        {showAddButton && !isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-3 left-[48.75%] transform -translate-x-1/2 z-10"
          >
            <motion.button
              onClick={handleAddCard}
              className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Thêm thẻ mới"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FlashcardFormItem