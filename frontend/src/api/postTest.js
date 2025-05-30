import { axiosPrivate } from "./axios";

export const postTest = async (topic_id) => {
    try {
        const response = await axiosPrivate.post(
            "http://localhost:9000/api/quiz//generateQuiz",
            {
                topic_id: topic_id
            }
        );
        return response.data.data;
    } catch (error) {
        console.log("Lỗi:", error?.response?.data?.error || error.message);
        return null;
    }
};
