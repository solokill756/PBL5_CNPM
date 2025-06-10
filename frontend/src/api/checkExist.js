import { axiosPrivate } from "./axios";

export const checkExist = async (email) => {
  try {
    // Sử dụng `params` để truyền email như query parameter
    const response = await axiosPrivate.post(
      "/api/auth/checkEmail",
      {
        email,
      }
    );

    if (response.status === 200) 
        return false;
  } catch (error) {
    console.error("Error checking existence:", error);

    if (error.response) {
      if (error.response.status === 409) {
        return true;
      }
    }
    return false;
  }
};
