export const postFlashcardRating = async (axiosPrivate, id, rating, comment) => {
    const response = await axiosPrivate.post(
        `api/flashcard/rateListFlashcard`, {
            list_id: id, 
            rate: rating, 
            comment: comment
        }
    );
    
    return response.data.data;
};