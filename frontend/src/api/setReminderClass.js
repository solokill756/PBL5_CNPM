export const setReminderClass = async (axiosPrivate, class_id, reminder_status) => {
    try {
        const response = await axiosPrivate.post(
            'http://localhost:9000/api/profile/setReminderClass', 
            {
                classId: class_id,
                reminderStatus: reminder_status
            }
        );
        console.log('Response from setReminderClass:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error set reminder :', error);
        throw error;
    }
};