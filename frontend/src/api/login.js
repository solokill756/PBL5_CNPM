import { axiosPrivate } from "./axios";

export const fetchLogin = async (email, password) => {
    try {
      const response = await axiosPrivate.post("/api/auth/login", { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      return { user, accessToken, refreshToken, error: null };
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error;
      console.log('====================================');
      console.log(message, error);
      console.log('====================================');
  
      if (status === 403 && message === "Tài khoản của bạn chưa được xác thực") {
        return { user: { email, isVerified: false }, error: "unverified" };
      }
  
      throw error; // để handle ở ngoài
    }
  };
  