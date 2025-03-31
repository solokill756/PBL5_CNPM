import axios, { axiosPrivate } from "./axios";
import Cookies from "js-cookie";

// src/api/login.js
export const fetchRegister = async (email, password, fullname, username) => {
    try {
        const response = await axiosPrivate.post("/api/auth/register", { email, password, fullname, username});
        
        const data = response.data;
        
        // Lưu accessToken vào cookie
        Cookies.set("accessToken", data.accessToken, { expires: 1, secure: true, sameSite: "Strict" });
        Cookies.set("refreshToken", data.refreshToken, { expires: 7, secure: true, sameSite: "Strict" });
        
        return data.user;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};
