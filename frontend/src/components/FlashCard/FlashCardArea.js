import React, { useEffect, useMemo } from "react";
import { FlashcardArray } from "react-quizlet-flashcard";
import RoundButton from "@/components/RoundButton";
import FlashcardElement from "@/components/FlashCard/FlashCardElement";
import { useFlashcardStore } from "@/store/useflashcardStore";
import { IoMdShuffle } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import SettingModal from "../Modal/SettingModal";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Skeleton from "react-loading-skeleton";

export default function FlashCardArea({ loading = false}) {
  const axiosPrivate = useAxiosPrivate();
  const { flashcardId } = useParams();

  const fetchFlashcardList = useFlashcardStore(
    state => state.fetchFlashcardList
  );
  
  const fetchIsRated = useFlashcardStore(
    state => state.fetchIsRated
  );
  
  const setAxios = useFlashcardStore(
    state => state.setAxios
  );

  useEffect(() => {
    setAxios(axiosPrivate);
    
    // Fetch danh sách flashcard
    fetchFlashcardList(axiosPrivate, flashcardId);
    
    // Fetch trạng thái rated nếu cần
    fetchIsRated(axiosPrivate, flashcardId);
  }, [flashcardId, setAxios, fetchFlashcardList, fetchIsRated, axiosPrivate]);

  const {
    displayDeck,
    isShuffled,
    shuffle,
    showShuffleStatus,
    toggleStar,
    starredMap,
    currentIndex,
    setCurrentIndex,
    showOnlyStarred
  } = useFlashcardStore();
  const restartKey = useFlashcardStore(state => state.restartKey);

  const showFrontFirst = useFlashcardStore((state) => state.showFrontFirst);
  const openModal = useFlashcardStore((state) => state.openModal);

  // Hiển thị loading state nếu cần
  const error = useFlashcardStore(state => state.error);

  const cardsForQuizlet = useMemo(() => {
    return displayDeck.map(({ flashcard_id, front_text, back_text }) => {
      // nếu showFrontFirst = false, đảo front/back
      const frontText = showFrontFirst ? front_text : back_text;
      const backText = showFrontFirst ? back_text : front_text;
      
      const isStarred = !!starredMap[flashcard_id];
      
      return {
        flashcard_id,
        frontHTML: (
          <FlashcardElement
            text={frontText}
            star={isStarred}
            onClick={() => toggleStar(flashcard_id)}
          />
        ),
        backHTML: (
          <FlashcardElement
            text={backText}
            star={isStarred}
            onClick={() => toggleStar(flashcard_id)}
          />
        ),
      };
    });
  }, [displayDeck, starredMap, showFrontFirst, toggleStar]);

  if (loading) {
    return (
      <div className="mt-6 mb-3">
        <div className="flex justify-center items-center">
          <div className="w-full h-full">
            <Skeleton height={400} width={870} baseColor="#fff4f4" highlightColor="#F0F0F0" borderRadius={10} />
            <div className="mt-2 flex justify-end space-x-4">
              <Skeleton circle width={40} height={40} baseColor="#fff4f4" highlightColor="#F0F0F0"/>
              <Skeleton circle width={40} height={40} baseColor="#fff4f4" highlightColor="#F0F0F0"/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">
      Đã xảy ra lỗi: {error.message || 'Không thể tải flashcard'}
    </div>;
  }

  if (!displayDeck.length) {
    return <div className="flex justify-center items-center h-64">Không có flashcard nào</div>;
  }

  return (
    <div className="relative mt-6 mb-3">
      <FlashcardArray
        key={`${restartKey}-${showOnlyStarred}-${displayDeck.length}`}
        cards={cardsForQuizlet}
        controls
        currentIndex={currentIndex}
        onCardChange={(_, idx) => setCurrentIndex(idx)}
      />
      <div className="absolute flex gap-4 bottom-0 right-0">
        <RoundButton
          border={"border-none"}
          icon={<IoMdShuffle />}
          onClick={shuffle}
          isActive={isShuffled}
        />
        <RoundButton
          border={"border-none"}
          icon={<IoSettingsOutline />}
          onClick={() => {
            openModal("setting");
          }}
        />
        <SettingModal />
      </div>
      {showShuffleStatus && (
        <div className="absolute w-full rounded-xl bg-red-100 z-10 bottom-0">
          <span className="flex items-center justify-center text-xs py-2">
            {isShuffled ? "Trộn thẻ đang bật" : "Trộn thẻ đang tắt"}
          </span>
        </div>
      )}
    </div>
  );
}