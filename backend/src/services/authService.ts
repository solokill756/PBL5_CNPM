
import dotenv from "dotenv";
import db from "../models/index.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { deleteToken , generateAccessToken ,generateRefreshToken } from "../helpers/tokenHelper.js";
import { filterUserData } from "../helpers/fillData.js";





dotenv.config();

const User = db.users;
const Authentication = db.authentication;
const sequelize = db.sequelize;
interface UserPayload {
  username: string;
  email: string;
  id: number;
  tokenVersion?: number;
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
  const transaction = await sequelize.transaction();
  try {
    const checkEmail = await checkEmailService(user.email);
    if(checkEmail.error) {
        return checkEmail;
    }
  const newUser =  await User.create({ ...user, tokenVersion: 0 } , {transaction});
   await Authentication.create({user_id : newUser.user_id , verified : 0 ,email_send : newUser.email} , {transaction});
   await transaction.commit();
    return filterUserData(newUser);
  } catch (error) {
    transaction.rollback();
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
      include : {
        model : Authentication,
      }
    });

    if (!findUser) {
      return { error: "Tài khoản hoặc mật khẩu không đúng" };
    }

    const userData = findUser.toJSON(); // Chuyển về object JSON

    if (!bcrypt.compareSync(user.password, userData.password)) {
      return { error: "Tài khoản hoặc mật khẩu không đúng" };
    }
    if(findUser.Authentications[0].verified == 0) {
      return {error : "Tài khoản của bạn chưa được xác thực"};
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
        profile_picture: userData.profile_picture,
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

const sendOtpService = async(email : string , otp : string) : Promise<void> => {
  try { 
  const dayNow = new Date();
  const [updatedCount] = await  Authentication.update({
       otp_code : otp,
       created_at : dayNow,
       otp_expiry : dayNow.setMinutes(dayNow.getMinutes() + 5),
    } , {where : {email_send : email}})
  if(updatedCount == 0) {
    throw new Error("Không tìm thấy người dùng với email +  " + email);
  } 
  } catch (error) {
    throw error;
  }
}

const  verifyOtpService = async(otp : string , email : string) : Promise<any> => {
  const authRecord =  await Authentication.findOne({where : {otp_code : otp , email_send : email}});
  if (!authRecord) {
      return { error: "Invalid OTP" };
    }
  if (authRecord.otp_expiry && authRecord.otp_expiry < new Date()) {
     return { error: 'OTP has expired' };
    }
  authRecord.verified = 1;
  await authRecord.save();
  const findUser = await User.findOne({where : {email : email}});
  if(!findUser) {
    return { error: "User not found" };
  }
  const userData = findUser.toJSON();
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
      profile_picture: userData.profile_picture,
    },
  };
}




export { registerService, loginService,  logOutService , checkEmailService ,  UserPayload , resetPasswordService , verifyOtpService , sendOtpService };
