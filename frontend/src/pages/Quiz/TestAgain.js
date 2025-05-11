import React, { useState, useEffect } from "react";
import QuizModal from "@/components/Modal/QuizModal";
import QuizPage from "@/components/QuizPage";
import ModeHeader from "@/components/ModeHeader";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useFlashcardStore } from "@/store/useflashcardStore";

function TestAgain() {
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
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-md">
        <ModeHeader
          flashcardId={flashcardId}
          flashcardTitle={flashcardMetadata.title}
        />
      </div>
      
      <div className="flex-1 pt-16 mt-4"> 
        {open && (
          <QuizModal
            onClose={() => setOpen(false)}
            title={"Unit08-動詞B_N2語彙_耳から覚える"}
            maxQuestions={displayDeck.length}
 
          />
        )}       
        <div className="w-full">
          <QuizPage />
        </div>
      </div>
    </div>
  );
}

export default TestAgain;