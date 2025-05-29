import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoTimeOutline,
  IoFlashOutline,
  IoPersonOutline,
  IoRocketOutline,
} from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import ScoreDisplay from "@/components/Battle/ScoreDisplay";
import OpponentStatus from "@/components/Battle/OpponentStatus";
import CountdownTimer from "@/components/Battle/CountdownTimer";
import VocabularyQuestion from "@/components/Battle/VocabularyQuestion";
import ResultNotification from "@/components/Battle/ResultNotification";
import FinalResult from "@/components/Battle/FinalResult";

// Mock data
const mockWebSocket = {
  onmessage: null,
  send: (data) => {
    console.log("WebSocket sent:", data);
    // Giả lập phản hồi từ server
    setTimeout(() => {
      if (mockWebSocket.onmessage) {
        // Mô phỏng đối thủ trả lời đúng sau 3-7 giây
        const delay = Math.floor(Math.random() * 4000) + 3000;
        setTimeout(() => {
          const event = {
            data: JSON.stringify({
              type: "opponent_answer",
              correct: Math.random() > 0.3, // 70% khả năng đối thủ trả lời đúng
              time: delay / 1000,
            }),
          };
          mockWebSocket.onmessage(event);
        }, delay);
      }
    }, 100);
  },
};

// Dữ liệu mẫu cho bộ câu hỏi
const mockQuestions = [
  {
    id: 1,
    term: "データベース",
    pronunciation: "でーたべーす",
    definition: "Cơ sở dữ liệu",
    options: ["Cơ sở dữ liệu", "Máy chủ", "Mạng máy tính", "Phần mềm"],
    correctAnswer: "Cơ sở dữ liệu",
  },
  {
    id: 2,
    term: "ネットワーク",
    pronunciation: "ねっとわーく",
    definition: "Mạng",
    options: ["Internet", "Mạng", "Website", "Ứng dụng"],
    correctAnswer: "Mạng",
  },
  {
    id: 3,
    term: "サーバー",
    pronunciation: "さーばー",
    definition: "Máy chủ",
    options: ["Trình duyệt", "Máy tính", "Máy chủ", "Phần cứng"],
    correctAnswer: "Máy chủ",
  },
  {
    id: 4,
    term: "プログラミング",
    pronunciation: "ぷろぐらみんぐ",
    definition: "Lập trình",
    options: ["Thiết kế", "Lập trình", "Kiểm thử", "Phân tích"],
    correctAnswer: "Lập trình",
  },
  {
    id: 5,
    term: "アルゴリズム",
    pronunciation: "あるごりずむ",
    definition: "Thuật toán",
    options: ["Mã nguồn", "Biến", "Thuật toán", "Hàm"],
    correctAnswer: "Thuật toán",
  },
];

// Dữ liệu giả cho người chơi và đối thủ
const mockPlayers = {
  player: {
    id: "p1",
    name: "Người chơi",
    avatar: "https://i.pravatar.cc/150?img=11",
    score: 0,
  },
  opponent: {
    id: "p2",
    name: "Đối thủ",
    avatar: "https://i.pravatar.cc/150?img=12",
    score: 0,
  },
};

