export const addMember = async (axiosPrivate, classId, email) => {
    try {
        console.log('Request data:', { classId, email }); 
        const response = await axiosPrivate.post(
            '/api/class/add-member-to-class', 
            {
                class_id: classId,
                email: email,
            }
        );
        console.log('Response:', response.data); 
        return response.data.data;
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        throw error;
    }
};