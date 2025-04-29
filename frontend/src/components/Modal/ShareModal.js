import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { useFlashcardStore } from "@/store/useflashcardStore";
import SearchInput from "../SearchInput";

export default function ShareModal() {
  const { isModalOpen, modalType, closeModal } = useFlashcardStore();

  if (modalType !== "share") return null;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="max-w-3xl">
      <div className="my-4 !p-0 space-y-6">
        <h2 className="text-3xl px-4 mb-4 font-bold">Chia sẻ học phần này</h2>

        <div className="flex px-4 justify-center gap-4">
          <SearchInput
            closeIcon={false}
            searchIcon={false}
            placeholder={"Chia sẻ liên kết qua email"}
          />
          <button
            onClick={() => {}}
            className={`px-3.5 py-2.5 flex-1 rounded-full font-semibold transition-opacity
                  bg-red-700 hover:bg-red-800 text-white cursor-pointer
            `}
          >
            Gửi email
          </button>
        </div>
        <div className="flex px-4 gap-4">
          <SearchInput
            closeIcon={false}
            searchIcon={false}
            placeholder={""}
            className="!w-[80%]"
            editable={false}
            value={"https://www.google.comdddddddddddddddddddddddddddddddddddddddddddddddddđ"}
          />
          <button
            onClick={() => {}}
            className={`px-3.5 py-2.5 flex flex-1 justify-center rounded-full font-semibold transition-opacity
                  bg-red-700 hover:bg-red-800 text-white cursor-pointer
            `}
          >
            Chép liên kết
          </button>
        </div>
      </div>
    </Modal>
  );
}
