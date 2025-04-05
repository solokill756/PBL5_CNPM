import { setTokens } from "@/helper/tokenService";
import { axiosPrivate } from "./axios";

export const loginGoogle = async () => {
  try {
    const response = axiosPrivate.get("/api/auth/google");
    // Chuyển hướng trình duyệt đến URL OAuth
    window.location.href = 'http://localhost:9000/api/auth/google'
    const { accessToken, refreshToken, user } = response.data;

    setTokens(accessToken, refreshToken);
    return { user, error: null };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
