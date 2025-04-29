// src/components/SaveModal.jsx
import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { useFlashcardStore } from "@/store/useflashcardStore";
import ClassOptionList from "../Class/ClassOptionList";

export default function SaveModal() {
  const { isModalOpen, modalType, closeModal } = useFlashcardStore();
  const [selectedIds, setSelectedIds] = useState([]);

  if (modalType !== "save") return null;

  const isDisabled = selectedIds.length === 0;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="max-w-md">
      <div className="mt-4 !p-0 space-y-6">
        <h2 className="text-3xl px-4 mb-4 font-bold">Lưu vào lớp học</h2>

        <div className="relative">
          <div className="max-h-52 overflow-y-auto space-y-2 p-4 shadow-sm">
            <ClassOptionList onChange={setSelectedIds} />
          </div>
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent rounded-t-lg"></div>
          <div className="pointer-events-none absolute -bottom-2 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent rounded-b-lg"></div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              closeModal();
            }}
            className={`px-3.5 py-2.5 rounded-full font-semibold transition-opacity
              ${
                isDisabled
                  ? "bg-gray-300 text-gray-500 opacity-50"
                  : "bg-red-700 hover:bg-red-800 text-white cursor-pointer"
              }
            `}
            disabled={isDisabled}
          >
            Lưu
          </button>
        </div>
      </div>
    </Modal>
  );
}
