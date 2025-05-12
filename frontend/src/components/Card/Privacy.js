
import React, { useState, useEffect } from 'react'
import Delete from '../CardItems/Delete'
import UpdatePass from '../CardItems/UpdatePass'
import { updateProfile } from '@/api/updateProfile';
import useAxiosPrivate from '@/hooks/useAxiosPrivate'; 
import { useAuthStore } from '@/store/useAuthStore';
import { deleteAccount } from '@/api/deleteAccount';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Privacy = () => {
    const axiosPrivate = useAxiosPrivate();
    const updateUser = useAuthStore((state) => state.updateUser);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

     useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []); 

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handlePasswordUpdate = async (newPassword, confirmPassword, full_name, username, progile_picture) => {
        if (newPassword !== confirmPassword) {
            showNotification('Mật khẩu không khớp', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showNotification('Mật khẩu phải có ít nhất 8 ký tự', 'error');
            return;
        }
        try {
            setIsLoading(true);
            const response = await updateProfile(
                axiosPrivate,
                full_name,
                username,
                progile_picture,
                newPassword
            );
            updateUser({ password: true });
            showNotification('Mật khẩu đã được cập nhật thành công!', 'success');
            console.log("Password updated:", response);
        } catch (error) {
            console.error('Lỗi khi cập nhật mật khẩu:', error);
            if (error.response) {
                const errorMessage = error.response.data?.message 
                    || error.response.data?.error 
                    || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.';
                showNotification(errorMessage, 'error');
            } else if (error.request) {
                showNotification('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối.', 'error');
            } else {
                showNotification('Đã xảy ra lỗi khi gửi yêu cầu.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccountDelete = async () => {
        try {
            setIsLoading(true);
            const response = await deleteAccount(axiosPrivate);
            showNotification('Tài khoản đã được xóa thành công', 'success');
            console.log('Delete response:', response);
        } catch (error) {
            console.error('Lỗi khi xóa tài khoản:', error);
            showNotification('Không thể xóa tài khoản. Vui lòng thử lại.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
                  {notification.show && (
                      <div className={`m-4 p-3 rounded ${
                        notification.type === 'success' 
                          ? 'bg-green-100 text-green-700 border border-green-400' 
                          : 'bg-red-100 text-red-700 border border-red-400'
                      }`}>
                        {notification.message}
                      </div>
                    )}

            <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
                <div className='p-6 border-b-2 border-gray-200'>
                    {isLoading ? (
                        <Skeleton height={200} />
                    ) : (
                        <UpdatePass 
                            title="Cập nhật mật khẩu" 
                            infor="Thay đổi mật khẩu tài khoản của bạn"
                            operation="Cập nhật" 
                            confirm="Cập nhật mật khẩu"
                            note="Cập nhật mật khẩu cho tài khoản của bạn"
                            onSave={handlePasswordUpdate}
                            disabled={isLoading}
                        />
                    )}
                </div>
                <div className='p-6'>
                    {isLoading ? (
                        <Skeleton height={120} />
                    ) : (
                        <Delete
                            title="Xóa tài khoản của bạn"
                            infor="Thao tác này sẽ xóa tất cả dữ liệu của bạn và không thể hoàn tác."
                            operation="Xoá tài khoản"
                            confirm="Bạn muốn xoá tài khoản vĩnh viễn?"
                            agree="Xoá"
                            onDelete={handleAccountDelete}
                            disabled={isLoading}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Privacy
