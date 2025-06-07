import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/User/userRoute.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/User/authenticationRoute.js";
import passport from "passport";
import session from "express-session";

import http from "http";
import { Server } from "socket.io";
import battleHandler from "./socketIO/battleHandler.js";
import { responseFormatter } from "./middleware/responseFormatter.js";
import homePageRoutes from "./routes/User/homePageRoute.js";
import profileRoutes from "./routes/User/profileRoute.js";
import flashCardRoutes from "./routes/User/flashCardRoute.js";
import quizRoutes from "./routes/User/quizRoute.js";
import vocabularyRoute from "./routes/User/vocabularyRoute.js";
import learnRoutes from "./routes/User/learnRoutes.js";
import achivermentRoutes from "./routes/User/achivermentRote.js";
import classRoute from "./routes/User/classRoute.js";
import listFlashCardRoute from "./routes/User/listFlashCardRoute.js";
import AdminVocabularyRoutes from "./routes/Admin/VocabularyRoute.js";

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 80;
const hostname: string = process.env.HOST_NAME as string;
const corOptions: cors.CorsOptions = {
  origin: "http://localhost:3000", // Chỉ định frontend được phép truy cập
  credentials: true, // Cho phép gửi cookie/token qua request
};
const server = http.createServer(app);
// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret", // Đặt một chuỗi bí mật để mã hóa session
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Đặt thành `true` nếu dùng HTTPS
  })
);

// Cấu hình cho Socket IO
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn truy cập
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const gameRooms = new Map();
const waitingPlayers: any[] = [];

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseFormatter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/homePage", homePageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/flashcard", flashCardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/vocabulary", vocabularyRoute);
app.use("/api/learn", learnRoutes);
app.use("/api/achievement", achivermentRoutes);
app.use("/api/class", classRoute);
app.use("/api/listFlashcard", listFlashCardRoute);
app.use("/api/admin/vocabulary", AdminVocabularyRoutes);
// import Socket IO logic
battleHandler(io, gameRooms, waitingPlayers);

server.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${hostname}/${port}`);
});
