export const postRememberCard = async (axios, card_id = []) => {
    try {
        const response = await axios.post(`/api/learn/remenber-flashcard`, {
            flashcard_ids: card_id  
        });
        return response.data.data;
    } catch (error) {
        console.error('Error posting remember card:', error);
        throw error;
    }
}
