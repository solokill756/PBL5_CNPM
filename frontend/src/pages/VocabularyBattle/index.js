// Chỉ giữ lại phần lobby, xóa phần playing state
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import {
  IoGameController,
  IoRocket,
  IoTime,
  IoTrophy,
} from "react-icons/io5";

const VocabularyBattle = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();

  // Socket state
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  // Game states
  const [gameState, setGameState] = useState("waiting"); // waiting, inQueue
  const [queuePosition, setQueuePosition] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setConnectionError("Vui lòng đăng nhập để chơi battle!");
      return;
    }

    const newSocket = io("https://backendserver-app.azurewebsites.net", {
      auth: { token: accessToken },
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to battle server");
      setConnected(true);
      setConnectionError("");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setConnected(false);
      setGameState("waiting");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setConnectionError("Lỗi kết nối: " + error.message);
    });

    newSocket.on("queue_joined", (data) => {
      console.log("🎯 Queue joined:", data);
      setGameState("inQueue");
      setQueuePosition(data.position);
      setLoading(false);
    });

    newSocket.on("game_found", (data) => {
      console.log("🎮 Game found:", data);
      localStorage.setItem(`battle_game_${data.roomId}`, JSON.stringify(data));
      // Chuyển đến phòng đấu
      navigate(`/battle/${data.roomId}`);
    });

    newSocket.on("error", (error) => {
      console.error("❌ Game error:", error);
      setConnectionError("Lỗi game: " + error.message);
      setLoading(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [accessToken, navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <IoGameController className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Battle Arena</h1>
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{connectionError}</p>
          </div>
        )}

        {/* Game States */}
        <AnimatePresence mode="wait">
          {gameState === "waiting" && <WaitingState key="waiting" />}
          {gameState === "inQueue" && <QueueState key="queue" />}
        </AnimatePresence>

        {/* Info Section - Same as before */}
        <div className="mt-16 w-[95%] flex justify-center bg-indigo-900 text-white rounded-xl shadow-lg overflow-hidden">
          {/* ... existing info section ... */}
        </div>
      </div>
    </div>
  );
};

export default VocabularyBattle;