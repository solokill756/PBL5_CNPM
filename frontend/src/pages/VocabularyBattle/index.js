import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import useRefreshToken from "@/hooks/useRefreshToken";
import DefaultAvatar from "@/assets/images/avatar.jpg";
import {
  IoGameController,
  IoClose,
  IoRocket,
  IoTrophy,
  IoTime,
  IoRocketOutline,
} from "react-icons/io5";

// Import các component đẹp đã có
import VocabularyQuestion from "@/components/Battle/VocabularyQuestion";
import ScoreDisplay from "@/components/Battle/ScoreDisplay";
import CountdownTimer from "@/components/Battle/CountdownTimer";
import ResultNotification from "@/components/Battle/ResultNotification";
import FinalResult from "@/components/Battle/FinalResult";
import { useNavigate } from "react-router-dom";

const VocabularyBattle = () => {
  // Auth state
  const { accessToken, user, logout } = useAuthStore();
  const refresh = useRefreshToken();
  const navigate = useNavigate();

  // Socket state
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const roomIdRef = useRef(null);

  // Game states - Bỏ "inQueue" state
  const [gameState, setGameState] = useState("waiting"); // waiting, gameFound, playing, ended
  const [gameData, setGameData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [scores, setScores] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [questionResults, setQuestionResults] = useState(null);

  // Timer states - Đồng bộ với backend
  const [timeLeft, setTimeLeft] = useState(10);
  const [showTimer, setShowTimer] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // UI states
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  const [loading, setLoading] = useState(false); // Dùng cho queue loading
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
        setLoading(false); // Reset loading state
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

    // Queue events - Không thay đổi gameState, chỉ log
    newSocket.on("queue_joined", (data) => {
      console.log("🎯 Queue joined:", data);
      // Giữ nguyên loading state, không thay đổi gameState
    });

    newSocket.on("game_found", (data) => {
      console.log("🎮 Game found:", data);
      setGameData(data);
      roomIdRef.current = data.roomId;
      setGameState("gameFound");
      setLoading(false); // Tắt loading khi tìm thấy game
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

      // Trực tiếp start question đầu tiên
      startNewQuestion(data);
    });

    newSocket.on("next_question", (data) => {
      console.log("➡️ Next question:", data);

      // Reset states trước khi start câu mới
      setShowQuestionResult(false);
      setQuestionResults(null);
      setSelectedAnswer(null);
      setWaitingForOpponent(false);
      setIsTimeUp(false);

      startNewQuestion({
        question: data.question,
        questionNumber: data.questionNumber,
        totalQuestions: totalQuestions,
      });
    });

    newSocket.on("question_result", (data) => {
      console.log("📊 Question result:", data);

      // Stop timer and show results
      stopTimer();
      setQuestionResults(data);
      setScores(data.scores);
      setShowQuestionResult(true);
      setWaitingForOpponent(false);

      // Sync selectedAnswer if user timed out (backend returned null)
      if (selectedAnswer === null) {
        const answersArray = Object.values(data.answers);
        const playerAnswer = answersArray.find(
          (answer) => answer.username === user.username
        );

        if (playerAnswer && playerAnswer.answer === null) {
          console.log("🕐 Player timed out - syncing with backend");
          setSelectedAnswer("timeout");
          setIsTimeUp(true);
        }
      }
    });

    newSocket.on("game_ended", handleGameEnd);

    // Error events
    newSocket.on("error", (error) => {
      console.error("❌ Game error:", error);
      setConnectionError("Lỗi game: " + error.message);
      setLoading(false); // Tắt loading khi có lỗi
    });

    newSocket.on("opponent_disconnected", handleOpponentDisconnected);

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

  // Sửa lại hàm startTimer
  const startTimer = () => {
    // Prevent multiple timers
    if (timerActive) {
      console.log("⚠️ Timer already active, skipping start");
      return;
    }

    // Clear any existing timer
    stopTimer();

    setTimeLeft(10);
    setShowTimer(true);
    setIsTimeUp(false);
    setTimerActive(true);
    questionStartTime.current = Date.now();

    console.log("⏰ Starting new timer");
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          console.log("⏰ Time's up!");
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const handleGameEnd = (data) => {
    console.log("🏁 Game ended:", data);

    // Backend đã cung cấp đầy đủ thông tin
    const resultData = {
      ...data, // winner, finalScores, totalQuestions, isDraw, player, opponent từ BE
      roomId: roomIdRef.current,
      timestamp: Date.now(),
      reason: "normal_game_end",
    };

    console.log("====================================");
    console.log(roomIdRef.current);
    console.log("====================================");
    console.log("💾 Saving game result:", resultData);
    localStorage.setItem(
      `battle_result_${roomIdRef.current}`,
      JSON.stringify(resultData)
    );
    navigate(`/battle/${roomIdRef.current}/result`);
  };

  const handleOpponentDisconnected = (data) => {
    console.log("🚪 Opponent disconnected:", data);

    // Sử dụng trực tiếp data từ BE, không tự thêm bonus
    const resultData = {
      ...data, // Giữ nguyên data từ BE
      roomId: roomIdRef.current,
      timestamp: Date.now(),
      reason: "opponent_disconnected",
    };

    console.log("💾 Saving disconnect result:", resultData);
    localStorage.setItem(
      `battle_result_${roomIdRef.current}`,
      JSON.stringify(resultData)
    );
    navigate(`/battle/${roomIdRef.current}/result`);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    setIsTimeUp(true);
    setShowTimer(false);

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only submit if user hasn't answered yet
    if (selectedAnswer === null) {
      console.log("🔴 Auto-submitting null answer due to timeout");
      setSelectedAnswer("timeout");
      setWaitingForOpponent(true);

      if (socketRef.current && roomIdRef.current) {
        socketRef.current.emit("submit_answer", {
          roomId: roomIdRef.current,
          answer: null,
          responseTime: 10000,
        });
      }
    }
  };

  const stopTimer = () => {
    console.log("🛑 Stopping timer");
    setTimerActive(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setShowTimer(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

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
    // Prevent multiple answers or answering after timeout
    if (selectedAnswer !== null || isTimeUp || !timerActive) {
      console.log("❌ Cannot select answer", {
        selectedAnswer,
        isTimeUp,
        timerActive,
      });
      return;
    }

    const responseTime = Date.now() - questionStartTime.current;

    console.log(`💡 User selecting answer: ${answer}`);
    setSelectedAnswer(answer);
    setWaitingForOpponent(true);
    stopTimer(); // Stop timer immediately when user answers

    if (socketRef.current && roomIdRef.current) {
      console.log(`📤 Submitting answer: ${answer} (${responseTime}ms)`);
      socketRef.current.emit("submit_answer", {
        roomId: roomIdRef.current,
        answer: answer === "timeout" ? null : answer,
        responseTime: responseTime,
      });
    }
  };

  const handleExitBattle = () => {
    // Cleanup trước khi disconnect
    stopTimer();
    setGameState("waiting");
    setLoading(false);

    if (socket) {
      // Rời khỏi queue nếu đang loading (tức là đang trong queue)
      if (loading) {
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
        player: {
          name: "Bạn",
          profile_picture: DefaultAvatar,
          score: 0,
          user_id: user?.id,
        },
        opponent: {
          name: "Đối thủ",
          profile_picture: DefaultAvatar,
          score: 0,
          user_id: null,
        },
      };
    }

    const player = {
      name: gameData.player?.username || "Bạn",
      profile_picture: gameData.player?.profile_picture || DefaultAvatar,
      score: scores[gameData.player?.user_id] || 0,
      user_id: gameData.player?.user_id,
    };

    const opponent = {
      name: gameData.opponent?.username || "Đối thủ",
      profile_picture: gameData.opponent?.profile_picture || DefaultAvatar,
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

  // Updated Waiting State Component - Tích hợp queue loading
  const WaitingState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {!loading ? (
          // Trạng thái chờ bắt đầu
          <>
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
              Tham gia trận chiến kiến thức và thể hiện khả năng từ vựng của
              bạn!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinQueue}
              disabled={!connected}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <IoRocket className="text-xl" />
                Bắt đầu thách đấu
              </div>
            </motion.button>
          </>
        ) : (
          // Trạng thái đang tìm đối thủ (loading)
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-6"
            />

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Đang tìm đối thủ...
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Chúng tôi đang tìm đối thủ phù hợp cho bạn
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeaveQueue}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Hủy tìm kiếm
            </motion.button>
          </>
        )}
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

  const PlayingState = () => {
    const { player, opponent } = getPlayersData();

    const shouldShowResultNotification = showQuestionResult && questionResults;

    const getAnswerResults = useMemo(() => {
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
    }, [questionResults, user.username]);

    // Memoize player data để tránh re-render
    const memoizedPlayer = useMemo(
      () => player,
      [player.score, player.name, player.profile_picture]
    );
    const memoizedOpponent = useMemo(
      () => opponent,
      [opponent.score, opponent.name, opponent.profile_picture]
    );

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Display */}
        <ScoreDisplay player={memoizedPlayer} opponent={memoizedOpponent} />

        {/* Timer - Chỉ hiển thị khi đang trong câu hỏi và chưa có kết quả */}
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

        {/* Question - CHỈ hiển thị khi KHÔNG có result */}
        {currentQuestion && !showQuestionResult && (
          <VocabularyQuestion
            question={currentQuestion}
            playerAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            currentQuestion={questionNumber}
            questionCount={totalQuestions}
            questionResults={questionResults}
            waitingForOpponent={waitingForOpponent}
            currentUser={user}
            isTimeUp={isTimeUp}
          />
        )}

        {/* Result Notification - AnimatePresence với key để tránh flash */}
        <AnimatePresence mode="wait">
          {shouldShowResultNotification && getAnswerResults && (
            <ResultNotification
              key={`result-${questionNumber}`}
              playerCorrect={getAnswerResults.playerCorrect}
              opponentCorrect={getAnswerResults.opponentCorrect}
              playerTime={getAnswerResults.playerTime}
              opponentTime={getAnswerResults.opponentTime}
              playerPoints={getAnswerResults.playerPoints}
              opponentPoints={getAnswerResults.opponentPoints}
              playerTimeout={getAnswerResults.playerTimeout}
              opponentTimeout={getAnswerResults.opponentTimeout}
              questionResults={questionResults}
              currentUser={user}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <IoGameController className="text-3xl text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Đối kháng từ vựng
            </h1>
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

        {/* Game States - Bỏ QueueState */}
        <AnimatePresence mode="wait">
          {gameState === "waiting" && <WaitingState key="waiting" />}
          {gameState === "gameFound" && <GameFoundState key="found" />}
          {gameState === "playing" && <PlayingState key="playing" />}
        </AnimatePresence>
      </div>

      {(gameState === "waiting" || gameState === "gameFound") && (
          <div className="mt-16 bg-indigo-900 text-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">
                Tại sao chơi chế độ đối kháng?
              </h2>
              <p className="text-indigo-200 mb-8">
                Chế độ đối kháng giúp bạn ôn tập từ vựng tiếng Nhật một cách thú
                vị và hiệu quả, đồng thời xây dựng kỹ năng phản xạ nhanh - điều
                cần thiết khi giao tiếp thực tế.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-800 rounded-lg p-5">
                  <IoRocketOutline className="w-8 h-8 text-indigo-300 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Học tập cạnh tranh</h3>
                  <p className="text-indigo-200 text-sm">
                    Thi đấu trực tiếp với người khác tạo động lực học tập và ghi
                    nhớ từ vựng tốt hơn.
                  </p>
                </div>

                <div className="bg-indigo-800 rounded-lg p-5">
                  <IoTime className="w-8 h-8 text-indigo-300 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Phản xạ nhanh</h3>
                  <p className="text-indigo-200 text-sm">
                    Luyện tập phản ứng nhanh với thời gian giới hạn, giúp bạn
                    nhớ và truy xuất từ vựng tức thì.
                  </p>
                </div>

                <div className="bg-indigo-800 rounded-lg p-5">
                  <IoTrophy className="w-8 h-8 text-indigo-300 mb-3" />
                  <h3 className="font-bold text-lg mb-2">
                    Phần thưởng hấp dẫn
                  </h3>
                  <p className="text-indigo-200 text-sm">
                    Giành huy hiệu và điểm kinh nghiệm để mở khóa nội dung độc
                    quyền và theo dõi tiến độ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default VocabularyBattle;
