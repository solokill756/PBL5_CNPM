export const saveFlashcardToClasses = async (axios, list_id, classes = []) => {
  try {
    const response = await axios.post(`api/flashcard/addListFlashcardToClass`, {
      list_id,
      classes,
    });
    const data = response.data.data;
    if (data) return data;
  } catch (error) {
    console.log(error.response.data.error);
  }
};
