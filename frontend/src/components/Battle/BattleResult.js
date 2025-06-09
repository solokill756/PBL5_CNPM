import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoTrophy, 
  IoHome, 
  IoRefresh, 
  IoStar,
  IoFlash,
  IoTime,
  IoGift,
  IoChevronForward,
  IoClose
} from "react-icons/io5";
import DefaultAvatar from "@/assets/images/avatar.jpg";
import { useAuthStore } from "@/store/useAuthStore";
import { GrAchievement } from "react-icons/gr";

const BattleResult = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [gameResults, setGameResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Đọc kết quả từ localStorage
    const resultData = localStorage.getItem(`battle_result_${roomId}`);
    
    if (resultData) {
      try {
        const result = JSON.parse(resultData);
        // Kiểm tra timestamp để tránh dữ liệu cũ (>1 giờ)
        const now = Date.now();
        const resultAge = now - result.timestamp;
        const maxAge = 60 * 60 * 1000; // 1 giờ
        
        if (resultAge > maxAge) {
          localStorage.removeItem(`battle_result_${roomId}`);
          navigate("/battle");
          return;
        }
        
        setGameResults(result);
        
        // Show celebration animation sau 0.5s
        setTimeout(() => setShowCelebration(true), 500);
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
    localStorage.removeItem(`battle_result_${roomId}`);
    navigate("/battle");
  };

  const handleGoHome = () => {
    localStorage.removeItem(`battle_result_${roomId}`);
    navigate("/");
  };

  const getPlayersData = () => {
    if (!gameResults) return { player: null, opponent: null };
  
    const currentUserId = user?.id?.toString();
    let player, opponent;
    
    // Backend gửi player và opponent, cần xác định đúng ai là current user
    if (gameResults.player && gameResults.opponent) {
      console.log('🔍 Player data from BE:', gameResults.player);
      console.log('🔍 Opponent data from BE:', gameResults.opponent);
      console.log('🔍 Current user ID:', currentUserId);
      
      // Kiểm tra ai là current user dựa vào user_id
      const isCurrentUserThePlayer = gameResults.player.user_id?.toString() === currentUserId;
      
      if (isCurrentUserThePlayer) {
        player = {
          name: gameResults.player.username,
          profile_picture: gameResults.player.profile_picture || DefaultAvatar,
          score: gameResults.player.score || 0, // Điểm từ BE
          user_id: gameResults.player.user_id,
        };
        opponent = {
          name: gameResults.opponent.username,
          profile_picture: gameResults.opponent.profile_picture || DefaultAvatar,
          score: gameResults.opponent.score || 0, // Điểm từ BE
          user_id: gameResults.opponent.user_id,
        };
      } else {
        // Current user là opponent trong BE structure
        player = {
          name: gameResults.opponent.username,
          profile_picture: gameResults.opponent.profile_picture || DefaultAvatar,
          score: gameResults.opponent.score || 0, // Điểm từ BE
          user_id: gameResults.opponent.user_id,
        };
        opponent = {
          name: gameResults.player.username,
          profile_picture: gameResults.player.profile_picture || DefaultAvatar,
          score: gameResults.player.score || 0, // Điểm từ BE
          user_id: gameResults.player.user_id,
        };
      }
    } else {
      // Fallback: sử dụng finalScores nếu không có player/opponent detail
      console.log('⚠️ No player/opponent data, using finalScores fallback');
      const opponentId = Object.keys(gameResults.finalScores || {}).find(id => id !== currentUserId);
      
      player = {
        name: user?.username || "Bạn",
        profile_picture: user?.profile_picture || DefaultAvatar,
        score: gameResults.finalScores?.[currentUserId] || 0,
        user_id: currentUserId,
      };
      
      opponent = {
        name: "Đối thủ",
        profile_picture: DefaultAvatar,
        score: gameResults.finalScores?.[opponentId] || 0,
        user_id: opponentId,
      };
    }
    
    console.log('✅ Final player data:', player);
    console.log('✅ Final opponent data:', opponent);
    
    return { player, opponent };
  };

  const getResultInfo = () => {
    if (!gameResults) return {};
    
    const { player, opponent } = getPlayersData();
    if (!player || !opponent) return {};
    
    const currentUserId = user?.id;
    
    // Xác định kết quả theo thứ tự ưu tiên
    let playerWon = false;
    let isDraw = false;
    let isDisconnectWin = false;
    
    console.log('🔍 Result analysis:');
    console.log('- Reason:', gameResults.reason);
    console.log('- Winner from BE:', gameResults.winner);
    console.log('- isDraw from BE:', gameResults.isDraw);
    console.log('- Player score:', player.score);
    console.log('- Opponent score:', opponent.score);
    
    // 1. Kiểm tra disconnect trước
    if (gameResults.reason === "opponent_disconnected") {
      isDisconnectWin = true;
      // Trong disconnect, kiểm tra winner hoặc so sánh điểm
      if (gameResults.winner) {
        playerWon = gameResults.winner === currentUserId;
      } else {
        playerWon = true; // Mặc định thắng khi opponent disconnect
      }
    } 
    // 2. Kiểm tra draw từ BE
    else if (gameResults.isDraw === true) {
      isDraw = true;
    } 
    // 3. Kiểm tra winner từ BE
    else if (gameResults.winner) {
      playerWon = gameResults.winner === currentUserId;
    } 
    // 4. Fallback: so sánh điểm
    // else {
    //   if (player.score > opponent.score) {
    //     playerWon = true;
    //   } else if (player.score === opponent.score) {
    //     isDraw = true;
    //   } else {
    //     playerWon = false;
    //   }
    // }
    
    console.log('✅ Result:', { playerWon, isDraw, isDisconnectWin });
    
    return { playerWon, isDraw, isDisconnectWin, player, opponent };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-slate-200 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-medium">Đang tải kết quả...</p>
        </motion.div>
      </div>
    );
  }

  if (!gameResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl mb-4"
            >
              😔
            </motion.div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Không tìm thấy kết quả</h2>
            <p className="text-slate-600 mb-6 text-sm">Kết quả trận đấu không tồn tại hoặc đã hết hạn.</p>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/battle")}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
            >
              Quay lại lobby
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const { playerWon, isDraw, isDisconnectWin, player, opponent } = getResultInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: showCelebration ? [0, 10, -10, 10, 0] : 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-sm"
            >
              <GrAchievement className="text-2xl text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Kết quả trận đấu</h1>
              <p className="text-slate-500 text-sm">Battle từ vựng</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
            className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-xl transition-all"
            title="Đóng"
          >
            <IoClose className="text-xl" />
          </motion.button>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-6 border border-white/20"
        >
          {/* Result Header */}
          <div className={`text-center py-6 px-6 relative overflow-hidden ${
            playerWon 
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
              : isDraw 
                ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                : 'bg-gradient-to-r from-slate-400 to-gray-500'
          }`}>
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute bottom-2 right-4 w-12 h-12 bg-white rounded-full"></div>
            </div>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              className="text-5xl mb-3 relative z-10"
            >
              {playerWon ? '🏆' : isDraw ? '🤝' : '💪'}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-white mb-1 relative z-10"
            >
              {playerWon 
                ? (isDisconnectWin ? 'Thắng do đối thủ rời!' : 'Chúc mừng chiến thắng!') 
                : isDraw 
                  ? 'Trận đấu hòa!' 
                  : 'Cố gắng lần sau!'}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/90 text-sm relative z-10 max-w-md mx-auto"
            >
              {playerWon 
                ? (isDisconnectWin 
                    ? 'Đối thủ đã rời khỏi trận đấu' 
                    : 'Bạn đã vượt trội trong trận đấu này!')
                : isDraw 
                  ? 'Cả hai có trình độ ngang nhau' 
                  : 'Đừng bỏ cuộc, tiếp tục cải thiện!'}
            </motion.p>
          </div>

          {/* Score Comparison */}
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-5 mb-5"
            >
              <div className="flex items-center justify-between">
                {/* Player */}
                <motion.div 
                  className="flex flex-col items-center flex-1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="relative">
                    <motion.img 
                      src={player?.profile_picture || DefaultAvatar} 
                      alt={player?.name} 
                      className="w-16 h-16 rounded-full border-3 border-blue-300 shadow-md object-cover" 
                      whileHover={{ scale: 1.05 }}
                    />
                    {playerWon && (
                      <motion.div 
                        className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                      >
                        <IoTrophy className="text-white w-3 h-3" />
                      </motion.div>
                    )}
                  </div>
                  <p className="font-semibold text-slate-800 mt-2 text-sm truncate max-w-20">{player?.name}</p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="text-center mt-1"
                  >
                    <p className="text-2xl font-bold text-blue-600">{player?.score}</p>
                    <p className="text-xs text-slate-500">điểm</p>
                  </motion.div>
                </motion.div>
                
                {/* VS Divider */}
                <motion.div 
                  className="flex flex-col items-center mx-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200">
                    <span className="text-sm font-bold text-slate-600">VS</span>
                  </div>
                </motion.div>
                
                {/* Opponent */}
                <motion.div 
                  className="flex flex-col items-center flex-1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="relative">
                    <motion.img 
                      src={opponent?.profile_picture || DefaultAvatar} 
                      alt={opponent?.name} 
                      className="w-16 h-16 rounded-full border-3 border-indigo-300 shadow-md object-cover" 
                      whileHover={{ scale: 1.05 }}
                    />
                    {!playerWon && !isDraw && (
                      <motion.div 
                        className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                      >
                        <IoTrophy className="text-white w-3 h-3" />
                      </motion.div>
                    )}
                  </div>
                  <p className="font-semibold text-slate-800 mt-2 text-sm truncate max-w-20">{opponent?.name}</p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="text-center mt-1"
                  >
                    <p className="text-2xl font-bold text-indigo-600">{opponent?.score}</p>
                    <p className="text-xs text-slate-500">điểm</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Game Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-3"
            >
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 text-center border border-blue-200/50"
                whileHover={{ scale: 1.02, y: -1 }}
              >
                <IoFlash className="text-blue-500 w-5 h-5 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-600">{gameResults.totalQuestions}</p>
                <p className="text-xs text-blue-700">Câu hỏi</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-3 text-center border border-emerald-200/50"
                whileHover={{ scale: 1.02, y: -1 }}
              >
                <IoTime className="text-emerald-500 w-5 h-5 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-600">
                  {new Date(gameResults.timestamp).toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="text-xs text-emerald-700">Hoàn thành</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 text-center border border-purple-200/50"
                whileHover={{ scale: 1.02, y: -1 }}
              >
                <IoStar className="text-purple-500 w-5 h-5 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-600">
                  {Math.abs((player?.score || 0) - (opponent?.score || 0))}
                </p>
                <p className="text-xs text-purple-700">Chênh lệch</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Status Info - chỉ hiển thị nếu là disconnect win */}
        {isDisconnectWin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg">
                <IoGift className="text-white w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-amber-800 text-sm">Thông tin đặc biệt</p>
                <p className="text-amber-700 text-xs">Đối thủ đã rời khỏi trận đấu, bạn nhận chiến thắng mặc định</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlayAgain}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <IoRefresh className="w-4 h-4" />
            Chơi lại
            <IoChevronForward className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoHome}
            className="flex-1 py-3 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border border-slate-200/50 flex items-center justify-center gap-2 text-sm"
          >
            <IoHome className="w-4 h-4" />
            Về trang chủ
          </motion.button>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6 text-slate-400 text-xs"
        >
          💡 Mẹo: Trả lời nhanh để nhận thêm điểm bonus!
        </motion.div>
      </div>
    </div>
  );
};

export default BattleResult;