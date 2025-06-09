import React, { useState, useEffect } from "react";
import Result from '@/components/QuizPage/Result'
import CheckAnswer from '@/components/QuizPage/CheckAnswer'
import ModeHeader from "@/components/ModeHeader";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useFlashcardStore } from "@/store/useflashcardStore";

function QuizResult() {
  const { flashcardId } = useParams();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axios = useAxiosPrivate();

  const {
    openModal,
    isFlashcardSaved,
    setAxios,
    currentIndex,
    displayDeck,
    fetchFlashcardList,
    flashcardMetadata,
    authorInfor,
    isDataLoaded,
    lastLoadedId,
    resetFlashcardState
  } = useFlashcardStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!isDataLoaded || lastLoadedId !== flashcardId) {
        try {
          setLoading(true);
          setAxios(axios);
          await fetchFlashcardList(axios, flashcardId);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [flashcardId, axios, setAxios, isDataLoaded, lastLoadedId, fetchFlashcardList]);

  return (
    <div>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16">
        {isDataLoaded && flashcardMetadata?.title && (
          <ModeHeader
            flashcardId={flashcardId}
            flashcardTitle={flashcardMetadata.title}
          />
        )}
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Main Content */}
      <div className="px-4">
        <Result />
        <CheckAnswer />
      </div>
    </div>
  );
}
export default QuizResult;