export const fetchUserClass = async (axios) => {
  try {
    const response = await axios.get(`api/flashcard/getClassOfUser`);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data.error);
  }
};
