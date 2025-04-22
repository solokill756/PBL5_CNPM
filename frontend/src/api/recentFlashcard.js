export const fetchRecentFlashcards = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get("/api/homePage/recentFlashcard");
        if (res.data) 
            return { data: res.data, error: null };
    } catch (error) {
        return { data: null, error: error.response?.data?.error };
    }
}