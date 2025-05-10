export const unStarOnFlashcard = async (axios, id) => {
  try {
    const response = await axios.delete(`api/flashcard/unlikeFlashcard/${id}`);
    const data = response.data.data;
    if (data === 1) return data;
  } catch (error) {
    console.log(error.response.data.error);
  }
};
