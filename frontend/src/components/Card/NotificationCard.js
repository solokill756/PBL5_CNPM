import React, { useEffect, useState } from 'react';
import Class from '../CardItems/Class';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Mention from '../CardItems/Mention';
import { getReminder } from '@/api/getReminder';
import { setReminder } from '@/api/setReminder';
import { getReminderClass } from '@/api/getReminderClass';
import { setReminderClass } from '@/api/setReminderClass';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NotificationCard = () => {
    const axiosPrivate = useAxiosPrivate();
    const [selectedTime, setSelectedTime] = useState(null);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reminderStatus, setReminderStatus] = useState(false);

    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const value = `${i.toString().padStart(2, '0')}:00`;
        return { value, label: value };
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const reminderData = await getReminder(axiosPrivate); 
                console.log("Fetched reminder data:", reminderData);
                
                if (reminderData) {
                    setSelectedTime(reminderData.reminder_time); 
                    setReminderStatus(reminderData.reminder_status);
                }

                const classData = await getReminderClass(axiosPrivate);
                console.log("Fetched class data:", classData);
                
                const formattedClasses = (classData || []).map(item => ({
                    className: item.Class?.class_name || 'Không rõ tên lớp',
                    reminderStatus: item.reminder_status,
                    classId: item.Class?.class_id || null
                }));
                setClasses(formattedClasses);
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [axiosPrivate]);

    const handleToggleReminder = async (value) => {
        try {
            setSelectedTime(value);
            const response = await setReminder(axiosPrivate, value, reminderStatus);
            console.log('Reminder time updated successfully:', response);
        } catch (error) {
            console.error('Failed to update reminder time:', error);
            const savedData = await getReminder(axiosPrivate);
            if (savedData) {
                setSelectedTime(savedData.reminder_time);
            }
        }
    };

    const handleToggleReminderStatus = async (status) => {
        try {
            setReminderStatus(status);
            const response = await setReminder(axiosPrivate, selectedTime, status);
            console.log('Reminder status updated successfully:', response);
        } catch (error) {
            console.error('Failed to toggle reminder status:', error);
            const savedData = await getReminder(axiosPrivate);
            if (savedData) {
                setReminderStatus(savedData.reminder_status);
            }
        }
    };

    const handleToggleClassReminder = async (index) => {
    try {
        const updatedClasses = [...classes];
        const classToUpdate = updatedClasses[index];
        const newStatus = !classToUpdate.reminderStatus;
        classToUpdate.reminderStatus = newStatus;
        setClasses(updatedClasses);

        const response = await setReminderClass(axiosPrivate, classToUpdate.classId, newStatus);
        console.log(`API response for class ${classToUpdate.classId}:`, response);

    } catch (error) {
        console.error("Không thể cập nhật trạng thái reminder:", error);
    }
};

    return (
        <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
            <div className='pt-8 pb-8 pl-6 pr-6 border-b-2 border-gray-200'>
                {isLoading ? (
                    <Skeleton height={80} />
                ) : (
                <Mention
                    title="Lời nhắc học"
                    options={timeOptions}
                    infor="Chọn thời điểm nhận lời nhắc học tập"
                    selectedValue={selectedTime}
                    status={reminderStatus}
                    onChangeTime={handleToggleReminder}
                    onToggleStatus={handleToggleReminderStatus}
                />
                )}
            </div>
            <div className="p-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 text-left">Lớp học</h2>
                <p className="text-base font-normal text-gray-600 dark:text-gray-400">
                    Thông báo cho tôi khi học phần hoặc thư mục được thêm vào lớp học
                </p>
                {isLoading ? (
                    <div className="space-y-4 mt-4">
                        {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} height={50} />
                        ))}
                    </div>
                ) : classes.length > 0 ? (
                    classes.map((cls, index) => (
                        <div key={index}>
                            <Class 
                                title={cls.className} 
                                link="#"  
                                reminderStatus={cls.reminderStatus}
                                onToggle={() => handleToggleClassReminder(index)}
                            />                              
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 mt-4">Không có lớp học nào.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationCard;