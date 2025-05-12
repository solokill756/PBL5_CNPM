export const resetForgetCard = async (axios, list_id) => {
    try {
        const response = await axios.get(`/api/learn/reset-learn/${list_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error resetting forget card:', error);
        throw error;
    }
}
