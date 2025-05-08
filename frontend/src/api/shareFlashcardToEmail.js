export const shareFlashcardToEmail = async (axios, list_id, email) => {
  try {
    const response = await axios.post(
      "api/flashcard/shareLinkListFlashcardToUser",
      { list_id, email }
    );
    const data = response.data.data;
    if (data) return data;
  } catch (error) {
    console.log(error.response.data.error);
  }
};
