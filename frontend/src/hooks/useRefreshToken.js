import { useCallback } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuthStore } from "@/store/useAuthStore";

const useRefreshToken = () => {
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setTokens   = useAuthStore(state => state.setTokens);

  const refresh = useCallback(async () => {
    try {
      const { data } = await axiosPrivate.get("/api/auth/generateNewToken", {
        headers: { "x-refresh-token": refreshToken },
      });
      const newAccessToken = data.newAccessToken;

      setTokens({ accessToken: newAccessToken, refreshToken });
      return newAccessToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      throw err;
    }
  }, [refreshToken, setTokens]);

  return refresh;
};

export default useRefreshToken;
