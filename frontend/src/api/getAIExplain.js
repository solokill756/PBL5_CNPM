export const fetchAIExplain = async (axios, flashcardId) => {
   try {
    const response = await axios.get(`/api/flashcard/getAlExplanation/${flashcardId}`);
    return response.data.data;
   } catch (error) {
    console.log(error);
   }
};
