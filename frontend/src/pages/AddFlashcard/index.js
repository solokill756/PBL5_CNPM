import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAddFlashcardStore } from "@/store/useAddFlashcardStore";
import { useFlashcardStore } from "@/store/useflashcardStore";
import DefaultHeader from "@/layouts/DefaultHeader";
import FlashcardFormHeader from "@/components/FlashcardForm/FlashcardFormHeader";
import FlashcardFormItem from "@/components/FlashcardForm/FlashcardFormItem";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const DraftModal = ({ isOpen, onContinue, onNew }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Có bản nháp chưa hoàn thành
          </h3>

          <p className="text-gray-600 mb-6">
            Bạn có muốn tiếp tục chỉnh sửa bản nháp trước đó hay bắt đầu tạo học
            phần mới?
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onNew}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Tạo mới
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Tiếp tục chỉnh sửa
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AddFlashcard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const [showDraftModal, setShowDraftModal] = useState(false);

  const {
    flashcards,
    loadFromExisting,
    loadFromForgottenWords,
    resetForm,
    loading,
    checkForDraft,
    clearDraft,
    title
  } = useAddFlashcardStore();

  const { originalDeck, flashcardMetadata } = useFlashcardStore();

  // Check for draft on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const isFromCopy = location.state?.copyFrom;

    // If coming from copy or specific mode, don't show draft modal
    if (isFromCopy || mode) {
      if (isFromCopy && originalDeck.length > 0) {
        loadFromExisting({ originalDeck, flashcardMetadata });
      } else if (mode === "forgotten") {
        if (!title || title !== "Từ hay quên") {
          loadFromForgottenWords(axios, 40);
        }
      }
      return;
    }

    // Check for existing draft
    if (checkForDraft()) {
      setShowDraftModal(true);
    }
  }, [location.search, originalDeck, flashcardMetadata, title]);

  const handleContinueDraft = () => {
    setShowDraftModal(false);
    // Draft data is already loaded from localStorage
  };

  const handleNewFlashcard = () => {
    resetForm();
    clearDraft();
    setShowDraftModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      {/* Background overlay to ensure full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>

      <DefaultHeader />

      <div className="mx-auto w-[80%] relative">
        <div className="space-y-8">
          <FlashcardFormHeader />
          <AnimatePresence mode="popLayout">
            {flashcards.map((flashcard, index) => (
              <FlashcardFormItem
                key={flashcard.id}
                flashcard={flashcard}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Extra padding at bottom */}
        <div className="h-32"></div>
      </div>

      <DraftModal
        isOpen={showDraftModal}
        onContinue={handleContinueDraft}
        onNew={handleNewFlashcard}
      />
    </div>
  );
};

export default AddFlashcard;
