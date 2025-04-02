import dotenv from "dotenv";
import db from "../models/index.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { deleteToken , generateAccessToken ,generateRefreshToken } from "../helpers/tokenHelper.js";



dotenv.config();

const User = db.users;
interface UserPayload {
  username: string;
  email: string;
  id: number;
  tokenVersion?: number;
}

interface UserClientData {
  full_name: string,
  email : string,
  profile_picture : string,
  usename :string,
  datatime_joined : string,
  user_id : string,
}




const checkEmailService = async (email : string): Promise<any> => {
  try { 
    const findUser = await User.findOne({
      where: { email: email },
    });
  if (findUser) {
      return { error: "Email này đã có người đăng ký" };
  }
  return { message : "Email này chưa có người đăng ký"}
    
  } catch (error) {
    throw error;
  }
 
};


const registerService = async (user: any): Promise<any> => {
  try {
    const checkEmail = await checkEmailService(user.email);
    if(checkEmail.error) {
        return checkEmail;
    }
   await User.create({ ...user, tokenVersion: 0 });
    return {
      message: "Tạo tài khoản thành công!",
    };
  } catch (error) {
    throw error;
  }
};

const logOutService = async (req: Request, res: Response): Promise<{ message: string }> => {
  try {
    const userId = (req.body.user as UserPayload).id;
    await User.update({ tokenVersion: db.sequelize.literal("tokenVersion + 1") }, { where: { id: userId } });
    deleteToken(req, res);
    return { message: "Đăng xuất thành công!" };
  } catch (error) {
    throw error;
  }
};

const loginService = async (user: { email: string; password: string }): Promise<any> => {
  try {
    const findUser = await User.findOne({
      where: { email: user.email },
    });

    if (!findUser) {
      return { error: "Tài khoản hoặc mật khẩu không đúng" };
    }

    const userData = findUser.toJSON(); // Chuyển về object JSON

    if (!bcrypt.compareSync(user.password, userData.password)) {
      return { error: "Tài khoản hoặc mật khẩu không đúng" };
    }

    const payLoad: UserPayload = {
      username: userData.username,
      email: userData.email,
      id: userData.id,
      tokenVersion: userData.tokenVersion,
    };

    return {
      accessToken: generateAccessToken(payLoad),
      refreshToken: generateRefreshToken(payLoad),
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        datetime_joined: userData.datetime_joined,
      },
    };
  } catch (error) {
    throw error;
  }
};

const resetPasswordService= async(email : string , newPassword : string) : Promise<any> => {
  try {
    const findUser = await User.findOne({
      where: { email: email },
    });
    if(!findUser) {
      return { error : "User not found"};
    }
    else {
        findUser.password = newPassword;
        await findUser.save();
        return {message : "Reset Password Successfully"};
    }
  } catch (error) {
    throw error;
  }
}



export { registerService, loginService,  logOutService , checkEmailService , UserClientData , UserPayload , resetPasswordService};
