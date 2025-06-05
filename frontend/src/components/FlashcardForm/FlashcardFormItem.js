import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isDragging, setIsDragging] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionTimeout, setSuggestionTimeout] = useState(null);
  const [frontFocused, setFrontFocused] = useState(false);
  const [backFocused, setBackFocused] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);
  const [lastSelectedWord, setLastSelectedWord] = useState('');
  
  const itemRef = useRef(null);
  const frontInputRef = useRef(null);
  const dragGhostRef = useRef(null);
  const axios = useAxiosPrivate();
  
  const {
    updateFlashcard,
    removeFlashcard,
    duplicateFlashcard,
    reorderFlashcards,
    flashcards,
    addFlashcardAt
  } = useAddFlashcardStore();

  const { searchVocabulary } = useVocabularyStore();

  const fetchSuggestions = useCallback(async (term) => {
    if (!term.trim() || term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Không gọi API nếu term giống với từ vừa chọn
    if (term === lastSelectedWord) {
      return;
    }

    try {
      const results = await searchVocabulary(axios, term, "Japanese");
      setSuggestions(results || []);
      setShowSuggestions(results && results.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [axios, searchVocabulary, lastSelectedWord]);

  const createDragGhost = (e) => {
    const rect = itemRef.current.getBoundingClientRect();
    const ghost = itemRef.current.cloneNode(true);
    
    ghost.style.position = 'fixed';
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.zIndex = '9999';
    ghost.style.opacity = '0.8';
    ghost.style.pointerEvents = 'none';
    ghost.style.transform = 'rotate(3deg) scale(1.02)';
    ghost.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    ghost.classList.add('drag-ghost');
    
    document.body.appendChild(ghost);
    dragGhostRef.current = ghost;
    
    return { offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
  };

  const updateGhostPosition = (e, offset) => {
    if (dragGhostRef.current) {
      dragGhostRef.current.style.left = `${e.clientX - offset.offsetX}px`;
      dragGhostRef.current.style.top = `${e.clientY - offset.offsetY}px`;
    }
  };

  const findDropTarget = (e) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const flashcardElement = elements.find(el => {
      const item = el.closest('[data-flashcard-index]');
      return item && !item.classList.contains('drag-ghost');
    });
    
    if (flashcardElement) {
      const targetIndex = parseInt(flashcardElement.closest('[data-flashcard-index]').dataset.flashcardIndex);
      return isNaN(targetIndex) ? null : targetIndex;
    }
    return null;
  };

  const handleMouseDown = (e) => {
    // Prevent drag on input elements and buttons
    if (e.target.closest('input, button, .no-drag')) return;
    
    const offset = createDragGhost(e);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent) => {
      updateGhostPosition(moveEvent, offset);
      
      // Only start reordering after significant movement
      const distance = Math.sqrt(
        Math.pow(moveEvent.clientX - dragStartPosition.x, 2) + 
        Math.pow(moveEvent.clientY - dragStartPosition.y, 2)
      );
      
      if (distance > 15) {
        const targetIndex = findDropTarget(moveEvent);
        if (targetIndex !== null && targetIndex !== index) {
          // Add visual feedback for drop target
          document.querySelectorAll('[data-flashcard-index]').forEach(el => {
            el.classList.remove('drag-over');
          });
          
          const targetElement = document.querySelector(`[data-flashcard-index="${targetIndex}"]`);
          if (targetElement) {
            targetElement.classList.add('drag-over');
          }
        }
      }
    };
    
    const handleMouseUp = (upEvent) => {
      const targetIndex = findDropTarget(upEvent);
      
      if (targetIndex !== null && targetIndex !== index) {
        const distance = Math.sqrt(
          Math.pow(upEvent.clientX - dragStartPosition.x, 2) + 
          Math.pow(upEvent.clientY - dragStartPosition.y, 2)
        );
        
        if (distance > 15) {
          reorderFlashcards(index, targetIndex);
        }
      }
      
      // Cleanup
      if (dragGhostRef.current) {
        document.body.removeChild(dragGhostRef.current);
        dragGhostRef.current = null;
      }
      
      document.querySelectorAll('[data-flashcard-index]').forEach(el => {
        el.classList.remove('drag-over');
      });
      
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleInputChange = (field, value) => {
    updateFlashcard(flashcard.id, field, value);
    
    if (field === 'front') {
      // Clear timeout nếu có
      if (suggestionTimeout) {
        clearTimeout(suggestionTimeout);
      }
      
      // Nếu đang trong quá trình chọn suggestion, bỏ qua
      if (isSelectingSuggestion) {
        return;
      }
      
      // Reset lastSelectedWord nếu user thay đổi từ đã chọn
      if (value !== lastSelectedWord) {
        setLastSelectedWord('');
      }
      
      // Ẩn suggestions nếu input rỗng
      if (!value.trim()) {
        setShowSuggestions(false);
        setSuggestions([]);
        return;
      }
      
      // Debounce việc gọi API
      const timeout = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
      
      setSuggestionTimeout(timeout);
    }
  };

  const handleSuggestionSelect = (word) => {
    setIsSelectingSuggestion(true);
    setLastSelectedWord(word);
    
    // Update value
    updateFlashcard(flashcard.id, 'front', word);
    
    // Ẩn suggestions
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Clear timeout nếu có
    if (suggestionTimeout) {
      clearTimeout(suggestionTimeout);
    }
    
    // Reset flag sau một khoảng thời gian ngắn
    setTimeout(() => {
      setIsSelectingSuggestion(false);
      frontInputRef.current?.focus();
    }, 100);
  };

  const handleFrontInputFocus = () => {
    setFrontFocused(true);
    // Chỉ fetch suggestions nếu có giá trị và không phải từ vừa chọn
    if (flashcard.front.length >= 2 && flashcard.front !== lastSelectedWord) {
      fetchSuggestions(flashcard.front);
    }
  };

  const handleFrontInputBlur = () => {
    // Delay để cho phép click vào suggestion
    setTimeout(() => {
      setFrontFocused(false);
      // setShowSuggestions(false);
    }, 150);
  };

  const handleDelete = () => {
    if (flashcards.length > 2) {
      removeFlashcard(flashcard.id);
    }
  };

  const handleDuplicate = () => {
    duplicateFlashcard(index);
  };

  return (
    <motion.div
      ref={itemRef}
      data-flashcard-index={index}
      className={`group relative bg-white rounded-lg border transition-all duration-200 ${
        isDragging 
          ? 'opacity-50 scale-95' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      layout
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      {/* Header with drag handle and actions */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div
            onMouseDown={handleMouseDown}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="Kéo để sắp xếp lại"
          >
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
            </svg>
          </div>
          
          <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium text-sm">
            {index + 1}
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity no-drag">
          <button
            onClick={handleDuplicate}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Nhân bản"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          {flashcards.length > 2 && (
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Xóa"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Japanese input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
              Tiếng Nhật
            </label>
            <div>
              <input
                ref={frontInputRef}
                type="text"
                value={flashcard.front}
                onChange={(e) => handleInputChange('front', e.target.value)}
                onFocus={handleFrontInputFocus}
                onBlur={handleFrontInputBlur}
                className={`no-drag w-full px-3 py-2.5 rounded-md border transition-all text-sm ${
                  frontFocused
                    ? 'border-blue-400 ring-2 ring-blue-100 bg-blue-50/30'
                    : flashcard.front
                    ? 'border-gray-300 bg-white'
                    : 'border-gray-200 bg-gray-50'
                } focus:outline-none`}
                placeholder="Nhập từ tiếng Nhật..."
              />
              
              <AnimatePresence>
                <SuggestionInputs
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                  isVisible={showSuggestions}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Vietnamese input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
              Tiếng Việt
            </label>
            <input
              type="text"
              value={flashcard.back}
              onChange={(e) => handleInputChange('back', e.target.value)}
              onFocus={() => setBackFocused(true)}
              onBlur={() => setBackFocused(false)}
              className={`no-drag w-full px-3 py-2.5 rounded-md border transition-all text-sm ${
                backFocused
                  ? 'border-green-400 ring-2 ring-green-100 bg-green-50/30'
                  : flashcard.back
                  ? 'border-gray-300 bg-white'
                  : 'border-gray-200 bg-gray-50'
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-3 left-[49%] transform -translate-x-1/2 z-10"
          >
            <button
              onClick={() => addFlashcardAt(index)}
              className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md no-drag"
              title="Thêm thẻ mới"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styles for drag over effect */}
      <style jsx>{`
        .drag-over {
          border-color: #3b82f6 !important;
          border-style: dashed !important;
          transform: scale(1.02) !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default FlashcardFormItem;