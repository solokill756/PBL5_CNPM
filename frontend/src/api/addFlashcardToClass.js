export const addFlashcardToClass = async (axiosPrivate, classId, listId) => {
    try {
        const response = await axiosPrivate.post(
            `/api/class/add-list-flashcard-to-class`,
            {
                class_id: classId,
                list_id: listId
            }
        );
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
