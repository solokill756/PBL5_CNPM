import { setTokens } from "@/helper/tokenService";
import { axiosPrivate } from "./axios";

export const verifyOTP = async (otp, email) => {
  try {
    const response = await axiosPrivate.post(
      "/api/auth/verifyOtp",
      { otp, email },
    );

    const data = response.data;
    setTokens(data.accessToken, data.refreshToken);
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: error.response?.data?.message || "OTP không đúng hoặc đã hết hạn!" };
  }
};
