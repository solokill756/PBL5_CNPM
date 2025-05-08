export const fetchFlashcardList = async (axiosPrivate, id) => {
    const response = await axiosPrivate.get(`api/flashcard/getFlashcardByListId/${id}`);
    return response.data.data;
}