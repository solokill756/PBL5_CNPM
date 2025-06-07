export const fetchCurrentUser = async () => {
  try {
    const res = await axiosPrivate.get("/api/auth/user");
    return { accessToken, refreshToken, user } = res.data.data.user;
  } catch (error) {
    console.log(error);
  }
};
