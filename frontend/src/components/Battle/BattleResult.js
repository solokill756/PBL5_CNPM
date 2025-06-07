import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoTrophy, IoClose, IoHome } from "react-icons/io5";
import FinalResult from "./FinalResult";
import DefaultAvatar from "@/assets/images/avatar.jpg";
import { useAuthStore } from "@/store/useAuthStore";

const BattleResult = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [gameResults, setGameResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Đọc kết quả từ localStorage
    const resultData = localStorage.getItem(`battle_result_${roomId}`);
    
    if (resultData) {
      try {
        const result = JSON.parse(resultData);
        
        // Kiểm tra timestamp để tránh dữ liệu cũ (>30 phút)
        const now = Date.now();
        const resultAge = now - result.timestamp;
        const maxAge = 30 * 60 * 1000; // 30 phút
        
        if (resultAge > maxAge) {
          localStorage.removeItem(`battle_result_${roomId}`);
          navigate("/battle");
          return;
        }
        
        setGameResults(result);
      } catch (error) {
        console.error("Error parsing battle result:", error);
        navigate("/battle");
      }
    } else {
      navigate("/battle");
    }
    
    setLoading(false);
  }, [roomId, navigate]);

  const handlePlayAgain = () => {
    // Xóa kết quả cũ
    localStorage.removeItem(`battle_result_${roomId}`);
    navigate("/battle");
  };

  const handleGoHome = () => {
    // Xóa kết quả cũ
    localStorage.removeItem(`battle_result_${roomId}`);
    navigate("/");
  };

  const getPlayersData = () => {
    if (!gameResults) return { player: null, opponent: null };

    const player = {
      name: user?.username || "Bạn",
      avatar: user?.profile_picture || DefaultAvatar,
      score: gameResults.finalScores[user?.id] || 0,
      user_id: user?.id,
    };

    // Tìm opponent từ gameResults
    const opponentId = Object.keys(gameResults.finalScores).find(id => id !== user?.id?.toString());
    const opponent = {
      name: gameResults.opponent?.username || "Đối thủ",
      avatar: gameResults.opponent?.profile_picture || DefaultAvatar,
      score: gameResults.finalScores[opponentId] || 0,
      user_id: opponentId,
    };
    
    return { player, opponent };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!gameResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 mb-6">Kết quả trận đấu không tồn tại hoặc đã hết hạn.</p>
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
  }

  const { player, opponent } = getPlayersData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <IoTrophy className="text-3xl text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Kết quả trận đấu</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleGoHome}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Về trang chủ"
            >
              <IoHome className="text-xl" />
            </button>
            <button
              onClick={handlePlayAgain}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Chơi lại"
            >
              <IoClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Result Display */}
        {player && opponent && (
          <FinalResult
            player={player}
            opponent={opponent}
            gameResults={gameResults}
            onRetry={handlePlayAgain}
            onExit={handleGoHome}
          />
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin trận đấu</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{roomId}</p>
              <p className="text-sm text-gray-600">Room ID</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{gameResults.totalQuestions}</p>
              <p className="text-sm text-gray-600">Tổng câu hỏi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {new Date(gameResults.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-600">Thời gian kết thúc</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {gameResults.reason === "opponent_disconnected" ? "Đối thủ rời" : "Hoàn thành"}
              </p>
              <p className="text-sm text-gray-600">Trạng thái</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BattleResult;