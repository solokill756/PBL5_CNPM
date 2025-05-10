import { axiosPrivate } from "@/api/axios";
import AuthContext from "@/context/AuthProvider";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const login  = useAuthStore(state => state.login);
  const setTokens  = useAuthStore(state => state.setTokens);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosPrivate.get(
          "http://localhost:9000/api/auth/user"
        );
        const { accessToken, refreshToken, user } = res.data.user;

        if (!accessToken || !refreshToken) {
          console.log("Khong nhan duoc token");
          return;
        }

        login({accessToken, refreshToken, user});
        setTokens({accessToken, refreshToken});
        navigate("/");
      } catch (error) {
        console.error("Not authenticated");
        navigate("/accounts/login");
      }
    };

    fetchUser();
  }, [login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default AuthSuccess;
