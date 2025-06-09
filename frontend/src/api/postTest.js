export const postTest = async (axiosPrivate,topic_id) => {
    try {
        const response = await axiosPrivate.post(
            "/api/quiz//generateQuiz", 
            {
                topic_id: topic_id
            }
        );
        
        console.log("API response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi API:", error?.response?.data?.error || error.message);
        console.error("Full error:", error);
        throw error; 
    }
};

