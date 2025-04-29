import React, { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { FaStar } from 'react-icons/fa';
import FeedbackTag from '@/components/Feedback/FeedbackTag';
import { useFlashcardStore } from '@/store/useflashcardStore';

export default function FeedbackModal() {
  const {
    isModalOpen,
    modalType,
    rating,
    selectedTags,
    setRating,
    toggleTag,
    closeModal
  } = useFlashcardStore();

  // local hover state
  const [hoverIndex, setHoverIndex] = useState(null);

  if (modalType !== 'star') return null;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="max-w-3xl">
      <div className="mt-4 space-y-6">
        <h2 className="text-3xl font-bold">Bạn đánh giá học phần này như thế nào?</h2>
        <div
          className="flex gap-6 cursor-pointer"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onClick={() => setRating(i)}
              className={`size-5 transition-all ${
                i <= (hoverIndex !== null ? hoverIndex : rating)
                  ? 'fill-yellow-400 stroke-yellow-400'
                  : 'fill-white stroke-gray-500'
              }`}
              strokeWidth="10%"
            />
          ))}
        </div>

        {rating != null && (
          <>
            <hr />
            <h3 className="text-xl font-semibold text-gray-600">
              {rating <= 2 ? 'Điều gì cần được cải thiện' : 'Điều gì bạn thích nhất'}
            </h3>
            <div className="flex flex-wrap gap-4">
              {(rating <= 2
                ? ['Không đủ chi tiết','Trình bày tệ','Chưa hoàn thiện hoặc không liên quan']
                : ['Nội dung bao quát','Trình bày hấp dẫn','Công cụ ôn bài tốt','Giúp tôi thi tốt']
              ).map(text => (
                <FeedbackTag
                  key={text}
                  value={text}
                  selected={selectedTags.includes(text)}
                  onClick={() => toggleTag(text)}
                />
              ))}
            </div>
          </>
        )}

        <hr />
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className={`px-3.5 py-2.5 rounded-full font-semibold ${
              rating == null
                ? 'bg-gray-300 text-gray-500 opacity-50'
                : 'bg-red-700 hover:bg-red-800 text-white'
            }`}
            disabled={rating == null}
          >
            Gửi
          </button>
        </div>
      </div>
    </Modal>
  );
}