import axios, { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.get("/api/auth/generateNewToken", {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "x-refresh-token": auth.refreshToken,
        },
      });

      const newAccessToken = response.data.accessToken;

      const newAuth = {
        ...auth,
        accessToken: newAccessToken,
      };

      setAuth(newAuth);
      return newAccessToken;
    } catch (err) {
      console.error("Refresh token failed", err);
      throw err;
    }
  };
  return refresh;
};

export default useRefreshToken;
