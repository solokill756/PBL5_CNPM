import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";
import { FaStar } from "react-icons/fa";
import FeedbackTag from "@/components/Feedback/FeedbackTag";
import { useFlashcardStore } from "@/store/useflashcardStore";
import { postFlashcardRating } from "@/api/postFlashcardRating";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { fetchIsRated } from "@/api/getIsRated";

export default function FeedbackModal() {
  const { flashcardId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const {
    isModalOpen,
    modalType,
    isRated,
    setIsRated,
    rating,
    setRating,
    selectedTags,
    toggleTag,
    closeModal,
  } = useFlashcardStore();

  const [hoverIndex, setHoverIndex] = useState(null);
  const [isFetchingRated, setIsFetchingRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateFlashcardMetadata = useFlashcardStore(
    (state) => state.updateFlashcardMetadata
  );

  useEffect(() => {
    const fetchRated = async () => {
      setIsFetchingRated(true);
      const result = await fetchIsRated(axiosPrivate, flashcardId);
      if (result !== false) {
        setRating(result);
        setIsRated(true);
      } else {
        setIsRated(false);
        setRating(null);
      }
      setIsFetchingRated(false);
    };

    if (isModalOpen && modalType === "star") {
      fetchRated();
    }
  }, [flashcardId, isModalOpen, modalType]);

  if (modalType !== "star") return null;

  const handleRating = async () => {
    if (isRated === false) {
      setIsSubmitting(true);
      try {
        const data = await postFlashcardRating(
          axiosPrivate,
          flashcardId,
          rating,
          selectedTags
        );
        if (data && data.rate !== undefined && data.numberRate !== undefined) {
          updateFlashcardMetadata(data.rate, data.numberRate);
        }

        setIsRated(true);
        closeModal();
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="max-w-3xl">
      {isFetchingRated ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-6">
            <h2 className="text-3xl font-bold">
              {isRated === false
                ? "Bạn đánh giá học phần này như thế nào?"
                : "Bạn đã đánh giá học phần này rồi"}
            </h2>
            <div
              className="flex gap-6 cursor-pointer"
              onMouseLeave={() => setHoverIndex(null)}
            >
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  onMouseEnter={() => !isRated && setHoverIndex(i)}
                  onClick={() => !isRated && setRating(i + 1)}
                  className={`size-5 transition-all ${
                    i < (hoverIndex !== null ? hoverIndex + 1 : rating)
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "fill-white stroke-gray-500"
                  } ${isRated ? "cursor-default" : "cursor-pointer"}`}
                  strokeWidth="10%"
                />
              ))}
            </div>

            {rating != null && isRated === false && (
              <>
                <hr />
                <h3 className="text-xl font-semibold text-gray-600">
                  {rating <= 3
                    ? "Điều gì cần được cải thiện"
                    : "Điều gì bạn thích nhất"}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {(rating <= 3
                    ? [
                        "Không đủ chi tiết",
                        "Trình bày tệ",
                        "Chưa hoàn thiện hoặc không liên quan",
                      ]
                    : [
                        "Nội dung bao quát",
                        "Trình bày hấp dẫn",
                        "Công cụ ôn bài tốt",
                        "Giúp tôi thi tốt",
                      ]
                  ).map((text) => (
                    <FeedbackTag
                      key={text}
                      value={text}
                      selected={selectedTags === text}
                      onClick={() => {
                        isRated === false && toggleTag(text);
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            <hr />
            <div className="flex justify-end">
              <button
                onClick={handleRating}
                className={`px-3.5 py-2.5 rounded-full font-semibold ${
                  rating === null || isRated !== false
                    ? "bg-gray-300 text-gray-500 opacity-50"
                    : "bg-red-700 hover:bg-red-800 text-white"
                } ${isSubmitting ? "opacity-50 cursor-default" : ""}`}
                disabled={rating === null || isRated !== false || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Gửi"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
