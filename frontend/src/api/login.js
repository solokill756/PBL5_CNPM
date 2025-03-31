import { axiosPrivate } from "./axios";
import Cookies from "js-cookie";

// src/api/login.js
export const fetchLogin = async (email, password) => {
    try {
        const response = await axiosPrivate.post("/api/auth/login", { email, password });
        
        const data = response.data;
        console.log('====================================');
        console.log(data);
        console.log('====================================');

        // Lưu accessToken vào cookie
        Cookies.set("accessToken", data.accessToken, { 
            expires: 1, // Lưu 1 ngày
            secure: true, 
            sameSite: "Strict", 
            path: "/"  // Quan trọng: Đảm bảo Cookies có thể truy cập trên tất cả các trang
        });
        
        Cookies.set("refreshToken", data.refreshToken, { expires: 7, secure: true, sameSite: "Strict" });
        
        return data.user;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};
