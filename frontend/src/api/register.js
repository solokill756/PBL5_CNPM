import { axiosPrivate } from "./axios";

// src/api/login.js
export const fetchRegister = async (username, email, password, fullname) => {
  try {
    const response = await axiosPrivate.post("/api/auth/register", {
      username, 
      email,
      password,
      fullname,
    });
    const data = response.data.data;

    return { success: true, email };
  } catch (error) {
    console.error("Error during register:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi đăng ký",
    };
  }
};
