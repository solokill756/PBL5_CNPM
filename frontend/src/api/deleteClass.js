export const deleteClass = async (axiosPrivate, classId) => {
  try {
    const response = await axiosPrivate.delete(
      `/api/class/delete-class/${classId}`,
      { 
        data: {  
          class_id: classId, 
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};