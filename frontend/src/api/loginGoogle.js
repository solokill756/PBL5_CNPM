import { setTokens } from "@/helper/tokenService";
import { axiosPrivate } from "./axios";

export const loginGoogle = async () => {
  try {
    // window.location.href = 'http://9000/api/auth/google'
    const response = await axiosPrivate.get("/api/auth/google");
    const { accessToken, refreshToken, user } = response.data;
    console.log("====================================");
    console.log(accessToken, refreshToken, user);
    console.log("====================================");

    setTokens(accessToken, refreshToken);

    return { user, error: null };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
