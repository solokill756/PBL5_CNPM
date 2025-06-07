export const getClass = async (axiosPrivate, class_id) => {
    const response = await axiosPrivate.get(`api/class/get-class/${class_id}`);
    return response.data.data;
}