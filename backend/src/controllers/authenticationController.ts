import dotenv from "dotenv";
import { loginService, registerService , logOutService, checkEmailService, resetPasswordService, verifyOtpService, sendOtpService,  } from "../services/authService.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import removeNullProperties from "../helpers/removeNullProperties.js";
import { saltRounds } from "../helpers/tokenHelper.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendOtp.js";
import generateRandomPassword from "../utils/generatePassword.js";
import {sendNewPasswordEmail } from "../utils/sendNewPassword.js";

dotenv.config();


const sendOtp = async (req :Request, res : Response) : Promise<void> => {
  try {
    const {email} = req.body;
    // Tạo mã OTP
    const otp = generateOtp();
    await sendOtpService(email , otp);
    // Gửi OTP đến email
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOtp = async (req : Request, res : Response) : Promise<void> => {
  try {
  const { otp , email } = req.body;
  // Kiểm tra xem OTP và email có được cung cấp hay không
  if (!email) {
    res.status(400).json({ error: "Email is required" });
  }
  if (!otp) {
      res.status(400).json({ error: "OTP is required" });
  }
   const data =  await verifyOtpService(otp , email);
   if(data.error) {
      res.status(409).json(data);
   }
   else {
      res.status(200).json(data); 
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

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
       response.error != null ? res.status(409).json(response) : res.status(200).json(response);
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
    if(data.error) {
      res.status(403).json(data);
    }
    else {
       res.status(200).json(data);
    }
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

const checkEmailSignUp = async(req : Request , res : Response) : Promise<void> => {
  try {
    const email = req.body.email;
    const data = await checkEmailService(email);
    if(data.error) {
        res.status(409).json(data);
    }
    else {
        res.status(200).json(data);
    }
  } catch (error) {
      console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
}

const resetPassword = async(req : Request , res : Response) : Promise<void> => {
  const email = req.body.email;
  try {
    const newPassword = generateRandomPassword();
      const hashPassword = await bcrypt.hash(newPassword as string ,  saltRounds);
      const data = await resetPasswordService(email , hashPassword);
      if(data.error) {
        res.status(409).json(data);
      }
      else {
        await sendNewPasswordEmail(email , newPassword);
         res.status(200).json(data);
      }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
}



export { login, register , logout , checkEmailSignUp , sendOtp , verifyOtp , resetPassword };
 

