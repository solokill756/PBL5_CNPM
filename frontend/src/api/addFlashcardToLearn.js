export const addFlashcardToLearn = async (axios, list_id) => {
    try {
        const response = await axios.post(`/api/learn/add-flashcard-to-learn/${list_id}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
