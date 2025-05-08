import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";
import { useFlashcardStore } from "@/store/useflashcardStore";
import SearchInput from "../SearchInput";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { shareFlashcardToEmail } from "@/api/shareFlashcardToEmail";
import { toast } from "react-toastify";

export default function ShareModal() {
  const { isModalOpen, modalType, closeModal } = useFlashcardStore();

  const axiosPrivate = useAxiosPrivate();
  const { flashcardId } = useParams();

  const [email, setEmail] = useState("");
  const [copyLink, setCopyLink] = useState("");

  useEffect(() => {
    if (flashcardId) {
      const url = `${window.location.origin}/flashcard/${flashcardId}`;
      setCopyLink(url);
    }
  }, [flashcardId]);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      toast.warn("Vui lòng nhập email");
      return;
    }

    try {
      const res = await shareFlashcardToEmail(axiosPrivate, flashcardId, email);
      if (res) {
        toast.success("Đã gửi email thành công!");
        setEmail("");
      }
    } catch (err) {
      toast.error("Gửi email thất bại");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(copyLink);
      toast.success("Đã chép liên kết vào clipboard!");
    } catch (err) {
      toast.error("Không thể chép liên kết");
    }
  };

  if (modalType !== "share") return null;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="max-w-3xl">
      <div className="my-4 !p-0 space-y-6">
        <h2 className="text-3xl px-4 mb-4 font-bold">Chia sẻ học phần này</h2>

        <div className="flex px-4 justify-center gap-4">
          <SearchInput
            closeIcon={false}
            searchIcon={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"Chia sẻ liên kết qua email"}
          />
          <button
            onClick={handleSendEmail}
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
            value={copyLink}
          />
          <button
            onClick={handleCopyLink}
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
