// src/components/SaveModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import { useFlashcardStore } from "@/store/useflashcardStore";
import ClassOptionList from "../Class/ClassOptionList";
import { saveFlashcardToClasses } from "@/api/saveFlashcardToClasses";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { useToast, TOAST_TYPES } from "@/context/ToastContext";

export default function SaveModal() {
  const axiosPrivate = useAxiosPrivate();
  const { flashcardId } = useParams();
  const { addToast } = useToast();

  const { 
    isModalOpen, 
    modalType, 
    closeModal, 
    savedClassesMap, 
    updateSavedClasses 
  } = useFlashcardStore();
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [initialSelectedIds, setInitialSelectedIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  if (modalType !== "save") return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await saveFlashcardToClasses(axiosPrivate, flashcardId, selectedIds);

      // Update the saved classes in the global store
      updateSavedClasses(flashcardId, selectedIds);

      const addedClasses = selectedIds.filter(
        (id) => !initialSelectedIds.includes(id)
      );
      const removedClasses = initialSelectedIds.filter(
        (id) => !selectedIds.includes(id)
      );

      let message;
      if (addedClasses.length > 0 && removedClasses.length > 0) {
        message = "Đã cập nhật lớp học cho flashcard!";
      } else if (addedClasses.length > 0) {
        message = "Đã lưu flashcard vào lớp học!";
      } else if (removedClasses.length > 0) {
        message = "Đã xóa flashcard khỏi lớp học!";
      } else {
        message = "Không có thay đổi nào được thực hiện.";
      }

      addToast(message, TOAST_TYPES.SUCCESS);
      closeModal();
    } catch (error) {
      console.error("Error saving:", error);
      addToast("Lưu thất bại. Vui lòng thử lại.", TOAST_TYPES.ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen && modalType === "save"}
      onClose={closeModal}
      size="max-w-md"
    >
      <div className="mt-4 !p-0 space-y-6">
        <h2 className="text-3xl px-4 mb-4 font-bold">Lưu vào lớp học</h2>

        <div className="relative">
          <div className="max-h-52 overflow-y-auto space-y-2 p-4 shadow-sm">
            <ClassOptionList
              onChange={setSelectedIds}
              flashcardId={flashcardId}
              onInitialSelectionLoad={setInitialSelectedIds}
            />
          </div>
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent rounded-t-lg"></div>
          <div className="pointer-events-none absolute -bottom-2 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent rounded-b-lg"></div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`px-3.5 py-2.5 rounded-full font-semibold transition-opacity
              ${
                isSaving
                  ? "bg-red-700 text-white opacity-50"
                  : "bg-red-700 hover:bg-red-800 text-white cursor-pointer"
              }
            `}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="size-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}