// Component chính của trò chơi
const VocabularyBattle = () => {
  const navigate = useNavigate();

  // State cho game
  const [gameState, setGameState] = useState("waiting"); // 'waiting', 'ready', 'playing', 'finished'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [player, setPlayer] = useState(mockPlayers.player);
  const [opponent, setOpponent] = useState(mockPlayers.opponent);
  const [playerAnswer, setPlayerAnswer] = useState(null);
  const [opponentAnswer, setOpponentAnswer] = useState(null);
  const [playerAnswerTime, setPlayerAnswerTime] = useState(null);
  const [opponentAnswerTime, setOpponentAnswerTime] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const websocketRef = useRef(null);
  const timerRef = useRef(null);

  // Khởi tạo WebSocket và bắt đầu trò chơi
  useEffect(() => {
    // Trong thực tế, kết nối WebSocket tới server
    // websocketRef.current = new WebSocket('ws://your-server-url/battle');
    websocketRef.current = mockWebSocket;

    // Xử lý tin nhắn từ WebSocket
    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "opponent_joined":
          // Xử lý khi đối thủ tham gia
          setGameState("ready");
          break;
        case "game_start":
          // Bắt đầu trò chơi với câu hỏi nhận được
          setGameState("playing");
          break;
        case "opponent_answer":
          // Xử lý khi nhận được câu trả lời của đối thủ
          setOpponentAnswer(data.correct);
          setOpponentAnswerTime(data.time);
          break;
        default:
          break;
      }
    };

    // Làm giả dữ liệu - trong thực tế sẽ nhận từ server
    setQuestions(mockQuestions);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Bắt đầu tìm kiếm đối thủ
  const handleFindOpponent = () => {
    setIsSearching(true);

    // Giả lập tìm kiếm đối thủ trong 3 giây
    setTimeout(() => {
      setIsSearching(false);
      setGameState("ready");
    }, 3000);
  };

  // Bắt đầu trò chơi
  const handleStartGame = () => {
    setGameState("playing");
    startTimer();
  };

  // Bắt đầu đếm ngược
  const startTimer = () => {
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Nếu hết thời gian mà chưa trả lời thì tính là sai
          if (playerAnswer === null) {
            setPlayerAnswer(false);
            setPlayerAnswerTime(10);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Xử lý khi người chơi chọn đáp án
  const handleAnswerSelect = (answer) => {
    if (playerAnswer !== null) return; // Đã trả lời rồi, không cho trả lời lại

    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    const answerTime = 10 - timeLeft;

    setPlayerAnswer(isCorrect);
    setPlayerAnswerTime(answerTime);

    // Tính điểm: 20 điểm nếu trả lời đúng, +5 điểm nếu trả lời trong 5 giây
    if (isCorrect) {
      const points = answerTime < 5 ? 25 : 15;
      setPlayer((prev) => ({
        ...prev,
        score: prev.score + points,
      }));
    }

    // Gửi câu trả lời tới server qua WebSocket
    websocketRef.current.send(
      JSON.stringify({
        type: "player_answer",
        correct: isCorrect,
        time: answerTime,
      })
    );

    // Dừng đồng hồ đếm ngược
    clearInterval(timerRef.current);
  };

  // Xử lý khi kết thúc hiển thị kết quả và chuyển sang câu hỏi tiếp theo
  const handleContinue = () => {
    setShowResult(false);
    setPlayerAnswer(null);
    setOpponentAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      startTimer();
    } else {
      // Kết thúc trò chơi, hiển thị kết quả cuối cùng
      setGameState("finished");
      setShowFinalResult(true);
    }
  };

  // Hiển thị kết quả sau khi cả hai người chơi đã trả lời
  useEffect(() => {
    if (playerAnswer !== null && opponentAnswer !== null) {
      // Cập nhật điểm cho đối thủ nếu trả lời đúng
      if (opponentAnswer) {
        const points = opponentAnswerTime < 5 ? 25 : 15;
        setOpponent((prev) => ({
          ...prev,
          score: prev.score + points,
        }));
      }

      // Hiển thị kết quả sau 1 giây
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    }
  }, [playerAnswer, opponentAnswer, opponentAnswerTime]);

  // Xử lý thử lại trò chơi
  const handleRetry = () => {
    setShowFinalResult(false);
    setCurrentQuestion(0);
    setPlayer({ ...mockPlayers.player, score: 0 });
    setOpponent({ ...mockPlayers.opponent, score: 0 });
    setGameState("ready");
  };

  // Xử lý thoát khỏi trò chơi
  const handleExit = () => {
    navigate("/vocabulary");
  };

  // Render giao diện khi đang tìm đối thủ
  const renderWaiting = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 5, 0] }}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
          >
            🎮
          </motion.div>

          <h2 className="text-2xl font-bold mb-4 text-indigo-800">
            Chế độ đối kháng từ vựng
          </h2>
          <p className="text-gray-600 mb-8">
            Thi đấu trực tiếp với người chơi khác để kiểm tra kỹ năng từ vựng
            của bạn!
          </p>

          <button
            onClick={handleFindOpponent}
            disabled={isSearching}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            {isSearching ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Đang tìm đối thủ...
              </>
            ) : (
              <>
                <FaUserFriends className="mr-2" />
                Tìm đối thủ
              </>
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Luật chơi:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <IoTimeOutline className="mt-0.5 mr-2 text-indigo-500" />
              <span>Mỗi câu hỏi có thời gian làm bài là 10 giây.</span>
            </li>
            <li className="flex items-start">
              <IoFlashOutline className="mt-0.5 mr-2 text-indigo-500" />
              <span>
                Trả lời đúng: +20 điểm. Trả lời đúng dưới 5 giây: +25 điểm.
              </span>
            </li>
            <li className="flex items-start">
              <IoPersonOutline className="mt-0.5 mr-2 text-indigo-500" />
              <span>
                Người chơi có nhiều điểm hơn sẽ giành chiến thắng và nhận phần
                thưởng.
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Render giao diện sẵn sàng chơi
  const renderReady = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
            }}
            className="w-20 h-20 rounded-full mx-auto mb-6 bg-indigo-100 flex items-center justify-center"
          >
            <IoRocketOutline className="text-3xl text-indigo-600" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-4 text-indigo-800">
            Sẵn sàng đấu!
          </h2>

          <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg mb-6">
            <div className="flex flex-col items-center">
              <img
                src={player.avatar}
                alt={player.name}
                className="w-14 h-14 rounded-full mb-2 border-2 border-indigo-300"
              />
              <p className="font-semibold text-sm">{player.name}</p>
            </div>

            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold">
              VS
            </div>

            <div className="flex flex-col items-center">
              <img
                src={opponent.avatar}
                alt={opponent.name}
                className="w-14 h-14 rounded-full mb-2 border-2 border-indigo-300"
              />
              <p className="font-semibold text-sm">{opponent.name}</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Bạn sẽ thi đấu với{" "}
            <span className="font-semibold">{opponent.name}</span> trong{" "}
            {questions.length} câu hỏi về từ vựng.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStartGame}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            Bắt đầu ngay!
          </motion.button>
        </div>
      </div>
    );
  };

  // Render giao diện chơi
  const renderPlaying = () => {
    return (
      <div className="w-full max-w-3xl">
        <ScoreDisplay player={player} opponent={opponent} />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Thời gian còn lại
            </span>
          </div>
          <CountdownTimer timeLeft={timeLeft} totalTime={10} />
        </div>

        {/* Câu hỏi và lựa chọn */}
        <VocabularyQuestion
          question={questions[currentQuestion]}
          playerAnswer={playerAnswer}
          onSelectAnswer={handleAnswerSelect}
          currentQuestion={currentQuestion}
          questionCount={questions.length}
          playerAnswerTime={playerAnswerTime}
        />

        {/* Hiển thị trạng thái đối thủ */}
        <OpponentStatus
          playerAnswer={playerAnswer}
          opponentAnswer={opponentAnswer}
        />
      </div>
    );
  };

  // Render giao diện dựa vào trạng thái trò chơi
  const renderGameContent = () => {
    switch (gameState) {
      case "waiting":
        return renderWaiting();
      case "ready":
        return renderReady();
      case "playing":
        return renderPlaying();
      case "finished":
        return null; // Final result modal will be shown
      default:
        return <div>Đã xảy ra lỗi</div>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-indigo-50 pt-8 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center justify-center">
            {renderGameContent()}

            {/* Kết quả sau mỗi câu hỏi */}
            <AnimatePresence>
              {showResult && (
                <ResultNotification
                  playerCorrect={playerAnswer}
                  opponentCorrect={opponentAnswer}
                  playerTime={playerAnswerTime}
                  opponentTime={opponentAnswerTime}
                  onContinue={handleContinue}
                />
              )}
            </AnimatePresence>

            {/* Kết quả cuối cùng */}
            <AnimatePresence>
              {showFinalResult && (
                <FinalResult
                  player={player}
                  opponent={opponent}
                  onRetry={handleRetry}
                  onExit={handleExit}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default VocabularyBattle;
