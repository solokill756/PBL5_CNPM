export const CreateClass = async (axiosPrivate, className,description) => {
    try {
        console.log('Request data:', { className, description }); 
        const response = await axiosPrivate.post(
            '/api/class/add-class', 
            {
                name: className,
                description: description,         
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