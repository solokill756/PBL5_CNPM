export const postForgetCard = async (axios, card_id = [], list_id) => {
    try {
        const response = await axios.post(`/api/learn/not-remenber-flashcard`, {
            flashcard_ids: card_id,
            list_id: list_id
        });
        return response.data.data;
    } catch (error) {
        console.error('Error posting forget card:', error);
        throw error;
    }
}
