export const starOnFlashcard = async (axios, id) => {
  try {
    const response = await axios.post(`api/flashcard/likeFlashcard`, {
      flashcard_id: id,
    });
    const data = response.data.data;
    if (data === 1) return data;
  } catch (error) {
    console.log(error.response.data.error);
  }
};
