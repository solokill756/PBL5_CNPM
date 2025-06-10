import React, { useState, useEffect } from "react";
import QuizModal from "@/components/Modal/QuizModal";
import QuizPage from "@/components/QuizPage";
import ModeHeader from "@/components/ModeHeader";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useFlashcardStore } from "@/store/useflashcardStore";
import { useQuizStore } from "@/store/useQuizStore";

function Quiz() {
  const { flashcardId } = useParams();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const axios = useAxiosPrivate();

  const {
    setAxios,
    displayDeck,
    fetchFlashcardList,
    flashcardMetadata,
    isDataLoaded,
    lastLoadedId,
  } = useFlashcardStore();

  const { questions } = useQuizStore();

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

  // Khởi tạo timer khi quiz bắt đầu (modal đóng)
  useEffect(() => {
    if (!open && questions.length > 0 && !quizStarted) {
      const totalTime = questions.length * 25; // 25 giây mỗi câu
      setTimeLeft(totalTime);
      setQuizStarted(true);
      setIsTimeUp(false);
    }
  }, [open, questions.length, quizStarted]);

  // Timer countdown
  useEffect(() => {
    let timerInterval;
    
    if (quizStarted && timeLeft > 0 && !isTimeUp) {
      timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [quizStarted, timeLeft, isTimeUp]);

  // Hàm format thời gian thành mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-md">
        <ModeHeader
          flashcardId={flashcardId}
          flashcardTitle={flashcardMetadata.title}
          onClose={() => {
            navigate(`/flashcard/${flashcardId}`);
          }}
        />
      </div>

      {/* Timer hiển thị cố định ở góc trên bên phải - chỉ hiện khi quiz đã bắt đầu */}
      {quizStarted && (
        <div className="fixed top-20 right-4 z-40 bg-white rounded-lg shadow-lg border-2 border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg 
              className="w-5 h-5 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span 
              className={`font-mono text-lg font-bold ${
                timeLeft <= 60 ? 'text-red-600 animate-pulse' : 
                timeLeft <= 300 ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          {timeLeft <= 60 && timeLeft > 0 && (
            <p className="text-xs text-red-500 mt-1">Thời gian sắp hết!</p>
          )}
          {isTimeUp && (
            <p className="text-xs text-red-600 mt-1 font-semibold">Đã hết thời gian!</p>
          )}
        </div>
      )}

      {/* Time up modal overlay */}
      {isTimeUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Hết thời gian!
              </h2>
              <p className="text-gray-600 mb-6">
                Thời gian làm bài đã kết thúc. Bài kiểm tra sẽ được tự động nộp.
              </p>
              <button
                onClick={() => setIsTimeUp(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 pt-16 mt-4"> 
        {open && (
          <QuizModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title={flashcardMetadata.title}
            maxQuestions={displayDeck.length}
          />
        )}       
        <div className="w-full">
          <QuizPage timeLeft={timeLeft} isTimeUp={isTimeUp} />
        </div>
      </div>
    </div>
  );
}

export default Quiz;