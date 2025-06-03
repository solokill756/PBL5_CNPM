import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
// Bỏ import @dnd-kit/modifiers vì không cần thiết
import { motion, AnimatePresence } from 'framer-motion';
import { useAddFlashcardStore } from '@/store/useAddFlashcardStore';
import { useFlashcardStore } from '@/store/useflashcardStore';
import DefaultHeader from '@/layouts/DefaultHeader';
import FlashcardFormHeader from '@/components/FlashcardForm/FlashcardFormHeader';
import FlashcardFormItem from '@/components/FlashcardForm/FlashcardFormItem';
import SaveSection from '@/components/FlashcardForm/SaveSection';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const AddFlashcard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { 
    flashcards, 
    loadFromExisting, 
    loadFromForgottenWords,
    resetForm, 
    reorderFlashcards,
    addFlashcardAt,
    loading 
  } = useAddFlashcardStore();
  const { originalDeck, flashcardMetadata } = useFlashcardStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle different creation modes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');

    if (location.state?.copyFrom && originalDeck.length > 0) {
      loadFromExisting({
        originalDeck,
        flashcardMetadata
      });
    } else if (mode === 'forgotten') {
      loadFromForgottenWords(axios);
    }
  }, [location.state, location.search, originalDeck, flashcardMetadata, loadFromExisting, loadFromForgottenWords, axios]);

  useEffect(() => {
    return () => {
      if (!location.state?.copyFrom && !location.search.includes('mode=forgotten')) {
        resetForm();
      }
    };
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      reorderFlashcards(active.id, over.id);
    }
  };

  const handleAddBelow = (flashcardId) => {
    addFlashcardAt(flashcardId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DefaultHeader />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DefaultHeader />
      
      <div className="pt-16">
        <FlashcardFormHeader />
        
        <div className="max-w-4xl mx-auto px-6 py-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={flashcards.map(card => card.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {flashcards.map((flashcard, index) => (
                    <FlashcardFormItem
                      key={flashcard.id}
                      flashcard={flashcard}
                      index={index + 1}
                      onAddBelow={() => handleAddBelow(flashcard.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      
      <SaveSection />
    </div>
  );
};

export default AddFlashcard;