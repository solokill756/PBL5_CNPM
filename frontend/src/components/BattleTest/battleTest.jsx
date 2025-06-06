// src/components/Battle/BattleTest.jsx
import { useAuthStore } from "@/store/useAuthStore";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BattleTest = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");

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

  const fakeToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!fakeToken) {
      setMessage("Không có token! Vui lòng đăng nhập trước.");
      return;
    }

    const newSocket = io("http://localhost:9000", {
      auth: {
        token: fakeToken,
      },
    });

    // === EVENTS CƠ BẢN ===
    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
      setConnected(true);
      setMessage("Kết nối thành công!");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setConnected(false);
      setMessage("Mất kết nối!");
      setGameState("waiting");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setMessage("Lỗi kết nối: " + error.message);
    });

    // === QUEUE EVENTS ===
    newSocket.on("queue_joined", (data) => {
      console.log("🎯 Queue joined:", data);
      setGameState("inQueue");
      setQueuePosition(data.position);
      setMessage(`Đang chờ trong hàng đợi. Vị trí: ${data.position}`);
    });

    // === GAME EVENTS ===
    newSocket.on("game_found", (data) => {
      console.log("🎮 Game found:", data);
      setGameData(data);
      setGameState("gameFound");
      setTotalQuestions(data.totalQuestions);
      setMessage(`Tìm thấy đối thủ: ${data.opponent.username}`);

      // Auto ready after 2 seconds (hoặc có thể để user click manual)
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
      setMessage(`Câu hỏi ${data.questionNumber}/${data.totalQuestions}`);
    });

    newSocket.on("next_question", (data) => {
      console.log("➡️ Next question:", data);
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setSelectedAnswer(null);
      setQuestionResults(null);
      setMessage(`Câu hỏi ${data.questionNumber}/${totalQuestions}`);
    });

    newSocket.on("question_result", (data) => {
      console.log("📊 Question result:", data);
      setQuestionResults(data);
      setScores(data.scores);
      setMessage("Kết quả câu hỏi");
    });

    newSocket.on("game_ended", (data) => {
      console.log("🏁 Game ended:", data);
      setGameState("ended");
      setGameResults(data);
      setScores(data.finalScores);

      if (data.isDraw) {
        setMessage("Hòa!");
      } else {
        setMessage(`Người thắng: ${data.winner.username}`);
      }
    });

    // === ERROR EVENTS ===
    newSocket.on("error", (error) => {
      console.error("❌ Game error:", error);
      setMessage("Lỗi: " + error.message);
    });

    newSocket.on("opponent_disconnected", (data) => {
      console.log("🚪 Opponent disconnected:", data);
      setMessage(data.message);
      setGameState("ended");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [fakeToken]);

  // === HANDLERS ===
  const handleJoinQueue = () => {
    if (socket && connected) {
      socket.emit("join_queue", { topic: "network" });
      setMessage("Đang tìm đối thủ...");
    }
  };

  const handleLeaveQueue = () => {
    if (socket && connected) {
      socket.emit("leave_queue");
      setMessage("Đã rời khỏi hàng đợi");
      setGameState("waiting");
      setGameData(null);
      setQueuePosition(0);
    }
  };

  const handleSubmitAnswer = (answer) => {
    if (socket && connected && gameData && selectedAnswer === null) {
      setSelectedAnswer(answer);
      socket.emit("submit_answer", {
        roomId: gameData.roomId,
        answer: answer,
      });
      setMessage("Đã trả lời, đợi kết quả...");
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
    setMessage("Sẵn sàng chơi lại!");
  };

  // === RENDER FUNCTIONS ===
  const renderConnectionStatus = () => (
    <div
      className={`p-4 rounded mb-4 ${
        connected ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <span>Status: {connected ? "Connected" : "Disconnected"}</span>
        <span
          className={`w-3 h-3 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
      </div>
    </div>
  );

  const renderQueueStatus = () =>
    gameState === "inQueue" && (
      <div className="mb-4 p-4 bg-yellow-100 rounded">
        <h3 className="font-bold">🎯 Đang tìm đối thủ...</h3>
        <p>Vị trí trong hàng đợi: {queuePosition}</p>
        <div className="animate-pulse">Đang chờ...</div>
      </div>
    );

  const renderGameFound = () =>
    gameState === "gameFound" &&
    gameData && (
      <div className="mb-4 p-4 bg-blue-100 rounded">
        <h3 className="font-bold">🎮 Đã tìm thấy trận đấu!</h3>
        <p>Room ID: {gameData.roomId}</p>
        <p>Đối thủ: {gameData.opponent.username}</p>
        <p>Chủ đề: {gameData.topic}</p>
        <p>Tổng câu hỏi: {gameData.totalQuestions}</p>
        <div className="mt-2 text-sm text-gray-600">
          Đang chuẩn bị bắt đầu...
        </div>
      </div>
    );

  const renderCurrentQuestion = () =>
    gameState === "playing" &&
    currentQuestion && (
      <div className="mb-4 p-4 bg-white border rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            Câu hỏi {questionNumber}/{totalQuestions}
          </h3>
          {scores ? (
            <div className="text-sm">
              {Object.entries(scores).map(([userId, score]) => {
                // Tìm username từ gameData nếu có
                const player = gameData?.players?.find(
                  (player) => player.userId === userId
                );
                const username = player?.username || `User ${userId}`;

                return (
                  <span key={userId} className="ml-2 font-medium">
                    {username}: {score} điểm
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="text-sm">
              {gameData?.players?.map((player) => (
                <span key={player.userId} className="ml-2 font-medium">
                  {player.username}: 0 điểm
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-lg mb-4">{currentQuestion.question}</p>

          <div className="grid grid-cols-1 gap-2">
            {["A", "B", "C", "D"].map((option) => (
              <button
                key={option}
                onClick={() =>
                  handleSubmitAnswer(
                    currentQuestion[`option_${option.toLowerCase()}`]
                  )
                }
                disabled={selectedAnswer !== null}
                className={`p-3 text-left rounded border transition-colors ${
                  selectedAnswer === option
                    ? "bg-blue-500 text-white"
                    : selectedAnswer !== null
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {option}. {currentQuestion[`option_${option.toLowerCase()}`]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  const renderQuestionResults = () =>
    questionResults && (
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">📊 Kết quả câu hỏi</h3>
        <p className="mb-2">Đáp án đúng: {questionResults.correctAnswer}</p>

        <div className="space-y-2">
          {Object.entries(questionResults.answers).map(([userId, answer]) => (
            <div key={userId} className="flex justify-between">
              <span>{answer.username} :</span>
              <span
                className={answer.isCorrect ? "text-green-600" : "text-red-600"}
              >
                {answer.answer || "Không trả lời"}(
                {answer.isCorrect ? "✓" : "✗"}) +{answer.points} điểm
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 text-sm text-gray-600">
          Điểm hiện tại:{" "}
          {Object.entries(questionResults.scores)
            .map(([userId, score]) => `User ${userId}: ${score}`)
            .join(", ")}
        </div>
      </div>
    );

  const renderGameResults = () =>
    gameState === "ended" &&
    gameResults && (
      <div className="mb-4 p-4 bg-purple-100 rounded">
        <h3 className="font-bold text-xl mb-2">🏁 Kết thúc trận đấu!</h3>

        {gameResults.isDraw ? (
          <p className="text-lg text-yellow-600">🤝 Hòa!</p>
        ) : (
          <p className="text-lg text-green-600">
            🏆 Người thắng: {gameResults.winner.username}
          </p>
        )}

        <div className="mt-4">
          <h4 className="font-semibold">Điểm số cuối:</h4>
          {Object.entries(gameResults.finalScores).map(([userId, score]) => (
            <div key={userId} className="flex justify-between">
              <span>User {userId}:</span>
              <span className="font-bold">{score} điểm</span>
            </div>
          ))}
        </div>

        <div className="mt-2 text-sm text-gray-600">
          Tổng câu hỏi: {gameResults.totalQuestions}
        </div>
      </div>
    );

  const renderControls = () => (
    <div className="flex gap-2 flex-wrap">
      {gameState === "waiting" && (
        <button
          onClick={handleJoinQueue}
          disabled={!connected}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          🎯 Tìm trận đấu
        </button>
      )}

      {gameState === "inQueue" && (
        <button
          onClick={handleLeaveQueue}
          disabled={!connected}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          🚪 Rời hàng đợi
        </button>
      )}

      {gameState === "ended" && (
        <button
          onClick={handlePlayAgain}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          🔄 Chơi lại
        </button>
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚔️ Battle Game</h1>

      {renderConnectionStatus()}

      <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
        Message: {message}
      </div>

      {renderQueueStatus()}
      {renderGameFound()}
      {renderCurrentQuestion()}
      {renderQuestionResults()}
      {renderGameResults()}
      {renderControls()}

      {/* Debug info */}
      <details className="mt-8 text-xs">
        <summary className="cursor-pointer text-gray-500">Debug Info</summary>
        <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-auto">
          {JSON.stringify(
            {
              gameState,
              connected,
              questionNumber,
              totalQuestions,
              hasGameData: !!gameData,
              hasCurrentQuestion: !!currentQuestion,
              selectedAnswer,
              scores,
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
};

export default BattleTest;
