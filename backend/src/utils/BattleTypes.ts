// battleHandlerTypes.ts (or at the top of battleHandler.ts)
import { Socket as OriginalSocket, Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import GameService from "../services/GameService"; // Assuming GameService is typed
import { QuestionAttributes } from "../models/QuestionModel"; // Assuming QuestionModel is typed

// User ID from JWT token
export interface DecodedToken extends jwt.JwtPayload {
  userId?: number; // Numeric ID for DB operations
  id?: number; // Fallback if userId is not present
  username?: string;
}

// Extend Socket.IO's Socket interface
export interface CustomSocket extends OriginalSocket {
  userId?: number;
  username?: string;
}

// Player representation in queue and game rooms
export interface Player {
  id: string; // socket.id
  userId: number; // Numeric ID from users table
  username: string;
  topic: string;
}

// Stats for a player within a single game
export interface PlayerGameData {
  submittedAnswers: Array<{
    questionIndex: number;
    answer: string | null;
    isCorrect: boolean;
    pointsEarned: number;
    responseTimeMs: number;
  }>;
  totalCorrectAnswers: number;
  totalQuestionsAttempted: number;
  finalScore: number;
}

// Game room state
export interface GameRoom {
  id: string; // roomId
  players: [Player, Player];
  questions: QuestionAttributes[];
  currentQuestionIndex: number;
  playerGameData: {
    // Tracks individual player stats for the entire game
    [userId: number]: PlayerGameData; // Keyed by Player.userId
  };
  status:
    | "waiting_players"
    | "starting"
    | "playing"
    | "result_display"
    | "ended";
  topic: string;
  currentQuestionTemporaryAnswers: {
    // Stores answers for the currently active question only
    [userId: number]: {
      // Keyed by Player.userId
      answer: string | null;
      isCorrect: boolean;
      points: number;
      responseTime: number;
    };
  };
  questionStartTime: number | null;
  questionTimerId?: NodeJS.Timeout;
  nextQuestionTimerId?: NodeJS.Timeout;
  cleanupTimerId?: NodeJS.Timeout;
}

// Type for the main function this module exports
export type BattleHandlerFunction = (
  io: SocketIOServer,
  gameRooms: Map<string, GameRoom>,
  waitingPlayers: Player[],
  gameService: GameService // Pass typed gameService
) => void;
