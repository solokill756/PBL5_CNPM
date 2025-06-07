import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import {
  IoTrophy,
  IoGameController,
  IoClose,
  IoShield,
  IoFlash,
  IoHeart,
  IoRocket,
  IoSearch,
  IoLogOut,
} from "react-icons/io5";
import { FiUsers, FiClock } from "react-icons/fi";

// Import các component đẹp đã có
import VocabularyQuestion from "./VocabularyQuestion";
import ScoreDisplay from "./ScoreDisplay";
import CountdownTimer from "./CountdownTimer";
import OpponentStatus from "./OpponentStatus";
import ResultNotification from "./ResultNotification";
import FinalResult from "./FinalResult";

const ModernBattle = () => {
  // Auth state
  const { accessToken, user } = useAuthStore();

  // Socket state
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  // Game states
  const [gameState, setGameState] = useState("waiting"); // waiting, inQueue, gameFound, playing, ended
  const [gameData, setGameData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [scores, setScores] = useState({});
  const [queuePosition, setQueuePosition] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [questionResults, setQuestionResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(false);

  // UI states
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerAnswerTime, setPlayerAnswerTime] = useState(0);

  const timerRef = useRef(null);
  const questionStartTime = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!accessToken) {
      setConnectionError("Vui lòng đăng nhập để chơi battle!");
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
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setConnected(false);
      setGameState("waiting");
      resetTimer();
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setConnectionError("Lỗi kết nối: " + error.message);
    });

    // Queue events
    newSocket.on("queue_joined", (data) => {
      console.log("🎯 Queue joined:", data);
      setGameState("inQueue");
      setQueuePosition(data.position);
    });

    // Game events
    newSocket.on("game_found", (data) => {
      console.log("🎮 Game found:", data);
      setGameData(data);
      setGameState("gameFound");
      setTotalQuestions(data.totalQuestions);
      setScores({
        [user.user_id]: 0,
        [data.opponent.user_id]: 0,
      });

      // Auto ready after 2 seconds
      setTimeout(() => {
        newSocket.emit("ready_to_start", { roomId: data.roomId });
      }, 2000);
    });

    newSocket.on("game_started", (data) => {
      console.log("🚀 Game started:", data);
      setGameState("playing");
      // Transform backend question format to match component
      const transformedQuestion = transformQuestionFormat(data.question);
      setCurrentQuestion(transformedQuestion);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setSelectedAnswer(null);
      setShowQuestionResult(false);
      setPlayerAnswerTime(0);
      startQuestionTimer();
    });

    newSocket.on("next_question", (data) => {
      console.log("➡️ Next question:", data);
      const transformedQuestion = transformQuestionFormat(data.question);
      setCurrentQuestion(transformedQuestion);
      setQuestionNumber(data.questionNumber);
      setSelectedAnswer(null);
      setQuestionResults(null);
      setShowQuestionResult(false);
      setPlayerAnswerTime(0);
      
      // Delay để tạo hiệu ứng smooth transition
      setTimeout(() => {
        startQuestionTimer();
      }, 500);
    });

    newSocket.on("question_result", (data) => {
      console.log("📊 Question result:", data);
      setQuestionResults(data);
      setScores(data.scores);
      setShowQuestionResult(true);
      resetTimer();
      
      // Tự động chuyển sang câu tiếp theo sau 3 giây
      setTimeout(() => {
        setShowQuestionResult(false);
      }, 3000);
    });

    newSocket.on("game_ended", (data) => {
      console.log("🏁 Game ended:", data);
      setGameState("ended");
      setGameResults(data);
      setScores(data.finalScores);
      resetTimer();
    });

    // Error events
    newSocket.on("error", (error) => {
      console.error("❌ Game error:", error);
      setConnectionError("Lỗi game: " + error.message);
    });

    newSocket.on("opponent_disconnected", (data) => {
      console.log("🚪 Opponent disconnected:", data);
      setGameState("ended");
      setGameResults({
        winner: { username: user.username, user_id: user.user_id },
        isDraw: false,
        finalScores: scores,
        totalQuestions: totalQuestions,
      });
      resetTimer();
    });

    setSocket(newSocket);

    return () => {
      resetTimer();
      newSocket.close();
    };
  }, [accessToken]);

  // Transform backend question format to match VocabularyQuestion component
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

  // Timer functions
  const startQuestionTimer = () => {
    setTimeLeft(10);
    setTimerActive(true);
    questionStartTime.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  };

  const handleTimeEnd = () => {
    resetTimer();
    if (socket && gameData && selectedAnswer === null) {
      socket.emit("time_end", { roomId: gameData.roomId });
      setSelectedAnswer(false); // Mark as timeout
    }
  };

  // Game actions
  const handleJoinQueue = () => {
    if (socket && connected) {
      setLoading(true);
      socket.emit("join_queue");
    }
  };

  const handleLeaveQueue = () => {
    if (socket) {
      socket.emit("leave_queue");
      setGameState("waiting");
    }
  };

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null || !timerActive) return;
    
    const responseTime = Date.now() - questionStartTime.current;
    const answerTimeInSeconds = responseTime / 1000;
    
    setSelectedAnswer(answer);
    setPlayerAnswerTime(answerTimeInSeconds);
    resetTimer();
    
    if (socket && gameData) {
      socket.emit("submit_answer", {
        roomId: gameData.roomId,
        answer: answer,
        responseTime: responseTime,
      });
    }
  };

  const handlePlayAgain = () => {
    setGameState("waiting");
    setGameData(null);
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setTotalQuestions(0);
    setScores({});
    setSelectedAnswer(null);
    setGameResults(null);
    setQuestionResults(null);
    setShowQuestionResult(false);
    setPlayerAnswerTime(0);
    resetTimer();
  };

  const handleExitBattle = () => {
    if (socket) {
      socket.disconnect();
    }
    // Navigate back or close battle
    window.history.back();
  };

  const getPlayerInfo = (userId) => {
    if (userId === user?.user_id) return user;
    if (userId === gameData?.opponent?.user_id) return gameData.opponent;
    return null;
  };

  // Get player and opponent data for components
  const getPlayersData = () => {
    const player = {
      name: user?.username || "Bạn",
      avatar: user?.profile_picture || "/default-avatar.png",
      score: scores[user?.user_id] || 0,
      user_id: user?.user_id,
    };
    
    const opponent = {
      name: gameData?.opponent?.username || "Đối thủ",
      avatar: gameData?.opponent?.profile_picture || "/default-avatar.png",
      score: scores[gameData?.opponent?.user_id] || 0,
      user_id: gameData?.opponent?.user_id,
    };
    
    return { player, opponent };
  };

  // Connection Status Component
  const ConnectionStatus = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl mb-6 ${
        connected 
          ? "bg-green-50 border-2 border-green-200" 
          : "bg-red-50 border-2 border-red-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <span className={`font-medium ${connected ? "text-green-700" : "text-red-700"}`}>
            {connected ? "Đã kết nối server" : "Mất kết nối"}
          </span>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <img src={user.profile_picture} alt="" className="w-8 h-8 rounded-full" />
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        )}
      </div>
      {connectionError && (
        <p className="text-red-600 text-sm mt-2">{connectionError}</p>
      )}
    </motion.div>
  );

  // Waiting State Component
  const WaitingState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-6xl mb-6"
        >
          ⚔️
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Thách đấu từ vựng
        </h2>
        <p className="text-gray-600 mb-8">
          Tham gia trận chiến kiến thức và thể hiện khả năng từ vựng của bạn!
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoinQueue}
          disabled={!connected || loading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang tìm đối thủ...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <IoRocket className="text-xl" />
              Bắt đầu thách đấu
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  // Queue State Component
  const QueueState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-6"
        />
        
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Đang tìm đối thủ...
        </h3>
        <p className="text-gray-600 mb-2">
          Vị trí trong hàng đợi: <span className="font-bold text-indigo-600">#{queuePosition}</span>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Chúng tôi đang tìm đối thủ phù hợp cho bạn
        </p>
        
        <button
          onClick={handleLeaveQueue}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Hủy tìm kiếm
        </button>
      </div>
    </motion.div>
  );

  // Game Found State Component
  const GameFoundState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-lg mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-6"
        >
          🎯
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Đã tìm thấy đối thủ!
        </h3>
        
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <img src={user?.profile_picture} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 border-3 border-indigo-500" />
            <p className="font-semibold">{user?.username}</p>
          </div>
          
          <div className="text-4xl">⚔️</div>
          
          <div className="text-center">
            <img src={gameData?.opponent?.profile_picture} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 border-3 border-purple-500" />
            <p className="font-semibold">{gameData?.opponent?.username}</p>
          </div>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="font-medium text-indigo-800">
            Chuẩn bị chiến đấu...
          </p>
          <p className="text-sm text-indigo-600">
            Trận đấu sẽ bắt đầu sau ít giây
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Playing State Component
  const PlayingState = () => {
    const { player, opponent } = getPlayersData();
    
    // Check if both players answered for result notification
    const shouldShowResultNotification = showQuestionResult && questionResults;
    
    // Get player and opponent answer results
    const getAnswerResults = () => {
      if (!questionResults?.answers) return null;
      
      const playerAnswer = Object.values(questionResults.answers).find(
        answer => answer.user_id === player.user_id
      );
      const opponentAnswer = Object.values(questionResults.answers).find(
        answer => answer.user_id === opponent.user_id
      );
      
      return {
        playerCorrect: playerAnswer?.isCorrect || false,
        opponentCorrect: opponentAnswer?.isCorrect || false,
        playerTime: (playerAnswer?.responseTime || 0) / 1000,
        opponentTime: (opponentAnswer?.responseTime || 0) / 1000,
      };
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Display */}
        <ScoreDisplay player={player} opponent={opponent} />
        
        {/* Timer */}
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

        {/* Question */}
        {currentQuestion && (
          <VocabularyQuestion
            question={currentQuestion}
            playerAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            currentQuestion={questionNumber - 1}
            questionCount={totalQuestions}
            playerAnswerTime={playerAnswerTime}
          />
        )}

        {/* Opponent Status */}
        <OpponentStatus 
          playerAnswer={selectedAnswer} 
          opponentAnswer={questionResults?.answers ? 
            Object.values(questionResults.answers).find(a => a.user_id === opponent.user_id) : null
          } 
        />

        {/* Result Notification */}
        <AnimatePresence>
          {shouldShowResultNotification && (() => {
            const results = getAnswerResults();
            return results ? (
              <ResultNotification
                playerCorrect={results.playerCorrect}
                opponentCorrect={results.opponentCorrect}
                playerTime={results.playerTime}
                opponentTime={results.opponentTime}
                onContinue={() => setShowQuestionResult(false)}
              />
            ) : null;
          })()}
        </AnimatePresence>
      </div>
    );
  };

  // Game Ended State Component
  const GameEndedState = () => {
    const { player, opponent } = getPlayersData();
    
    return (
      <FinalResult
        player={player}
        opponent={opponent}
        onRetry={handlePlayAgain}
        onExit={handleExitBattle}
      />
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <IoGameController className="text-3xl text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Battle Arena</h1>
          </div>
          
          <button
            onClick={handleExitBattle}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Connection Status */}
        <ConnectionStatus />

        {/* Game States */}
        <AnimatePresence mode="wait">
          {gameState === "waiting" && <WaitingState key="waiting" />}
          {gameState === "inQueue" && <QueueState key="queue" />}
          {gameState === "gameFound" && <GameFoundState key="found" />}
          {gameState === "playing" && <PlayingState key="playing" />}
          {gameState === "ended" && <GameEndedState key="ended" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernBattle;