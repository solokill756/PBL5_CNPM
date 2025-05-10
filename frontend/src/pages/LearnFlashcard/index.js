import React, { useEffect } from "react";
import LearnProgressBar from "@/components/LearnProgressBar";
import { useParams } from "react-router-dom";
import ModeHeader from "@/components/ModeHeader";
import { useFlashcardStore } from "@/store/useflashcardStore";
import { useLearnStore } from "@/store/useLearnStore";
import { Flashcard } from "react-quizlet-flashcard";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import RoundButton from "@/components/RoundButton";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";

export default function LearnFlashcard() {
  const { flashcardId } = useParams();
  const axios = useAxiosPrivate();
  const { displayDeck, fetchFlashcardList, isDataLoaded, lastLoadedId } =
    useFlashcardStore();

  const {
    setFlashcards,
    handleKnow,
    handleDontKnow,
    knownCount,
    total,
    isFinished,
    currentCard,
    reviewMode,
    reviewList,
    handleReviewNext,
  } = useLearnStore();

  // Fetch flashcard nếu chưa có hoặc id khác
  useEffect(() => {
    if (!isDataLoaded || lastLoadedId !== flashcardId) {
      fetchFlashcardList(axios, flashcardId);
    }
  }, [flashcardId, isDataLoaded, lastLoadedId, fetchFlashcardList, axios]);

  // Khi displayDeck đã có dữ liệu, set vào learn store
  useEffect(() => {
    if (displayDeck && displayDeck.length > 0) {
      setFlashcards(displayDeck);
    }
  }, [displayDeck, setFlashcards]);

  if (!displayDeck || displayDeck.length === 0)
    return <div>Đang tải dữ liệu...</div>;
  if (isFinished()) return <div>Đã hoàn thành hoặc không có dữ liệu!</div>;

  // REVIEW MODE
  if (reviewMode && reviewList.length > 0) {
    return (
      <main className="flex flex-col items-center flex-grow scrollbar-hide">
        <div className="flex w-full justify-start">
          <ModeHeader
            mode="learn"
            flashcardId={flashcardId}
            onSetting={() => {}}
            onClose={() => {}}
          />
        </div>
        <div className="w-full flex max-w-[850px] flex-col items-center">
          <h2 className="text-2xl font-bold my-6">Ôn tập lại các từ đã biết</h2>
          <div className="w-full bg-white rounded-lg shadow p-6">
            <ul className="space-y-3">
              {reviewList.map((card, idx) => (
                <li key={card.id} className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-semibold text-lg">{idx + 1}. {card.front_text}</span>
                  <span className="text-gray-500 ml-4">{card.back_text}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="mt-8 px-8 py-4 rounded-full bg-green-500 text-white text-xl font-semibold"
            onClick={handleReviewNext}
          >
            Tiếp tục học
          </button>
        </div>
      </main>
    );
  }

  // LEARN MODE
  const card = currentCard();

  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide">
      <div className="flex w-full justify-start">
        <ModeHeader
          mode="learn"
          flashcardId={flashcardId}
          onSetting={() => {}}
          onClose={() => {}}
        />
      </div>
      <div className="w-full flex max-w-[850px] flex-col items-center">
        <LearnProgressBar correct={knownCount()} total={total()} />
        <div className="flex flex-col items-center justify-center w-full mt-8">
          <Flashcard
            frontHTML={card?.front_text}
            backHTML={card?.back_text}
            style={{ width: "100%", height: "450px" }}
          />
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-4">
        <RoundButton
          buttonClassName="w-44 min-w-[180px] p-3.5 !text-base !font-semibold justify-center"
          label="Không biết"
          onClick={handleDontKnow}
          icon={<IoCloseOutline className="text-red-700 size-8 font-semibold" />}
        />
        <RoundButton
          buttonClassName="w-44 min-w-[180px] p-3.5 !text-base !font-semibold justify-center"
          label="Đã biết"
          onClick={handleKnow}
          icon={<IoCheckmark className="text-green-700 size-8 font-semibold" />}
        />
      </div>
    </main>
  );
}