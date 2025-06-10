import { axiosPrivate } from "./axios";

export const getOTP = async (email) => {
  try {
    // Sử dụng `params` để truyền email như query parameter
    const response = await axiosPrivate.post(
      "/api/auth/sendOTP",
      {
        email,
      }
    );

    return (response.status === 200) 
  } catch (error) {
    console.error("Error checking existence:", error);
    return false;
  }
};
