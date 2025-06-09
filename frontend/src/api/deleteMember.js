export const deleteMember = async (axiosPrivate, classId, memberId) => {
  try {
    const response = await axiosPrivate.delete(
      '/api/class/remove-member-from-class',
      { 
        data: {  
          class_id: classId, 
          user_id: memberId 
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};