import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import useRefreshToken from "@/hooks/useRefreshToken";
import DefaultAvatar from "@/assets/images/avatar.jpg";
import { IoGameController, IoClose, IoRocket } from "react-icons/io5";

// Import các component đẹp đã có
import VocabularyQuestion from "./VocabularyQuestion";
import ScoreDisplay from "./ScoreDisplay";
import CountdownTimer from "./CountdownTimer";
import ResultNotification from "./ResultNotification";
import FinalResult from "./FinalResult";

const ModernBattle = () => {
  // Auth state
  const { accessToken, user, logout } = useAuthStore();
  const refresh = useRefreshToken();

  // Socket state
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const roomIdRef = useRef(null);

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

  // Timer states - Đồng bộ với backend
  const [timeLeft, setTimeLeft] = useState(10);
  const [showTimer, setShowTimer] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // UI states
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [showNextQuestionDelay, setShowNextQuestionDelay] = useState(false);

  const timerRef = useRef(null);
  const questionStartTime = useRef(null);
  const socketRef = useRef(null);

  // Token refresh handler
  const handleTokenRefresh = async () => {
    try {
      const newToken = await refresh();
      if (newToken && socketRef.current) {
        // Reconnect socket với token mới
        socketRef.current.disconnect();
        initializeSocket(newToken);
      }
      return newToken;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      logout();
      setConnectionError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }
  };

  // Initialize socket connection
  const initializeSocket = (token) => {
    if (!token) {
      setConnectionError("Vui lòng đăng nhập để chơi battle!");
      return;
    }
  
    const newSocket = io("https://backendserver-app.azurewebsites.net", {
      auth: { token: token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
  
    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to battle server");
      setConnected(true);
      setConnectionError("");
    });
  
    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      setConnected(false);
      
      // Chỉ reset game state nếu không phải manual disconnect
      if (reason !== "io client disconnect") {
        setGameState("waiting");
        stopTimer();
      }
    });
  
    newSocket.on("connect_error", async (error) => {
      console.error("❌ Connection error:", error);
  
      // Nếu lỗi authentication, thử refresh token
      if (
        error.message.includes("Authentication") ||
        error.message.includes("token")
      ) {
        console.log("🔄 Attempting token refresh...");
        const newToken = await handleTokenRefresh();
        if (!newToken) {
          setConnectionError("Lỗi xác thực: " + error.message);
        }
      } else {
        setConnectionError("Lỗi kết nối: " + error.message);
      }
    });
  
    // Queue events
    newSocket.on("queue_joined", (data) => {
      console.log("🎯 Queue joined:", data);
      setGameState("inQueue");
      setQueuePosition(data.position);
      setLoading(false);
    });
  
    newSocket.on("game_found", (data) => {
      console.log("🎮 Game found:", data);
      setGameData(data);
      roomIdRef.current = data.roomId; // Lưu roomId vào ref
      setGameState("gameFound");
      setTotalQuestions(data.totalQuestions);
      setScores({
        [data.player.user_id]: 0,
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
      
      // Pass roomId từ gameData
      setGameData((currentGameData) => {
        const roomId = currentGameData?.roomId;
        startNewQuestion(data, roomId);
        return currentGameData;
      });
    });
  
    newSocket.on("next_question", (data) => {
      console.log("➡️ Next question:", data);
      // Reset states trước khi start câu mới
      setShowQuestionResult(false);
      setQuestionResults(null);
      setSelectedAnswer(null);
      setWaitingForOpponent(false);
      setIsTimeUp(false);
      
      // Hiển thị delay trước khi start câu mới
      setShowNextQuestionDelay(true);
      setTimeout(() => {
        setShowNextQuestionDelay(false);
        
        // Get roomId từ gameData hiện tại
        setGameData((currentGameData) => {
          const roomId = currentGameData?.roomId;
          startNewQuestion({
            question: data.question,
            questionNumber: data.questionNumber + 1, // Backend gửi index 0-based, frontend cần 1-based
            totalQuestions: totalQuestions
          }, roomId);
          return currentGameData;
        });
      }, 1000);
    });
  
    newSocket.on("question_result", (data) => {
      console.log("📊 Question result:", data);
  
      // Stop timer và hiển thị kết quả
      stopTimer();
      setQuestionResults(data);
      setScores(data.scores);
      setShowQuestionResult(true);
      setWaitingForOpponent(false);
  
      // Đồng bộ selectedAnswer nếu user timeout
      const answersArray = Object.values(data.answers);
      const playerAnswer = answersArray.find(
        (answer) => answer.username === user.username
      );
  
      // Nếu player chưa trả lời và backend trả về null answer
      if (selectedAnswer === null && playerAnswer && playerAnswer.answer === null) {
        console.log("🕐 Player timed out - syncing with backend");
        setSelectedAnswer("timeout");
        setIsTimeUp(true);
      }
    });
  
    newSocket.on("game_ended", (data) => {
      console.log("🏁 Game ended:", data);
      setGameState("ended");
      setGameResults(data);
      setScores(data.finalScores);
      setShowQuestionResult(false);
      stopTimer();
    });
  
    // Error events
    newSocket.on("error", (error) => {
      console.error("❌ Game error:", error);
      setConnectionError("Lỗi game: " + error.message);
    });
  
    newSocket.on("opponent_disconnected", (data) => {
      console.log("🚪 Opponent disconnected:", data);
      
      // Tạo kết quả thắng cho player hiện tại
      const currentPlayerScore = scores[user.id] || 0;
      const opponentId = gameData?.opponent?.user_id || gameData?.player?.user_id;
      
      setGameState("ended");
      setGameResults({
        winner: { username: user.username, user_id: user.id },
        isDraw: false,
        finalScores: { 
          [user.id]: currentPlayerScore + 100, // Bonus cho việc thắng
          [opponentId]: scores[opponentId] || 0
        },
        totalQuestions: totalQuestions,
        reason: "opponent_disconnected",
      });
      stopTimer();
    });
  
    setSocket(newSocket);
    socketRef.current = newSocket;
  
    return newSocket;
  };

  useEffect(() => {
    const newSocket = initializeSocket(accessToken);

    return () => {
      stopTimer();
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  // Helper function để start câu hỏi mới
  const startNewQuestion = (data) => {
    const transformedQuestion = transformQuestionFormat(data.question);
    setCurrentQuestion(transformedQuestion);
    setQuestionNumber(data.questionNumber);
    setSelectedAnswer(null);
    setQuestionResults(null);
    setShowQuestionResult(false);
    setWaitingForOpponent(false);
    setIsTimeUp(false);
  
    // Start timer
    startTimer();
  };

  // Transform backend question format
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
  
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
  
        if (newTime <= 0) {
          // Hết thời gian - emit time_end event
          console.log("⏰ Time's up! Emitting time_end event");
          
          if (socketRef.current && roomIdRef.current) {
            console.log(`🔴 Emitting time_end for room: ${roomIdRef.current}`);
            socketRef.current.emit("time_end", { roomId: roomIdRef.current });
          } else {
            console.log("❌ Cannot emit time_end", {
              socket: !!socketRef.current,
              roomId: roomIdRef.current
            });
          }
  
          setIsTimeUp(true);
          stopTimer();
          
          // Nếu user chưa trả lời, tự động set timeout
          setSelectedAnswer((currentAnswer) => {
            if (currentAnswer === null) {
              setWaitingForOpponent(true);
              return "timeout";
            }
            return currentAnswer;
          });
          
          return 0;
        }
        return newTime;
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
      setLoading(false);
    }
  };

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null || isTimeUp) return;
  
    const responseTime = Date.now() - questionStartTime.current;
  
    setSelectedAnswer(answer);
    setWaitingForOpponent(true);
    stopTimer();
  
    if (socketRef.current && roomIdRef.current) {
      console.log(`💡 Submitting answer: ${answer} (${responseTime}ms)`);
      socketRef.current.emit("submit_answer", {
        roomId: roomIdRef.current,
        answer: answer === "timeout" ? null : answer,
        responseTime: responseTime,
      });
    }
  };

  const handlePlayAgain = () => {
    setGameState("waiting");
    setGameData(null);
    roomIdRef.current = null; // Reset roomId
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setTotalQuestions(0);
    setScores({});
    setSelectedAnswer(null);
    setGameResults(null);
    setQuestionResults(null);
    setShowQuestionResult(false);
    setWaitingForOpponent(false);
    setShowNextQuestionDelay(false);
    setIsTimeUp(false);
    stopTimer();
  };

  const handleExitBattle = () => {
    // Cleanup trước khi disconnect
    stopTimer();
    setGameState("waiting");
    
    if (socket) {
      // Rời khỏi queue nếu đang trong queue
      if (gameState === "inQueue") {
        socket.emit("leave_queue");
      }
      
      // Disconnect socket
      socket.disconnect();
    }
    
    // Navigate back
    window.history.back();
  };

  // Get player and opponent data for components
  const getPlayersData = () => {
    if (!gameData) {
      return {
        player: { name: "Bạn", profile_picture: DefaultAvatar, score: 0, user_id: user?.id },
        opponent: { name: "Đối thủ", profile_picture: DefaultAvatar, score: 0, user_id: null }
      };
    }
  
    const player = {
      name: gameData.player?.username || "Bạn",
      profile_picture: gameData.player?.profile_picture?.profile_picture || DefaultAvatar,
      score: scores[gameData.player?.user_id] || 0,
      user_id: gameData.player?.user_id,
    };
  
    const opponent = {
      name: gameData.opponent?.username || "Đối thủ",
      profile_picture: gameData.opponent?.profile_picture?.profile_picture || DefaultAvatar,
      score: scores[gameData.opponent?.user_id] || 0,
      user_id: gameData.opponent?.user_id,
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
          <div
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span
            className={`font-medium ${
              connected ? "text-green-700" : "text-red-700"
            }`}
          >
            {connected ? "Đã kết nối server" : "Mất kết nối"}
          </span>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <img
              src={user.profile_picture || DefaultAvatar}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        )}
      </div>
      {connectionError && (
        <div className="mt-2">
          <p className="text-red-600 text-sm">{connectionError}</p>
          {connectionError.includes("hết hạn") && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Tải lại trang
            </button>
          )}
        </div>
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
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
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
          Vị trí trong hàng đợi:{" "}
          <span className="font-bold text-indigo-600">#{queuePosition}</span>
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

  const { player, opponent } = getPlayersData();

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
            <img
              src={player.profile_picture || DefaultAvatar}
              alt=""
              className="w-16 h-16 rounded-full mx-auto mb-2 border-3 border-indigo-500"
            />
            <p className="font-semibold">{player.name}</p>
          </div>

          <div className="text-4xl">⚔️</div>

          <div className="text-center">
            <img
              src={opponent.profile_picture || DefaultAvatar}
              alt=""
              className="w-16 h-16 rounded-full mx-auto mb-2 border-3 border-purple-500"
            />
            <p className="font-semibold">{opponent.name}</p>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="font-medium text-indigo-800">Chuẩn bị chiến đấu...</p>
          <p className="text-sm text-indigo-600">
            Trận đấu sẽ bắt đầu sau ít giây
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Next Question Delay Component
  const NextQuestionDelay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
        />
        <p className="text-lg font-semibold text-gray-800">
          Chuẩn bị câu tiếp theo...
        </p>
      </motion.div>
    </motion.div>
  );

  const PlayingState = () => {
    const { player, opponent } = getPlayersData();
  
    const shouldShowResultNotification = showQuestionResult && questionResults;
  
    const getAnswerResults = () => {
      if (!questionResults?.answers) return null;
  
      const answersArray = Object.values(questionResults.answers);
  
      // Tìm đúng player và opponent dựa trên username
      const playerAnswer = answersArray.find(
        (answer) => answer.username === user.username
      );
  
      const opponentAnswer = answersArray.find(
        (answer) => answer.username !== user.username
      );
  
      return {
        playerCorrect: playerAnswer?.isCorrect || false,
        opponentCorrect: opponentAnswer?.isCorrect || false,
        playerTime: (playerAnswer?.responseTime || 0) / 1000,
        opponentTime: (opponentAnswer?.responseTime || 0) / 1000,
        playerPoints: playerAnswer?.points || 0,
        opponentPoints: opponentAnswer?.points || 0,
        playerTimeout: playerAnswer?.answer === null,
        opponentTimeout: opponentAnswer?.answer === null,
      };
    };
  
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Display */}
        <ScoreDisplay player={player} opponent={opponent} />
  
        {/* Timer - Chỉ hiển thị khi đang trong câu hỏi */}
        {showTimer && !showQuestionResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Câu {questionNumber}/{totalQuestions}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Thời gian còn lại
              </span>
            </div>
            <CountdownTimer timeLeft={timeLeft} totalTime={10} />
          </motion.div>
        )}
  
        {/* Waiting message */}
        {waitingForOpponent && !showQuestionResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-blue-700 font-medium">
                {isTimeUp || selectedAnswer === "timeout"
                  ? "Hết thời gian! Đang chờ đối thủ hoặc kết quả..."
                  : "Đang chờ đối thủ trả lời..."}
              </span>
            </div>
          </motion.div>
        )}
  
        {/* Question */}
        {currentQuestion && !showQuestionResult && (
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
          {shouldShowResultNotification &&
            (() => {
              const results = getAnswerResults();
              return results ? (
                <ResultNotification
                  playerCorrect={results.playerCorrect}
                  opponentCorrect={results.opponentCorrect}
                  playerTime={results.playerTime}
                  opponentTime={results.opponentTime}
                  playerPoints={results.playerPoints}
                  opponentPoints={results.opponentPoints}
                  playerTimeout={results.playerTimeout}
                  opponentTimeout={results.opponentTimeout}
                  questionResults={questionResults}
                  currentUser={user}
                />
              ) : null;
            })()}
        </AnimatePresence>
  
        {/* Next Question Delay */}
        {/* <AnimatePresence>
          {showNextQuestionDelay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-8 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
                />
                <p className="text-lg font-semibold text-gray-800">
                  Chuẩn bị câu tiếp theo...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence> */}
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
        gameResults={gameResults}
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

        {/* Connection Status - Chỉ hiển thị khi có lỗi */}
        {(!connected || connectionError) && <ConnectionStatus />}

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
