import { axiosPrivate } from "./axios";

export const getProfile = async () => {
    try {
        const response = await axiosPrivate.get("/api/profile/getProfile");
        return response.data.data;
    } catch (error) {
        console.log("Lỗi:", error?.response?.data?.error || error.message);
        return null;
    }
};
