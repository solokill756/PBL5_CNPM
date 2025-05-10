export const fetchAIExplain = async (axios, flashcardId) => {
    const response = await axios.post('/api/ai/explain', {
        flashcardId,
    });
    return response.data.data;
};
