import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "../routes/userRoute.js";
import authRoutes from "../routes/authenticationRoute.js";
dotenv.config();

const app = express();
const port = 9000;
const hostname = process.env.HOST_NAME;
var corOptions = {
  origin: "http://localhost:8080",
};

//Middleaware
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth/", authRoutes);
app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${hostname}/${port}`);
});
