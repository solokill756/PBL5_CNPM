import React, { useEffect, useRef, useState } from "react";
import LearnProgressBar from "@/components/LearnProgressBar";
import { useParams, useNavigate } from "react-router-dom";
import ModeHeader from "@/components/ModeHeader";
import { useFlashcardStore } from "@/store/useflashcardStore";
import { useLearnStore } from "@/store/useLearnStore";
import { Flashcard } from "react-quizlet-flashcard";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import RoundButton from "@/components/RoundButton";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";
import ReviewLearnRound from "@/components/ReviewLearnRound";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { LearnHeaderSkeleton } from "@/components/Skeleton/LearnHeaderSkeleton";
import { LearnSkeleton } from "@/components/Skeleton/LearnSkeleton";
import { CompletedState } from "@/components/State/CompletedState";
import { LoadingState } from "@/components/State/LoadingState";

// Loading skeleton component
const FlashcardSkeleton = () => (
  <div className="animate-pulse flex flex-col w-full">
    <div className="h-[450px] w-full bg-gray-200 rounded-lg mb-4"></div>
    <div className="flex justify-center gap-8 mt-4">
      <div className="w-44 h-14 bg-gray-200 rounded-full"></div>
      <div className="w-44 h-14 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default function LearnFlashcard() {
  const { flashcardId } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const batchTimerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null); // 'left' or 'right'
  const [entranceDirection, setEntranceDirection] = useState(null); // Direction for next card to enter from
  const [isAnimating, setIsAnimating] = useState(false);
  const [markedFlashcards, setMarkedFlashcards] = useState({
    known: [],
    unknown: [],
  });
  const [lastSendTime, setLastSendTime] = useState(Date.now());

  const { displayDeck, fetchFlashcardList, isDataLoaded, lastLoadedId } =
    useFlashcardStore();

  const {
    setFlashcards,
    restoreLearningState,
    handleKnow,
    handleDontKnow,
    sendLearningProgress,
    resetLearning,
    knownCount,
    total,
    isFinished,
    currentCard,
    reviewMode,
    reviewList,
    handleReviewNext,
    resetUnlearned,
    learned,
    flashcards,
    nextReviewThreshold,
    getRound,
    isAllKnown,
    isEndOfRound,
    unlearnedCards,
    getLastAction,
    currentIndex,
  } = useLearnStore();

  // Fetch flashcards if not loaded or if ID changed
  useEffect(() => {
    const checkAndRestoreLearningState = async () => {
      try {
        setIsRestoring(true);
        setIsDataReady(false); // Reset data ready state
        const restored = await restoreLearningState(axios, flashcardId);

        if (!restored && (!isDataLoaded || lastLoadedId !== flashcardId)) {
          await fetchFlashcardList(axios, flashcardId);
        }
      } catch (error) {
        console.error("Error checking learning state:", error);
        if (!isDataLoaded || lastLoadedId !== flashcardId) {
          await fetchFlashcardList(axios, flashcardId);
        }
      } finally {
        setIsRestoring(false);
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setIsDataReady(true);
        }, 100);
      }
    };

    checkAndRestoreLearningState();
  }, [
    flashcardId,
    axios,
    restoreLearningState,
    isDataLoaded,
    lastLoadedId,
    fetchFlashcardList,
  ]);

  // When displayDeck has data, set it in the learn store
  useEffect(() => {
    if (displayDeck && displayDeck.length > 0 && !isRestoring) {
      setFlashcards(displayDeck);
    }
  }, [displayDeck, setFlashcards, isRestoring]);

  const sendBatchProgress = async () => {
    if (
      markedFlashcards.known.length === 0 &&
      markedFlashcards.unknown.length === 0
    ) {
      return;
    }

    try {
      await sendLearningProgress(axios, {
        known: markedFlashcards.known,
        unknown: markedFlashcards.unknown,
      });

      // Reset marked flashcards after successful send
      setMarkedFlashcards({ known: [], unknown: [] });
      setLastSendTime(Date.now());
    } catch (error) {
      console.error("Error sending batch progress:", error);
    }
  };

  // Batch progress sending
  useEffect(() => {
    const startBatchTimer = () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }

      batchTimerRef.current = setTimeout(() => {
        sendBatchProgress();
        batchTimerRef.current = null;
      }, 5000);
    };

    if (
      (markedFlashcards.known.length > 0 ||
        markedFlashcards.unknown.length > 0) &&
      !batchTimerRef.current
    ) {
      startBatchTimer();
    }

    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }

      if (
        markedFlashcards.known.length > 0 ||
        markedFlashcards.unknown.length > 0
      ) {
        sendBatchProgress();
      }
    };
  }, [markedFlashcards]);

  // Handle before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        markedFlashcards.known.length > 0 ||
        markedFlashcards.unknown.length > 0
      ) {
        sendBatchProgress();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [markedFlashcards]);

  // Reset learning when all cards are known
  useEffect(() => {
    if (isAllKnown() && !reviewMode && reviewList.length === 0) {
      resetLearning(axios, flashcardId);
    }
  }, [isAllKnown, reviewMode, reviewList, axios, flashcardId, resetLearning]);

  // Handle known card
  const handleKnowWithLog = () => {
    try {
      setIsLoading(true);
      setSlideDirection("right"); // Current card slides right
      setEntranceDirection("left"); // Next card enters from left
      setIsAnimating(true);

      const card = currentCard();
      if (card) {
        setTimeout(() => {
          handleKnow(axios, flashcardId);
          setMarkedFlashcards((prev) => ({
            ...prev,
            known: [...prev.known, card.flashcard_id],
          }));
        }, 300);
      }
    } catch (error) {
      console.error("Error in handleKnow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unknown card
  const handleDontKnowWithLog = () => {
    try {
      setIsLoading(true);
      setSlideDirection("left"); // Current card slides left
      setEntranceDirection("right"); // Next card enters from right
      setIsAnimating(true);

      const card = currentCard();
      if (card) {
        setTimeout(() => {
          handleDontKnow(axios, flashcardId);
          setMarkedFlashcards((prev) => ({
            ...prev,
            unknown: [...prev.unknown, card.flashcard_id],
          }));
        }, 300);
      }
    } catch (error) {
      console.error("Error in handleDontKnow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset animation state after animation completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Handle review next
  const handleReviewNextWithLog = () => {
    handleReviewNext(axios, flashcardId);
  };

  // Loading state with skeleton
  if (isRestoring || !isDataReady) {
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
        <div className="w-full max-w-[850px] flex flex-col items-center px-4">
          <div className="w-full mb-8">
            <LearnHeaderSkeleton />
          </div>
          <LearnSkeleton />
        </div>
      </main>
    );
  }

  if (!displayDeck || displayDeck.length === 0) {
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
        <div className="w-full max-w-[850px] flex flex-col items-center px-4">
          <div className="w-full mb-8">
            <LearnHeaderSkeleton />
          </div>
          <LearnSkeleton />
        </div>
      </main>
    );
  }

  // REVIEW MODE - Show review screen
  if (reviewMode && reviewList && reviewList.length > 0) {
    return (
      <ReviewLearnRound
        correct={knownCount()}
        total={total()}
        nextReview={nextReviewThreshold()}
        reviewList={reviewList}
        onContinue={handleReviewNextWithLog}
      />
    );
  }

  // ALL FINISHED - Show completion message
  if (isAllKnown())
    return (
      <CompletedState flashcardId={flashcardId}/>  
    );

  // LEARN MODE - Show next card
  const card = currentCard();

  // No current card (could be at end of list) - Show loading between rounds
  if (!card) {
    // Check if we're between rounds
    if (isEndOfRound() && !isAllKnown() && unlearnedCards().length > 0) {
      resetUnlearned();
    }

    return (
      <LoadingState message="Đang chuẩn bị thẻ tiếp theo..." />
    );
  }

  // Show current card for learning
  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide overflow-hidden">
      <div className="flex w-full justify-start">
        <ModeHeader
          mode="learn"
          flashcardId={flashcardId}
          onSetting={() => {}}
          onClose={() => {}}
        />
      </div>

      <div className="w-full flex max-w-[850px] flex-col items-center">
        {/* Show round number if beyond round 1 */}
        {getRound() > 1 && (
          <div className="w-full text-right text-gray-600 mb-2">
            Vòng học: {getRound()}
          </div>
        )}

        {/* Progress bar */}
        <LearnProgressBar
          correct={knownCount()}
          total={total()}
          nextReview={nextReviewThreshold()}
        />

        {/* Flashcard */}
        <div className="flex flex-col items-center justify-center w-full mt-8">
          {card && isDataReady && (
            <AnimatePresence mode="wait">
              <motion.div
                key={card.flashcard_id}
                initial={{
                  x: entranceDirection === "right" ? 1000 : -1000,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  x: slideDirection === "right" ? 1000 : -1000,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="w-full"
              >
                <Flashcard
                  frontHTML={card.front_text}
                  backHTML={card.back_text}
                  style={{
                    width: "100%",
                    height: "450px",
                    borderRadius: "16px",
                    borderColor: "inherit",
                    border: isAnimating
                      ? slideDirection === "right"
                        ? "3px solid #22c55e"
                        : "3px solid #f97316"
                      : "none",
                    transition: "border 0.3s ease-in-out",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-8 mt-4">
        <RoundButton
          buttonClassName="w-44 min-w-[180px] p-3.5 !text-base !font-semibold justify-center"
          label="Không biết"
          onClick={handleDontKnowWithLog}
          loading={isLoading}
          icon={
            <IoCloseOutline className="text-red-700 size-8 font-semibold" />
          }
        />
        <RoundButton
          buttonClassName="w-44 min-w-[180px] p-3.5 !text-base !font-semibold justify-center"
          label="Đã biết"
          onClick={handleKnowWithLog}
          loading={isLoading}
          icon={<IoCheckmark className="text-green-700 size-8 font-semibold" />}
        />
      </div>
    </main>
  );
}
