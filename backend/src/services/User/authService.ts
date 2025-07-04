import dotenv from "dotenv";
import bcrypt from "bcrypt";

import db from "../../models"; // Assuming you have a models/index.js that exports your Sequelize models
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/tokenHelper";
dotenv.config();
interface UserPayload {
  username: string;
  email: string;
  user_id: string;
  tokenVersion?: number;
  level: Number;
}

const checkEmailService = async (email: string): Promise<any> => {
  try {
    const findUser = await db.user.findOne({
      where: { email: email },
    });
    if (findUser) {
      return { error: "Email này đã có người đăng ký" };
    }
    return { message: "Email này chưa có người đăng ký" };
  } catch (error) {
    throw error;
  }
};

const registerService = async (
  user: any,
  verified: number = 0
): Promise<any> => {
  const transaction = await db.sequelize.transaction();
  try {
    const checkEmail = await checkEmailService(user.email);
    if (checkEmail.error) {
      return checkEmail;
    }
    const newUser = await db.user.create(
      { ...user, tokenVersion: 0, level: 1, points: 0, levelThreshold: 500 },
      { transaction }
    );
    await db.authentication.create(
      {
        user_id: newUser.user_id,
        verified: verified,
        email_send: newUser.email,
      },
      { transaction }
    );
    await transaction.commit();
    return newUser;
  } catch (error) {
    transaction.rollback();
    throw error;
  }
};

const logOutService = async (userID: string): Promise<{ message: string }> => {
  try {
    await db.user.update(
      { tokenVersion: db.sequelize.literal("tokenVersion + 1") },
      { where: { user_id: userID } }
    );
    return { message: "Đăng xuất thành công!" };
  } catch (error) {
    throw error;
  }
};

const loginService = async (user: {
  email: string;
  password: string;
}): Promise<any> => {
  try {
    const findUser = await db.user.findOne({
      where: { email: user.email },
      include: {
        model: db.authentication,
      },
    });

    if (!findUser) {
      return { error: "Tài khoản hoặc mật khẩu không đúng" };
    }

    const userData = findUser.toJSON(); // Chuyển về object JSON

    if (!bcrypt.compareSync(user.password, userData.password)) {
      return { error: "Tài khoản hoặc mật khẩu không đúng" };
    }
    if (findUser.Authentications[0].verified == 0) {
      return { error: "Tài khoản của bạn chưa được xác thực" };
    }
    if (findUser.is_blocked) {
      return { error: "Tài khoản của bạn đã bị khóa" };
    }
    const payLoad: UserPayload = {
      username: userData.username,
      email: userData.email,
      user_id: userData.user_id,
      tokenVersion: userData.tokenVersion,
      level: userData.current_level,
    };

    return {
      accessToken: generateAccessToken(payLoad),
      refreshToken: generateRefreshToken(payLoad),
      user: {
        id: userData.user_id,
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        datetime_joined: userData.datetime_joined,
        profile_picture: userData.profile_picture,
        role: userData.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

const resetPasswordService = async (
  email: string,
  newPassword: string
): Promise<any> => {
  try {
    const findUser = await db.user.findOne({
      where: { email: email },
    });
    if (!findUser) {
      return { error: "User not found" };
    } else {
      findUser.password = newPassword;
      await findUser.save();
      return { message: "Reset Password Successfully" };
    }
  } catch (error) {
    throw error;
  }
};

const sendOtpService = async (email: string, otp: string): Promise<void> => {
  try {
    const dayNow = new Date();
    const [updatedCount] = await db.authentication.update(
      {
        otp_code: otp,
        created_at: dayNow,
        otp_expiry: dayNow.setMinutes(dayNow.getMinutes() + 5),
      },
      { where: { email_send: email } }
    );
    if (updatedCount == 0) {
      throw new Error("Không tìm thấy người dùng với email +  " + email);
    }
  } catch (error) {
    throw error;
  }
};

const verifyOtpService = async (otp: string, email: string): Promise<any> => {
  const authRecord = await db.authentication.findOne({
    where: { otp_code: otp, email_send: email },
  });
  if (!authRecord) {
    return { error: "Invalid OTP" };
  }
  if (authRecord.otp_expiry && authRecord.otp_expiry < new Date()) {
    return { error: "OTP has expired" };
  }
  authRecord.verified = 1;
  await authRecord.save();
  const findUser = await db.user.findOne({ where: { email: email } });
  if (!findUser) {
    return { error: "User not found" };
  }
  const userData = findUser.toJSON();
  const payLoad: UserPayload = {
    username: userData.username,
    email: userData.email,
    user_id: userData.user_id,
    tokenVersion: userData.tokenVersion,
    level: userData.current_level,
  };
  return {
    accessToken: generateAccessToken(payLoad),
    refreshToken: generateRefreshToken(payLoad),
    user: {
      id: userData.user_id,
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name,
      datetime_joined: userData.datetime_joined,
      profile_picture: userData.profile_picture,
    },
  };
};

export {
  registerService,
  loginService,
  logOutService,
  checkEmailService,
  UserPayload,
  resetPasswordService,
  verifyOtpService,
  sendOtpService,
};
