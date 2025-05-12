export const uploadFile = async (axiosPrivate, image) => {
  try {
    const formData = new FormData();
    formData.append('image', image);

    const response = await axiosPrivate.post(
      'http://localhost:9000/api/profile/updateProfilePicture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.profile_picture;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
