
export const deleteMember = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.delete('/api/class/remove-member-from-class');
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
