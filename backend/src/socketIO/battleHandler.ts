import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import gameService from "../services/User/gameService";
import { NextFunction } from "express";
import { UserPayload } from "../services/User/authService";
import db from "../models";

dotenv.config();

export default (io: any, gameRooms: any, wattingPlayers: any[]) => {
  // Middleware xác thực
  io.use(async (socket: any, next: NextFunction) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as UserPayload;
        socket.user_id = decoded.user_id;
        socket.username = decoded.username;

        // Cache profile picture during authentication
        try {
          const user = await db.user.findOne({
            where: { user_id: decoded.user_id },
            attributes: ["profile_picture"],
          });
          socket.profile_picture = user?.profile_picture || null;
        } catch (dbError) {
          console.warn(
            `⚠️ Could not fetch profile picture for ${socket.username}:`,
            dbError
          );
          socket.profile_picture = null;
        }

        console.log(`✅ User ${socket.username} authenticated`);
        next();
      } catch (err) {
        console.log("❌ Authentication failed:", (err as Error).message);
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
    socket.on("join_queue", async (_data: any) => {
      // Kiểm tra user đã ở trong hàng đợi chưa
      const alreadyInQueue = wattingPlayers.some(
        (p: any) => p.user_id === socket.user_id
      );
      if (alreadyInQueue) {
        socket.emit("queue_joined", {
          position:
            wattingPlayers.findIndex((p: any) => p.user_id === socket.user_id) +
            1,
        });
        console.log(`⏳ ${socket.username} already in queue.`);
        return;
      }

      // Kiểm tra user đã ở trong phòng chưa
      for (let [roomId, gameRoom] of gameRooms) {
        const playerInRoom = gameRoom.players.find(
          (p: any) => p.user_id === socket.user_id
        );
        if (playerInRoom) {
          console.log(`🎮 ${socket.username} already in game room ${roomId}`);
          // Cập nhật socket ID mới cho player
          playerInRoom.id = socket.id;
          socket.join(roomId);

          // Gửi lại thông tin phòng
          const opponent = gameRoom.players.find(
            (p: any) => p.user_id !== socket.user_id
          );
          socket.emit("game_found", {
            roomId,
            player: {
              username: playerInRoom.username,
              user_id: playerInRoom.user_id,
              profile_picture: playerInRoom.profile_picture,
            },
            opponent: opponent
              ? {
                  username: opponent.username,
                  user_id: opponent.user_id,
                  profile_picture: opponent.profile_picture,
                }
              : null,
            totalQuestions: gameRoom.questions.length,
          });
          return;
        }
      }

      const player = {
        id: socket.id,
        user_id: socket.user_id,
        username: socket.username,
        profile_picture: socket.profile_picture,
      };

      // Tìm đối thủ ngẫu nhiên (loại trừ chính mình)
      const availableOpponents = wattingPlayers.filter(
        (p: any) => p.user_id !== socket.user_id
      );
      const opponentIndex =
        availableOpponents.length > 0
          ? Math.floor(Math.random() * availableOpponents.length)
          : -1;

      if (opponentIndex !== -1) {
        const opponent = availableOpponents[opponentIndex];
        // Xóa đối thủ khỏi hàng đợi
        const realOpponentIndex = wattingPlayers.findIndex(
          (p: any) => p.user_id === opponent.user_id
        );
        wattingPlayers.splice(realOpponentIndex, 1);

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

          // Thông báo cho player (người vừa join)
          socket.emit("game_found", {
            roomId,
            player: {
              username: player.username,
              user_id: player.user_id,
              profile_picture: player.profile_picture,
            },
            opponent: {
              username: opponent.username,
              user_id: opponent.user_id,
              profile_picture: opponent.profile_picture,
            },
            totalQuestions: questions.length,
          });

          // Thông báo cho opponent
          if (opponentSocket) {
            opponentSocket.emit("game_found", {
              roomId,
              player: {
                username: opponent.username,
                user_id: opponent.user_id,
                profile_picture: opponent.profile_picture,
              },
              opponent: {
                username: player.username,
                user_id: player.user_id,
                profile_picture: player.profile_picture,
              },
              totalQuestions: questions.length,
            });
          }
        } catch (error) {
          console.error("❌ Error creating game room:", error);
          socket.emit("error", { message: "Lỗi khi tạo phòng đấu" });
        }
      } else {
        // Không tìm thấy đối thủ, thêm vào hàng đợi
        wattingPlayers.push(player);
        socket.emit("queue_joined", {
          position: wattingPlayers.length,
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

      // Kiểm tra player có trong phòng không
      const playerInRoom = gameRoom.players.find(
        (p: any) => p.user_id === socket.user_id
      );
      if (!playerInRoom) {
        socket.emit("error", { message: "Bạn không ở trong phòng này" });
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
    });

    socket.on("submit_answer", (data: any) => {
      const gameRoom = gameRooms.get(data.roomId);
      if (!gameRoom || gameRoom.status !== "playing") return;

      // Kiểm tra player có trong phòng không
      const playerInRoom = gameRoom.players.find(
        (p: any) => p.user_id === socket.user_id
      );
      if (!playerInRoom) return;

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
        points = 50; // Điểm cơ bản
        if (responseTime < 5000) points += 30;
      }

      gameRoom.scores[socket.user_id] += points;
      gameRoom.answers[socket.user_id] = {
        username: socket.username,
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

    // Rời khỏi hàng đợi
    socket.on("leave_queue", () => {
      const playerIndex = wattingPlayers.findIndex(
        (p: any) => p.user_id === socket.user_id
      );
      if (playerIndex !== -1) {
        wattingPlayers.splice(playerIndex, 1);
        console.log(`🚪 ${socket.username} left queue`);
      }
    });

    // Xử lý disconnect
    socket.on("disconnect", () => {
      console.log(`🔌 ${socket.username} disconnected`);

      // Xóa khỏi hàng đợi
      const playerIndex = wattingPlayers.findIndex(
        (p: any) => p.user_id === socket.user_id
      );
      if (playerIndex !== -1) {
        wattingPlayers.splice(playerIndex, 1);
      }

      // Xử lý disconnect trong game
      handlePlayerDisconnect(socket);
    });

    const handleQuestionComplete = (roomId: string) => {
      const gameRoom = gameRooms.get(roomId);
      if (!gameRoom) return;

      const currentQ = gameRoom.questions[gameRoom.currentQuestion];

      console.log(
        `📋 Question ${
          gameRoom.currentQuestion + 1
        } completed in room ${roomId}`
      );

      // Gửi kết quả câu hỏi
      io.to(roomId).emit("question_result", {
        question: currentQ,
        answers: gameRoom.answers,
        scores: gameRoom.scores,
        correctAnswer: currentQ.correct_answer,
      });

      // Reset cho câu tiếp theo
      gameRoom.answers = {};
      gameRoom.currentQuestion++;

      // Kiểm tra xem còn câu hỏi không
      if (gameRoom.currentQuestion < gameRoom.questions.length) {
        // Tiếp tục câu tiếp theo sau 3 giây
        setTimeout(() => {
          gameRoom.questionStartTime = Date.now();
          io.to(roomId).emit("next_question", {
            question: gameRoom.questions[gameRoom.currentQuestion],
            questionNumber: gameRoom.currentQuestion + 1,
          });
        }, 3000);
      } else {
        // Kết thúc game
        endGame(roomId);
      }
    };

    const endGame = async (roomId: string) => {
      const gameRoom = gameRooms.get(roomId);
      if (!gameRoom) return;

      const players = gameRoom.players;
      const finalScores = gameRoom.scores;

      // Xác định người thắng (trả về user_id)
      const [player1, player2] = players;
      const score1 = finalScores[player1.user_id];
      const score2 = finalScores[player2.user_id];

      let winner: string | null = null;
      if (score1 > score2) {
        winner = player1.user_id;
      } else if (score2 > score1) {
        winner = player2.user_id;
      }
      // Nếu hòa thì winner = null

      console.log(`🏁 Game ended in room ${roomId}`);
      console.log(
        `📊 Final scores: ${player1.username}: ${score1}, ${player2.username}: ${score2}`
      );
      console.log(
        `🏆 Winner: ${
          winner
            ? winner === player1.user_id
              ? player1.username
              : player2.username
            : "Draw"
        }`
      );

      // Cập nhật điểm vào database
      try {
        for (const player of players) {
          const isWinner = winner && winner === player.user_id;
          const points = finalScores[player.user_id];
          await gameService.updatePlayScore(
            player.user_id,
            points,
            isWinner as boolean
          );
        }
      } catch (error) {
        console.error("❌ Error updating scores:", error);
      }

      // Gửi kết quả cuối game cho từng player
      for (const player of gameRoom.players) {
        const opponent = gameRoom.players.find(
          (p: any) => p.user_id !== player.user_id
        );
        io.to(player.id).emit("game_ended", {
          winner,
          finalScores,
          totalQuestions: gameRoom.questions.length,
          isDraw: !winner,
          player: {
            user_id: player.user_id,
            username: player.username,
            profile_picture: player.profile_picture,
            score: finalScores[player.user_id] ?? 0,
          },
          opponent: opponent
            ? {
                user_id: opponent.user_id,
                username: opponent.username,
                profile_picture: opponent.profile_picture,
                score: finalScores[opponent.user_id] ?? 0,
              }
            : null,
        });
      }

      // Cleanup
      setTimeout(() => {
        gameRooms.delete(roomId);
        console.log(`🧹 Cleaned up room ${roomId}`);
      }, 30000); // Xóa phòng sau 30 giây
    };

    function handlePlayerDisconnect(socket: any) {
      // Tìm game room của player
      for (let [roomId, gameRoom] of gameRooms) {
        const playerInRoom = gameRoom.players.find(
          (p: any) => p.user_id === socket.user_id
        );
        if (playerInRoom) {
          console.log(
            `🚪 ${socket.username} disconnected from active game ${roomId}`
          );

          const remainingPlayer = gameRoom.players.find(
            (p: any) => p.user_id !== socket.user_id
          );
          const disconnectedPlayer = gameRoom.players.find(
            (p: any) => p.user_id === socket.user_id
          );

          // Chuẩn hóa finalScores giống endGame
          const finalScores: Record<string, number> = {};
          if (remainingPlayer) {
            finalScores[remainingPlayer.user_id] =
              gameRoom.scores[remainingPlayer.user_id] ?? 0;
          }
          if (disconnectedPlayer) {
            finalScores[disconnectedPlayer.user_id] = 0;
          }

          // Winner phải là user_id, không phải object
          const winner: string | null = remainingPlayer
            ? remainingPlayer.user_id
            : null;

          socket.to(roomId).emit("opponent_disconnected", {
            winner,
            finalScores,
            totalQuestions: gameRoom.questions?.length ?? 0,
            isDraw: false,
            player: remainingPlayer
              ? {
                  user_id: remainingPlayer.user_id,
                  username: remainingPlayer.username,
                  profile_picture: remainingPlayer.profile_picture,
                  score: finalScores[remainingPlayer.user_id] ?? 0,
                }
              : null,
            opponent: disconnectedPlayer
              ? {
                  user_id: disconnectedPlayer.user_id,
                  username: disconnectedPlayer.username,
                  profile_picture: disconnectedPlayer.profile_picture,
                  score: 0,
                }
              : null,
          });

          // Trao chiến thắng cho đối thủ
          if (remainingPlayer && gameRoom.status === "playing") {
            gameService
              .updatePlayScore(
                remainingPlayer.user_id,
                gameRoom.scores[remainingPlayer.user_id] ?? 0,
                true
              )
              .catch(console.error);
          }
          gameRooms.delete(roomId);
          break;
        }
      }
    }
  });
};
