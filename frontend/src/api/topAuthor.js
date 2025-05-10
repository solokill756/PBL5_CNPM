export const fetchTopAuthor = async (axiosPrivate) => {
  try {
    const res = await axiosPrivate.get("/api/homePage/topAuthor");

    if (res.data.data) return { data: res.data.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error };
  }
};
