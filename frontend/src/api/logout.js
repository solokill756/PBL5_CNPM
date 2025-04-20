export const fetchLogout = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.post("/api/auth/logout");
    const { message } = response.data;
    
    return { message, error: null };
  } catch (error) {
    return { message: null, error: error.response?.data?.error };
  }
};
