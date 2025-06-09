export const setReminder = async (axiosPrivate, reminder_time, reminder_status) => {
    try {
        const response = await axiosPrivate.post(
            '/api/profile/setReminder', 
            {
                reminderTime: reminder_time, 
                reminderStatus: reminder_status
            }
        );

        console.log(">>> setReminder response:", response.data); 
        return response.data.data;
    } catch (error) {
        console.error('Error set reminder:', error.response?.data || error.message);
        throw error;
    }
};
