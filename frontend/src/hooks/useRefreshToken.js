import { useCallback } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = useCallback(async () => {
    try {
      const { data } = await axiosPrivate.get("/api/auth/generateNewToken", {
        headers: { "x-refresh-token": auth?.refreshToken },
      });
      const newAccessToken = data.newAccessToken;

      setAuth((prev) => ({
        ...prev,
        accessToken: newAccessToken,
      }));

      return newAccessToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      throw err;
    }
  }, [auth?.refreshToken, setAuth]);

  return refresh;
};

export default useRefreshToken;
