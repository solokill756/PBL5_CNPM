export const getForgetCard = async (axios, list_id) => {
    try {
        const response = await axios.get(`/api/learn/get-flashcard-learn/${list_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error getting forget card:', error);
        throw error;
    }
}
