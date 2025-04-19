import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authenticationRoute.js";
import passport from "passport";
import session from "express-session";
import homePageRoutes from "./routes/homePageRoute.js";

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 8888;
const hostname: string = process.env.HOST_NAME as string;
const corOptions: cors.CorsOptions = {
  origin: "http://localhost:3000", // Chỉ định frontend được phép truy cập
  credentials: true, // Cho phép gửi cookie/token qua request
};

// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret", // Đặt một chuỗi bí mật để mã hóa session
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Đặt thành `true` nếu dùng HTTPS
  })
);

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/homePage", homePageRoutes);

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${hostname}/${port}`);
});
