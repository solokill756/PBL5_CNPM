export const postTestResult = async (axiosPrivate,correctCount, total, topic_id) => {
    try {
        const response = await axiosPrivate.post(
            "/api/quiz/saveResultQuiz", 
            {
                score: correctCount,
                number_of_questions: total,
                topic_id: topic_id // Assuming topic_id is available in the context where this function is called
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

