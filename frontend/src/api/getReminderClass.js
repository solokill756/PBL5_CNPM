import { axiosPrivate } from "./axios";

export const getReminderClass = async () => {
    try {
        const response = await axiosPrivate.get("http://localhost:9000/api/profile/getReminderClass");
        return response.data.data;
    } catch (error) {
        console.log("Lỗi:", error?.response?.data?.error || error.message);
        return null;
    }
};
