export const removeFlashcard = async (axiosPrivate, classId, listId) => {
  try {
    const response = await axiosPrivate.delete(
      '/api/class/remove-list-flashcard-from-class',
      { 
        data: {  
          class_id: classId, 
          list_id: listId
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};