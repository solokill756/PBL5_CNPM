import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

// Import các component con
import BattleConnectionStatus from "@/components/Battle/BattleConnectionStatus";
import BattleWaitingScreen from "@/components/Battle/BattleWaitingScreen";
import BattleQueueScreen from "@/components/Battle/BattleQueueScreen";
import BattleGameFoundScreen from "@/components/Battle/BattleGameFoundScreen";
import BattleScoreHeader from "@/components/Battle/BattleScoreHeader";
import BattleTimer from "@/components/Battle/BattleTimer";
import BattleQuestion from "@/components/Battle/BattleQuestion";
import BattleQuestionResult from "@/components/Battle/BattleQuestionResult";
import FinalResult from "@/components/Battle/FinalResult";

const VocabularyBattle = () => {
  // Auth state
  const { accessToken, user } = useAuthStore();

  // Socket state
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  // Game states
  const [gameState, setGameState] = useState("waiting");
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

  const timerRef = useRef(null);

  // Socket connection
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
      setLoading(false);
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

      setTimeout(() => {
        newSocket.emit("ready_to_start", { roomId: data.roomId });
      }, 2000);
    });

    newSocket.on("game_started", (data) => {
      console.log("🚀 Game started:", data);
      setGameState("playing");
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setSelectedAnswer(null);
      setShowQuestionResult(false);
      startQuestionTimer();
    });

    newSocket.on("next_question", (data) => {
      console.log("➡️ Next question:", data);
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setSelectedAnswer(null);
      setQuestionResults(null);
      setShowQuestionResult(false);
      startQuestionTimer();
    });

    newSocket.on("question_result", (data) => {
      console.log("📊 Question result:", data);
      setQuestionResults(data);
      setScores(data.scores);
      setShowQuestionResult(true);
      resetTimer();
    });

    newSocket.on("game_ended", (data) => {
      console.log("🏁 Game ended:", data);
      setGameState("ended");
      setGameResults(data);
      setScores(data.finalScores);
      resetTimer();
    });

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

  // Timer functions
  const startQuestionTimer = () => {
    setTimeLeft(10);
    setTimerActive(true);

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
    if (socket && gameData && !selectedAnswer) {
      socket.emit("time_end", { roomId: gameData.roomId });
    }
  };

  // Game actions
  const handleJoinQueue = () => {
    if (socket && connected) {
      setLoading(true);
      socket.emit("join_queue", {});
    }
  };

  const handleLeaveQueue = () => {
    if (socket && connected) {
      socket.emit("leave_queue");
      setGameState("waiting");
      setQueuePosition(0);
      setLoading(false);
    }
  };

  const handleSubmitAnswer = (answer) => {
    if (socket && connected && gameData && selectedAnswer === null && timerActive) {
      setSelectedAnswer(answer);
      resetTimer();
      
      socket.emit("submit_answer", {
        roomId: gameData.roomId,
        answer: answer,
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
    setGameResults(null);
    setQuestionResults(null);
    setSelectedAnswer(null);
    setShowQuestionResult(false);
    setLoading(false);
  };

  const handleExit = () => {
    // Navigate to home or previous page
    window.history.back();
  };

  // Get player info
  const getPlayerInfo = (userId) => {
    if (!gameData) return null;
    
    if (userId === user?.user_id) {
      return { username: user.username, user_id: user.user_id, isMe: true };
    } else if (userId === gameData.opponent?.user_id) {
      return { ...gameData.opponent, isMe: false };
    } else if (userId === gameData.player?.user_id) {
      return { ...gameData.player, isMe: false };
    }
    
    return null;
  };

  // Transform gameResults for FinalResult component
  const getPlayerData = () => {
    if (!gameResults || !gameData) return null;
    
    return {
      player: {
        name: user?.username,
        avatar: user?.profile_picture,
        score: gameResults.finalScores[user?.user_id] || 0
      },
      opponent: {
        name: gameData.opponent?.username,
        avatar: null, // No avatar for opponent
        score: gameResults.finalScores[gameData.opponent?.user_id] || 0
      }
    };
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Đối kháng từ vựng
        </motion.h1>

        <BattleConnectionStatus 
          connected={connected}
          connectionError={connectionError}
          user={user}
        />

        <AnimatePresence mode="wait">
          {gameState === "waiting" && (
            <BattleWaitingScreen 
              onJoinQueue={handleJoinQueue}
              connected={connected}
              loading={loading}
            />
          )}
          
          {gameState === "inQueue" && (
            <BattleQueueScreen 
              queuePosition={queuePosition}
              onLeaveQueue={handleLeaveQueue}
            />
          )}
          
          {gameState === "gameFound" && (
            <BattleGameFoundScreen 
              user={user}
              gameData={gameData}
              totalQuestions={totalQuestions}
            />
          )}
          
          {gameState === "playing" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <BattleScoreHeader 
                user={user}
                gameData={gameData}
                scores={scores}
                questionNumber={questionNumber}
                totalQuestions={totalQuestions}
              />
              
              <BattleTimer 
                timeLeft={timeLeft}
                totalTime={10}
              />
              
              <BattleQuestion 
                currentQuestion={currentQuestion}
                selectedAnswer={selectedAnswer}
                timerActive={timerActive}
                onSubmitAnswer={handleSubmitAnswer}
              />
              
              <BattleQuestionResult 
                showQuestionResult={showQuestionResult}
                questionResults={questionResults}
                getPlayerInfo={getPlayerInfo}
              />
            </div>
          )}
          
          {gameState === "ended" && gameResults && (
            <FinalResult 
              {...getPlayerData()}
              onRetry={handlePlayAgain}
              onExit={handleExit}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VocabularyBattle;