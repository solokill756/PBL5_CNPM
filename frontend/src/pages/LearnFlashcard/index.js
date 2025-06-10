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
import ReviewLearnRound from "@/components/Review/ReviewLearnRound";
import { AnimatePresence, motion } from "framer-motion";
import { LearnHeaderSkeleton } from "@/components/Skeleton/LearnHeaderSkeleton";
import { LearnSkeleton } from "@/components/Skeleton/LearnSkeleton";
import { CompletedState } from "@/components/State/CompletedState";
import { LoadingState } from "@/components/State/LoadingState";
import { postForgetCard } from "@/api/postForgetCard";
import { postRememberCard } from "@/api/postRememberCard";

export default function LearnFlashcard() {
  const { flashcardId } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isRestoring: true,
    isDataReady: false,
    isFullyLoaded: false,
    isResetInProgress: false, // Thêm state để track quá trình reset
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(null);
  const [entranceDirection, setEntranceDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { displayDeck, fetchFlashcardList, isDataLoaded, lastLoadedId } =
    useFlashcardStore();

  const {
    setFlashcards,
    restoreLearningState,
    handleKnow,
    handleDontKnow,
    sendPendingProgress,
    handleLearningComplete,
    knownCount,
    total,
    currentCard,
    reviewMode,
    reviewList,
    handleReviewNext,
    nextReviewThreshold,
    getRound,
    isAllKnown,
    resetUnlearned,
    isEndOfRound,
    unlearnedCards,
    currentRoundKnownCount,
  } = useLearnStore();

  // Modify the useEffect for initial loading
  useEffect(() => {
    const checkAndRestoreLearningState = async () => {
      try {
        setLoadingState({
          isRestoring: true,
          isDataReady: false,
          isFullyLoaded: false,
          isResetInProgress: false,
        });

        const restored = await restoreLearningState(axios, flashcardId);

        if (!restored && (!isDataLoaded || lastLoadedId !== flashcardId)) {
          await fetchFlashcardList(axios, flashcardId);
        }

        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setLoadingState({
            isRestoring: false,
            isDataReady: true,
            isFullyLoaded: true,
            isResetInProgress: false,
          });
        }, 300);
      } catch (error) {
        console.error("Error checking learning state:", error);
        if (!isDataLoaded || lastLoadedId !== flashcardId) {
          await fetchFlashcardList(axios, flashcardId);
        }
        setLoadingState({
          isRestoring: false,
          isDataReady: true,
          isFullyLoaded: true,
          isResetInProgress: false,
        });
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
    if (displayDeck && displayDeck.length > 0 && !loadingState.isRestoring) {
      setFlashcards(displayDeck);
    }
  }, [displayDeck, setFlashcards, loadingState.isRestoring]);

  useEffect(() => {
    const axiosInstance = axios;

    return () => {
      if (axiosInstance) {
        setTimeout(() => {
          sendPendingProgress(axiosInstance, flashcardId);
        }, 0);
      }
    };
  }, [axios, sendPendingProgress, flashcardId]);

  // Reset learning when all cards are known
  useEffect(() => {
    if (isAllKnown() && !reviewMode && reviewList.length === 0) {
      handleLearningComplete(axios, flashcardId);
    }
  }, [
    isAllKnown,
    reviewMode,
    reviewList,
    axios,
    flashcardId,
    handleLearningComplete,
  ]);

  // Handle known card
  const handleKnowWithLog = () => {
    if (!loadingState.isFullyLoaded) return;

    try {
      setIsLoading(true);
      setSlideDirection("right");
      setEntranceDirection("left");
      setIsAnimating(true);

      const card = currentCard();
      if (card) {
        setTimeout(async () => {
          await handleKnow(axios, flashcardId);
          await postRememberCard(axios, [card.flashcard_id], flashcardId);
          setCurrentCardIndex((prev) => prev + 1);
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
    if (!loadingState.isFullyLoaded) return;
    try {
      setIsLoading(true);
      setSlideDirection("left");
      setEntranceDirection("right");
      setIsAnimating(true);

      const card = currentCard();
      if (card) {
        setTimeout(async () => {
          await handleDontKnow(axios, flashcardId);
          await postForgetCard(axios, [card.flashcard_id], flashcardId);
          setCurrentCardIndex((prev) => prev + 1);
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

  const [shouldResetAfterReview, setShouldResetAfterReview] = useState(false);

  useEffect(() => {
    if (shouldResetAfterReview) {
      console.log("Checking if round needs reset after review");

      if (isEndOfRound() && !isAllKnown() && unlearnedCards().length > 0) {
        console.log("Resetting for next round after review");
        resetUnlearned();
      }

      setShouldResetAfterReview(false);

      setTimeout(() => {
        console.log("After review reset - Round:", getRound());
        console.log(
          "After review reset - Current round known count:",
          currentRoundKnownCount()
        );
      }, 100);
    }
  }, [
    shouldResetAfterReview,
    isEndOfRound,
    isAllKnown,
    unlearnedCards,
    resetUnlearned,
    getRound,
    currentRoundKnownCount,
  ]);

  // Loading state with skeleton
  if (
    loadingState.isRestoring ||
    !loadingState.isDataReady ||
    !loadingState.isFullyLoaded
  ) {
    return (
      <main className="flex flex-col items-center flex-grow scrollbar-hide">
        <div className="flex w-full justify-start">
          <ModeHeader
            mode="learn"
            flashcardId={flashcardId}
            onSetting={() => {}}
            onClose={() => {
              navigate(`/flashcard/${flashcardId}`);
            }}
          />
        </div>
        <div className="w-full max-w-[850px] mt-4 flex flex-col items-center px-4">
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
            onClose={() => {
              navigate(`/flashcard/${flashcardId}`);
            }}
          />
        </div>
        <div className="w-full max-w-[850px] mt-4 flex flex-col items-center px-4">
          <div className="w-full mb-8">
            <LearnHeaderSkeleton />
          </div>
          <LearnSkeleton />
        </div>
      </main>
    );
  }

  const handleResetLearn = async () => {
    try {
      setLoadingState({
        isRestoring: true,
        isDataReady: false,
        isFullyLoaded: false,
        isResetInProgress: true
      });
      
      await handleLearningComplete(axios, flashcardId);
      const restored = await restoreLearningState(axios, flashcardId);
      
      if (!restored) {
        await fetchFlashcardList(axios, flashcardId);
      }
      
      // Add a small delay before completing the reset
      setTimeout(() => {
        setLoadingState({
          isRestoring: false,
          isDataReady: true,
          isFullyLoaded: true,
          isResetInProgress: false
        });
      }, 300);
    } catch (error) {
      console.error("Error in handleResetLearn:", error);
      setLoadingState({
        isRestoring: false,
        isDataReady: true,
        isFullyLoaded: true,
        isResetInProgress: false
      });
    }
  };

  // ALL FINISHED - Show completion message
  if (isAllKnown())
    return (
      <CompletedState
        flashcardId={flashcardId}
        loading={loadingState.isRestoring}
        onReset={handleResetLearn}
        onTest={() => {
          navigate(`/flashcard/${flashcardId}/quiz`);
        }}
      />
    );

  // LEARN MODE - Show next card
  const card = currentCard();

  const handleReviewNextWithLog = async () => {
    try {
      setLoadingState(prev => ({
        ...prev,
        isDataReady: false,
        isFullyLoaded: false
      }));
      
      await handleReviewNext(axios, flashcardId);
      
      // Check if we need to reset for next round
      if (isEndOfRound() && !isAllKnown() && unlearnedCards().length > 0) {
        resetUnlearned();
      }
      
      // Add a small delay before updating loading state
      setTimeout(() => {
        setLoadingState(prev => ({
          ...prev,
          isDataReady: true,
          isFullyLoaded: true
        }));
      }, 300);
    } catch (error) {
      console.error("Error in handleReviewNext:", error);
      setLoadingState(prev => ({
        ...prev,
        isDataReady: true,
        isFullyLoaded: true
      }));
    }
  };

  // REVIEW MODE - Show review screen
  if (reviewMode && reviewList && reviewList.length > 0) {

    return (
      <ReviewLearnRound
        correct={currentRoundKnownCount()}
        total={total()}
        nextReview={nextReviewThreshold()}
        reviewList={reviewList}
        flashcardId={flashcardId}
        onContinue={handleReviewNextWithLog}
      />
    );
  }

  if (!card) {
    if (isEndOfRound() && !isAllKnown() && unlearnedCards().length > 0) {
      resetUnlearned();
    }

    return <LoadingState message="Đang chuẩn bị thẻ tiếp theo..." />;
  }

  // Show current card for learning
  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide overflow-hidden">
      <div className="flex w-full justify-start">
        <ModeHeader
          mode="learn"
          flashcardId={flashcardId}
          onSetting={() => {}}
          onClose={() => {
            navigate(`/flashcard/${flashcardId}`);
          }}
        />
      </div>

      <div className="w-full flex max-w-[850px] mt-4 flex-col items-center">
        {getRound() > 1 && (
          <div className="w-full text-right text-gray-600 mb-2">
            Vòng học: {getRound()}
          </div>
        )}

        <LearnProgressBar
          correct={knownCount()}
          total={total()}
          nextReview={nextReviewThreshold()}
        />

        <div className="flex flex-col items-center justify-center w-full mt-8">
          {card &&
            loadingState.isDataReady &&
            loadingState.isFullyLoaded &&
            !loadingState.isRestoring && (
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
