import dotenv from "dotenv";
import { loginService, registerService , logOutService } from "../services/authService.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import removeNullProperties from "../helpers/removeNullProperties.js";
import { saltRounds } from "../helpers/tokenHelper.js";

dotenv.config();

// Register
const register = async (req: Request, res: Response): Promise<void> => {
  console.log("Registering services !");
  try {
    const user = removeNullProperties ({
      username: req.body.username,
      password: req.body.password,
      full_name: req.body.fullname,
      email: req.body.email,
      datetime_joined: Date.now(),
    });
    const hashPassword = await bcrypt.hash(user.password as string ,  saltRounds);
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
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
      return;
    }
    const user = { email: email, password: password };
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
