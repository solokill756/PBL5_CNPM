import dotenv from "dotenv";
import {
  loginService,
  registerService,
  logOutService,
  checkEmailService,
  resetPasswordService,
  verifyOtpService,
  sendOtpService,
} from "../../services/User/authService.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../middleware/responseFormatter.js";
import { generateOtp } from "../../helpers/generateOtp.js";
import { sendOtpEmail } from "../../helpers/sendOtp.js";
import removeNullProperties from "../../utils/removeNullProperties.js";
import { refreshAccessToken, saltRounds } from "../../helpers/tokenHelper.js";
import generateRandomPassword from "../../helpers/generatePassword.js";
import { sendNewPasswordEmail } from "../../helpers/sendNewPassword.js";
dotenv.config();

const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    // Tạo mã OTP
    const otp = generateOtp();
    await sendOtpService(email, otp);
    // Gửi OTP đến email
    await sendOtpEmail(email, otp);
    sendSuccess(res, { message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to send OTP", 500);
  }
};

const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, email } = req.body;
    // Kiểm tra xem OTP và email có được cung cấp hay không
    if (!email) {
      sendError(res, "Email is required", 400);
    }
    if (!otp) {
      sendError(res, "OTP is required", 400);
    }
    const data = await verifyOtpService(otp, email);
    if (data.error) {
      sendError(res, data, 409);
    } else {
      sendSuccess(res, data);
    }
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to verify OTP", 500);
  }
};

// Register
const register = async (req: Request, res: Response): Promise<void> => {
  console.log("Registering services !");
  try {
    const user = removeNullProperties({
      username: req.body.username,
      password: req.body.password,
      full_name: req.body.fullname,
      email: req.body.email,
      datetime_joined: Date.now(),
    });
    const hashPassword = await bcrypt.hash(user.password as string, saltRounds);
    user.password = hashPassword;
    registerService(user).then((response) => {
      response.error != null
        ? sendError(res, response, 409)
        : sendSuccess(res, response);
    });
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      sendError(res, "Thiếu email hoặc mật khẩu", 400);
      return;
    }
    const user = { email: email, password: password };
    const data = await loginService(user);
    if (data.error) {
      sendError(res, data, 403);
    } else {
      sendSuccess(res, data);
    }
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = (req as any).user.user_id;
    const data = await logOutService(userID);
    sendSuccess(res, data);
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};

const checkEmailSignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.email;
    const data = await checkEmailService(email);
    if (data.error) {
      sendError(res, data, 409);
    } else {
      sendSuccess(res, data);
    }
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const email = req.body.email;
  try {
    const newPassword = generateRandomPassword();
    const hashPassword = await bcrypt.hash(newPassword as string, saltRounds);
    const data = await resetPasswordService(email, hashPassword);
    if (data.error) {
      sendError(res, data, 409);
    } else {
      await sendNewPasswordEmail(email, newPassword);
      sendSuccess(res, data);
    }
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};

const generateNewToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken =
    req.cookies?.refreshToken || req.headers["x-refresh-token"];
  if (!refreshToken) {
    sendError(res, "Thiếu refresh token", 401);
    return;
  }
  // Gọi service để tạo access token mới từ refresh token
  const newAccessToken = await refreshAccessToken(refreshToken);
  if (!newAccessToken) {
    res
      .status(403)
      .json({ error: "Refresh token không hợp lệ hoặc đã hết hạn" });
    return;
  }
  res.status(200).json({ newAccessToken: `${newAccessToken}` });
  return;
};

export {
  login,
  register,
  logout,
  checkEmailSignUp,
  sendOtp,
  verifyOtp,
  resetPassword,
  generateNewToken,
};
