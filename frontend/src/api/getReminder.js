import { axiosPrivate } from "./axios";

export const getReminder = async () => {
    try {
        const response = await axiosPrivate.get("/api/profile/getReminder");
        return response.data.data;
    } catch (error) {
        console.log("Lỗi:", error?.response?.data?.error || error.message);
        return null;
    }
};
