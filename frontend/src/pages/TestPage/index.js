import React, { useState, useEffect } from "react";
import ModeHeader from "@/components/ModeHeader";
import { useNavigate } from "react-router-dom";
import TestPage from "@/components/TestList";
import { useTestStore } from "@/store/useTestStore";
import useTopicStore from "@/store/useTopicStore";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

function Test() {
  const { topicId } = useParams(); 
  const navigate = useNavigate();
  const axios = useAxiosPrivate()
  const { questions, fetchQuestions, loading, error } = useTestStore();
  const { currentTopic, fetchTopicById } = useTopicStore();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);

  useEffect(() => {
    const initializeTest = async () => {
      if (dataInitialized) return;
      
      try {

        const currentTopicId = currentTopic?.topic_id || currentTopic?.topic_Id;
        await fetchQuestions(axios,topicId);
        setDataInitialized(true);
  
        
      } catch (error) {
        console.error("Error initializing test:", error);
        setDataInitialized(true); 
      }
    };

    if (topicId && !dataInitialized) {
      initializeTest();
    }
  }, [topicId]);

  useEffect(() => {
    if (!testStarted && questions.length > 0) {
      const totalTime = questions.length * 25; 
      setTimeLeft(totalTime);
      setTestStarted(true);
      setIsTimeUp(false);
      console.log("Bắt đầu test với thời gian:", totalTime, "giây");
    }
  }, [questions.length, testStarted]);

  useEffect(() => {
    let timerInterval;

    if (testStarted && timeLeft > 0 && !isTimeUp) {
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
  }, [testStarted, timeLeft, isTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Hiển thị loading khi đang fetch
  if (loading || !dataInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-600 mb-2">
            Đang tải dữ liệu...
          </div>
          <p className="text-gray-500">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => {
              const topicIdToUse = topicId || currentTopic?.topic_id || currentTopic?.topic_Id;
              if (topicIdToUse) {
                navigate(`/vocabulary/topic/${topicIdToUse}`);
              } else {
                navigate('/vocabulary');
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Quay lại chủ đề
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <div className="text-xl font-semibold text-gray-600 mb-4">
            Không có câu hỏi để kiểm tra
          </div>
          <p className="text-gray-500 mb-6">
            Chủ đề "{currentTopic?.topic_name || currentTopic?.name || 'này'}" chưa có câu hỏi nào.
            <br />
            Vui lòng tạo câu hỏi trước khi vào trang kiểm tra.
          </p>
          <button 
            onClick={() => {
              const topicIdToUse = topicId || currentTopic?.topic_id || currentTopic?.topic_Id;
              if (topicIdToUse) {
                navigate(`/vocabulary/topic/${topicIdToUse}`);
              } else {
                navigate('/vocabulary');
              }
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Quay lại chủ đề
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-md">
        <ModeHeader
          flashcardTitle={currentTopic?.topic_name || currentTopic?.name || "Bài kiểm tra"}
          onClose={() => {
            const topicIdToUse = topicId || currentTopic?.topic_id || currentTopic?.topic_Id;
            if (topicIdToUse) {
              navigate(`/vocabulary/topic/${topicIdToUse}`);
            } else {
              navigate('/vocabulary');
            }
          }}
        />
      </div>

      {testStarted && (
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
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 pt-16 mt-4">      
        <div className="w-full">
          <TestPage 
            timeLeft={timeLeft} 
            isTimeUp={isTimeUp}
            questionsReady={questions.length > 0}
            topicId={topicId}
          />
        </div>
      </div>
    </div>
  );
}

export default Test;
