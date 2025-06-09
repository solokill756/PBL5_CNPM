import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import gameService from "../services/gameService";
import { NextFunction } from "express";
import { UserPayload } from "../services/authService";
dotenv.config();
export default (io: any, gameRooms: any, wattingPlayers: any) => {
  // Middleware xác thực
  io.use((socket: any, next: NextFunction) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as UserPayload;
        socket.user_id = decoded.user_id;
        socket.username = decoded.username;
        console.log(`✅ User ${socket.username} authenticated`);
        next();
      } catch (err) {
        console.log("❌ Authentication failed:", err.message);
        next(new Error("Authentication error"));
      }
    } else {
      next(new Error("No token provided"));
    }
  });
  // Xử lý kết nối mới
  io.on("connection", (socket: any) => {
    console.log(`🔌 User ${socket.username} connected (ID: ${socket.id})`);
    // Tham gia hàng đợi tìm trận
    socket.on("join_queue", async (data: any) => {
      console.log(
        `🎯 ${socket.username} joined queue for topic: ${data.topic}`
      );

      const player = {
        id: socket.id,
        user_id: socket.user_id,
        username: socket.username,
        topic: data.topic || "general",
      };
      // Tìm đối thủ cùng topic
      // const opponentIndex = waitingPlayers.findIndex(
      //   (p) => p.topic === player.topic
      // );
      const opponentIndex =
        Math.random() * wattingPlayers.length < 0.5 ? -1 : 0; // Giả lập tìm đối thủ

      if (opponentIndex !== -1) {
        const opponent = wattingPlayers[opponentIndex];
        wattingPlayers.splice(opponentIndex, 1); // Xóa đối thủ khỏi hàng đợi

        // Tạo phòng đấu
        const roomId = `room_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        try {
          // Lấy câu hỏi từ database
          const questions = await gameService.getRandomQuestion();

          if (questions.length === 0) {
            socket.emit("error", {
              message: "Không tìm thấy câu hỏi cho chủ đề này",
            });
            return;
          }

          const gameRoom = {
            id: roomId,
            players: [opponent, player],
            questions: questions,
            currentQuestion: 0,
            scores: {
              [opponent.user_id]: 0,
              [player.user_id]: 0,
            },
            status: "waiting",
            topic: player.topic,
            answers: {},
            questionStartTime: null,
          };

          gameRooms.set(roomId, gameRoom);

          // Join socket rooms
          const opponentSocket = io.sockets.sockets.get(opponent.id);
          if (opponentSocket) {
            opponentSocket.join(roomId);
          }
          socket.join(roomId);

          console.log(`🎮 Game room created: ${roomId}`);
          console.log(`👥 Players: ${opponent.username} vs ${player.username}`);

          // Thông báo cho cả 2 người chơi
          io.to(roomId).emit("game_found", {
            roomId,
            opponent: {
              username: opponent.username,
              user_id: opponent.user_id,
            },
            player: {
              username: player.username,
              user_id: player.user_id,
            },
            totalQuestions: questions.length,
            topic: player.topic,
          });
        } catch (error) {
          console.error("❌ Error creating game room:", error);
          socket.emit("error", { message: "Lỗi khi tạo phòng đấu" });
        }
      } else {
        // Không tìm thấy đối thủ, thêm vào hàng đợi
        wattingPlayers.push(player);
        socket.emit("queue_joined", {
          position: wattingPlayers.length,
          topic: player.topic,
        });
        console.log(
          `⏳ ${socket.username} waiting in queue. Position: ${wattingPlayers.length}`
        );
      }
    });
    // Sẵn sàng bắt đầu game
    socket.on("ready_to_start", (data: any) => {
      const gameRoom = gameRooms.get(data.roomId);
      if (!gameRoom) {
        socket.emit("error", { message: "Không tìm thấy phòng đấu" });
        return;
      }

      console.log(`🚀 Starting game in room ${data.roomId}`);

      gameRoom.status = "playing";
      gameRoom.questionStartTime = Date.now();

      // Gửi câu hỏi đầu tiên
      io.to(data.roomId).emit("game_started", {
        question: gameRoom.questions[0],
        questionNumber: 1,
        totalQuestions: gameRoom.questions.length,
      });

      // Đặt timer cho câu hỏi (10 giây)
      setTimeout(() => {
        handleQuestionTimeout(data.roomId);
      }, 10000);
    });
    socket.on("submit_answer", (data: any) => {
      const gameRoom = gameRooms.get(data.roomId);
      if (!gameRoom || gameRoom.status !== "playing") return;

      const currentQ = gameRoom.questions[gameRoom.currentQuestion];
      const isCorrect = data.answer === currentQ.correct_answer;
      const responseTime = Date.now() - gameRoom.questionStartTime;
      console.log(
        `💡 ${socket.username} answered ${data.answer} (${
          isCorrect ? "correct" : "wrong"
        }) in ${responseTime}ms`
      );

      // Tính điểm
      let points = 0;
      if (isCorrect) {
        points = 20; // Điểm cơ bản
        if (responseTime < 5000) points += 5; // Bonus trả lời nhanh
      }

      gameRoom.scores[socket.user_id] += points;
      gameRoom.answers[socket.user_id] = {
        answer: data.answer,
        isCorrect,
        points,
        responseTime,
      };

      // Kiểm tra xem cả 2 đã trả lời chưa
      const answeredCount = Object.keys(gameRoom.answers).length;
      console.log(`📊 Answered: ${answeredCount}/2 players`);

      if (answeredCount === 2) {
        handleQuestionComplete(data.roomId);
      }
    });
  });
};
