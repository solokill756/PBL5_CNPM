export const postTestResult = async (axiosPrivate,correctCount, total) => {
    try {
        const response = await axiosPrivate.post(
            "/api/quiz/saveResultQuiz", 
            {
                score: correctCount,
                number_of_questions: total,
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

