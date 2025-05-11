export const saveLearnProgress = async (axios, list_id, number_word_forget, flashcard_id) => {
    try {
        const response = await axios.post('/api/learn/save-process', {
            list_id,
            number_word_forget,
            flashcard_id
        });
        return response.data.data;
    } catch (error) {
        console.error('Error saving learn progress:', error);
        throw error;
    }
}
