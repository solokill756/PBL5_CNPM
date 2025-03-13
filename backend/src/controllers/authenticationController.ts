import dotenv from "dotenv";
import { loginService, registerService , logOutService } from "../services/authService.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

dotenv.config();
const saltRounds = 10;

// Register
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
      full_name: req.body.fullname,
      email: req.body.email,
      datetime_joined: Date.now(),
    };
    const hashPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashPassword;
    registerService(user).then((response) => {
      res.status(200).json(response);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (!username && !password) {
      res.status(400).json({ error: "Thiếu username or email" });
      return;
    }
    const user = { username: username, password: password, email: email };
    const data = await loginService(user);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await logOutService(req, res);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
    
  }
}

export { login, register , logout };
