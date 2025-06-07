import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import {
  IoGameController,
  IoClose,
} from "react-icons/io5";

// Import components
import VocabularyQuestion from "./VocabularyQuestion";
import ScoreDisplay from "./ScoreDisplay";
import CountdownTimer from "./CountdownTimer";
import ResultNotification from "./ResultNotification";
import DefaultAvatar from "@/assets/images/avatar.jpg";

const BattleRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();

  // Socket state
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  // Game states
  const [gameState, setGameState] = useState("loading"); // loading, waiting, playing
  const [gameData, setGameData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [scores, setScores] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionResults, setQuestionResults] = useState(null);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(10);
  const [showTimer, setShowTimer] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // UI states
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const timerRef = useRef(null);
  const questionStartTime = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!accessToken || !roomId) {
      navigate("/battle");
      return;
    }

    // Kiểm tra xem có game data trong localStorage không
    const gameDataFromStorage = localStorage.getItem(`battle_game_${roomId}`);
    if (!gameDataFromStorage) {
      console.log("No game data found for room:", roomId);
      navigate("/battle");
      return;
    }

    try {
      const parsedGameData = JSON.parse(gameDataFromStorage);
      setGameData(parsedGameData);
      setTotalQuestions(parsedGameData.totalQuestions);
      setScores({
        [user.id]: 0,
        [parsedGameData.opponent.user_id]: 0,
      });
      setGameState("waiting");
    } catch (error) {
      console.error("Error parsing game data:", error);
      navigate("/battle");
      return;
    }

    const newSocket = io("https://backendserver-app.azurewebsites.net", {
      auth: { token: accessToken },
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to battle server");
      setConnected(true);
      setConnectionError("");
      
      // Emit ready to start ngay khi connect
      setTimeout(() => {
        newSocket.emit("ready_to_start", { roomId });
      }, 1000);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setConnected(false);
      stopTimer();
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setConnectionError("Lỗi kết nối: " + error.message);
    });

    newSocket.on("game_started", (data) => {
      console.log("🚀 Game started:", data);
      setGameState("playing");
      startNewQuestion(data);
    });

    newSocket.on("next_question", (data) => {
      console.log("➡️ Next question:", data);
      startNewQuestion(data);
    });

    newSocket.on("question_result", (data) => {
      console.log("📊 Question result:", data);
      
      stopTimer();
      setQuestionResults(data);
      setScores(data.scores);
      setShowQuestionResult(true);
      setWaitingForOpponent(false);
      
      // Check if player timed out
      const answersArray = Object.values(data.answers);
      const playerAnswer = answersArray.find(
        answer => answer.username === user.username
      );
      
      if (selectedAnswer === null && playerAnswer && playerAnswer.answer === null) {
        setSelectedAnswer("timeout");
      }
    });

    newSocket.on("game_ended", (data) => {
      console.log("🏁 Game ended:", data);
      
      // Lưu kết quả vào localStorage
      localStorage.setItem(`battle_result_${roomId}`, JSON.stringify({
        ...data,
        roomId,
        timestamp: Date.now()
      }));
      
      // Xóa game data
      localStorage.removeItem(`battle_game_${roomId}`);
      
      // Chuyển đến trang kết quả
      navigate(`/battle/${roomId}/result`);
    });

    newSocket.on("opponent_disconnected", (data) => {
      console.log("🚪 Opponent disconnected:", data);
      
      // Tạo kết quả thắng cho player hiện tại
      const winResult = {
        winner: { username: user.username, user_id: user.id },
        isDraw: false,
        finalScores: { ...scores, [user.id]: (scores[user.id] || 0) + 100 },
        totalQuestions: totalQuestions,
        reason: "opponent_disconnected"
      };
      
      localStorage.setItem(`battle_result_${roomId}`, JSON.stringify({
        ...winResult,
        roomId,
        timestamp: Date.now()
      }));
      
      localStorage.removeItem(`battle_game_${roomId}`);
      navigate(`/battle/${roomId}/result`);
    });

    newSocket.on("error", (error) => {
      console.error("❌ Game error:", error);
      setConnectionError("Lỗi game: " + error.message);
    });

    setSocket(newSocket);

    return () => {
      stopTimer();
      newSocket.close();
    };
  }, [accessToken, roomId, navigate]);

  // Helper functions
  const startNewQuestion = (data) => {
    const transformedQuestion = transformQuestionFormat(data.question);
    setCurrentQuestion(transformedQuestion);
    setQuestionNumber(data.questionNumber);
    setSelectedAnswer(null);
    setQuestionResults(null);
    setShowQuestionResult(false);
    setWaitingForOpponent(false);
    setIsTimeUp(false);
    
    startTimer();
  };

  const transformQuestionFormat = (backendQuestion) => {
    if (!backendQuestion) return null;
    
    return {
      term: backendQuestion.question || backendQuestion.term,
      pronunciation: backendQuestion.pronunciation || "",
      definition: backendQuestion.definition || "",
      options: [
        backendQuestion.option_a,
        backendQuestion.option_b,
        backendQuestion.option_c,
        backendQuestion.option_d,
      ].filter(Boolean),
      correctAnswer: backendQuestion.correct_answer,
    };
  };

  const startTimer = () => {
    setTimeLeft(10);
    setShowTimer(true);
    setIsTimeUp(false);
    questionStartTime.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (selectedAnswer === null) {
            handleSelectAnswer("timeout");
          }
          setIsTimeUp(true);
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setShowTimer(false);
  };

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    
    const responseTime = Date.now() - questionStartTime.current;
    
    setSelectedAnswer(answer);
    setWaitingForOpponent(true);
    stopTimer();
    
    if (socket && roomId) {
      socket.emit("submit_answer", {
        roomId,
        answer: answer === "timeout" ? null : answer,
        responseTime: responseTime,
      });
    }
  };

  const handleExitBattle = () => {
    if (socket) {
      socket.disconnect();
    }
    // Xóa game data
    localStorage.removeItem(`battle_game_${roomId}`);
    navigate("/battle");
  };

  const getPlayersData = () => {
    if (!gameData) return { player: null, opponent: null };

    const player = {
      name: user?.username || "Bạn",
      avatar: user?.profile_picture || DefaultAvatar,
      score: scores[user?.id] || 0,
      user_id: user?.id,
    };

    let opponent;
    if (gameData?.opponent?.user_id === user?.id) {
      opponent = {
        name: gameData?.player?.username || "Đối thủ",
        avatar: gameData?.player?.profile_picture || DefaultAvatar,
        score: scores[gameData?.player?.user_id] || 0,
        user_id: gameData?.player?.user_id,
      };
    } else {
      opponent = {
        name: gameData?.opponent?.username || "Đối thủ",
        avatar: gameData?.opponent?.profile_picture || DefaultAvatar,
        score: scores[gameData?.opponent?.user_id] || 0,
        user_id: gameData?.opponent?.user_id,
      };
    }
    
    return { player, opponent };
  };

  // Loading State
  if (gameState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang kết nối đến phòng đấu...</p>
        </div>
      </div>
    );
  }

  const { player, opponent } = getPlayersData();

  // Waiting State
  if (gameState === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <IoGameController className="text-3xl text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">Phòng đấu #{roomId}</h1>
            </div>
            
            <button
              onClick={handleExitBattle}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          {/* Waiting UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-6xl mb-6">⚔️</div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Chuẩn bị chiến đấu!
              </h3>
              
              {gameData && (
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    <img src={player?.avatar || DefaultAvatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 border-3 border-indigo-500" />
                    <p className="font-semibold">{player?.name}</p>
                  </div>
                  
                  <div className="text-4xl">⚔️</div>
                  
                  <div className="text-center">
                    <img src={opponent?.avatar || DefaultAvatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 border-3 border-purple-500" />
                    <p className="font-semibold">{opponent?.name}</p>
                  </div>
                </div>
              )}
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="font-medium text-indigo-800">
                  Trận đấu sẽ bắt đầu ngay...
                </p>
                <div className="flex items-center justify-center mt-2">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-sm text-indigo-600">Đang chờ server...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Playing State
  if (gameState === "playing") {
    const { player, opponent } = getPlayersData();

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <IoGameController className="text-2xl text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-800">Phòng đấu #{roomId}</h1>
            </div>
            
            <button
              onClick={handleExitBattle}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Score Display */}
            <ScoreDisplay player={player} opponent={opponent} />
            
            {/* Timer */}
            {showTimer && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Câu {questionNumber}/{totalQuestions}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    Thời gian còn lại
                  </span>
                </div>
                <CountdownTimer timeLeft={timeLeft} totalTime={10} />
              </div>
            )}

            {/* Waiting message */}
            {waitingForOpponent && !showQuestionResult && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-blue-700 font-medium">
                    {selectedAnswer === "timeout" ? "Hết thời gian! Đang chờ đối thủ..." : "Đang chờ đối thủ trả lời..."}
                  </span>
                </div>
              </div>
            )}

            {/* Question */}
            {currentQuestion && (
              <VocabularyQuestion
                question={currentQuestion}
                playerAnswer={selectedAnswer}
                onSelectAnswer={handleSelectAnswer}
                currentQuestion={questionNumber - 1}
                questionCount={totalQuestions}
                questionResults={questionResults}
                waitingForOpponent={waitingForOpponent}
                currentUser={user}
                isTimeUp={isTimeUp}
              />
            )}

            {/* Result Notification */}
            <AnimatePresence>
              {showQuestionResult && questionResults && (() => {
                const answersArray = Object.values(questionResults.answers);
                const playerAnswer = answersArray.find(answer => answer.username === player.name);
                const opponentAnswer = answersArray.find(answer => answer.username === opponent.name);
                
                if (playerAnswer && opponentAnswer) {
                  return (
                    <ResultNotification
                      playerCorrect={playerAnswer.isCorrect || false}
                      opponentCorrect={opponentAnswer.isCorrect || false}
                      playerTime={(playerAnswer.responseTime || 0) / 1000}
                      opponentTime={(opponentAnswer.responseTime || 0) / 1000}
                      playerPoints={playerAnswer.points || 0}
                      opponentPoints={opponentAnswer.points || 0}
                      questionResults={questionResults}
                    />
                  );
                }
                return null;
              })()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi kết nối</h2>
          <p className="text-gray-600 mb-6">{connectionError}</p>
          <button
            onClick={() => navigate("/battle")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Quay lại lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleRoom;