import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "../routes/userRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
var corOptions = {
  origin: "http://localhost:8080",
};

//Middleaware
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//routes
app.use("/api/users", userRoutes);
app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${hostname}/${port}`);
});
