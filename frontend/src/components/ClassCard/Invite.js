import React, { useState } from 'react';
import { MdOutlineAttachEmail, MdLink } from "react-icons/md";
import { FiEdit, FiCheckCircle } from "react-icons/fi";
import Modal from '../CardItems/Modal';
import { addMember } from '@/api/addMember';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';

const InviteActions = ({onMemberAdded}) => {
  const { classId } = useParams(); 
  const axiosPrivate = useAxiosPrivate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); 
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailInvite = () => {
    setIsModalOpen(true);
    setEmailError('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotificationMessage('Đã sao chép liên kết!', 'success');
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    setEmailError('');
    
    if (!emailValue.trim()) {
      setEmailError('Vui lòng nhập email');
      return;
    }

    if (!validateEmail(emailValue)) {
      setEmailError('Email không hợp lệ');
      return;
    }

    try {
      setIsLoading(true);
      
      await addMember(axiosPrivate, classId, emailValue);
      
      showNotificationMessage(`Đã gửi lời mời tới ${emailValue} thành công!`, 'success');
      setIsModalOpen(false);
      setEmailValue('');
      if (onMemberAdded) {
        onMemberAdded();
      }
      
    } catch (error) {
      console.error('Error adding member:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi gửi lời mời';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setEmailError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmailValue('');
    setEmailError('');
  };

  return (
    <>
      <div className="flex gap-4 w-full max-w-2xl">
        <button
          onClick={handleEmailInvite}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <MdOutlineAttachEmail size={20} />
          Mời bằng email
        </button>
        
        <button
          onClick={handleCopyLink}
          className="flex-1 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <MdLink size={20} />
          Chép liên kết
        </button>
      </div>

      {showNotification && (
        <div className={`fixed top-4 right-6 border px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in ${
          notificationType === 'success' 
            ? 'bg-green-100 text-green-700 border-green-400' 
            : 'bg-red-100 text-red-700 border-red-400'
        }`}>
          <FiCheckCircle size={16} />
          <span>{notificationMessage}</span>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <FiEdit className="text-xl text-gray-700" />
          <h2 className="text-xl font-bold text-gray-800">Mời bằng email</h2>
        </div>

        <p className="mb-4 text-md font-normal text-gray-500">
          Nhập địa chỉ email để gửi lời mời tham gia khóa học
        </p>

        <div className="mb-4">
          <input
            type="email"
            value={emailValue}
            onChange={(e) => {
              setEmailValue(e.target.value);
              if (emailError) setEmailError(''); 
            }}
            placeholder="Nhập địa chỉ email..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              emailError 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isLoading}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div className="flex flex-row gap-4 justify-center">
          <button
            onClick={handleCloseModal}
            className="bg-white text-gray-500 border border-gray-300 hover:bg-gray-200 px-4 py-2 rounded-full hover:opacity-90 transition"
            disabled={isLoading}
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            className="bg-red-800 text-white hover:bg-red-700 px-4 py-2 rounded-full hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            disabled={isLoading}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi lời mời'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default InviteActions;