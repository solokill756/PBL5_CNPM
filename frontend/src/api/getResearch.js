export const getResearch = async (axiosPrivate, searchValue) => {
  try {
    const response = await axiosPrivate.get('/api/homePage/search', {
      params: {
        value: searchValue
      }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};