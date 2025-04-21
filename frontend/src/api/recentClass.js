
export const fetchRecentClasses = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get("/api/homePage/recentClasses");
        if (res.data) 
            return { data: res.data, error: null };
    } catch (error) {
        console.log('====================================');
        console.log(error.response?.data?.error);
        console.log('====================================');
        return { data: null, error: error.response?.data?.error };
    }
}