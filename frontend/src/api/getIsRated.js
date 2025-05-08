export const fetchIsRated = async (axiosPrivate, id) => {
  const { data } = await axiosPrivate.get(
    `api/flashcard/checkRateFlashcard/${id}`
  );

  return data.data === false ? false : data.data.rate;
};
