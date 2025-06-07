export const updateProfile = async (axiosPrivate, full_name, username, profile_picture, newPassword) => {
    try {
        const response = await axiosPrivate.post(
            '/api/profile/updateProfile', 
            {
                full_name: full_name,
                username: username,
                profile_picture: profile_picture,
                password: newPassword
            }
        );
        
        return response.data.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};