
export const deleteAccount = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.delete('http://localhost:9000/api/profile/deleteUser');
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
