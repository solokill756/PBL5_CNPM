import React, { useState, useEffect } from 'react';
import Infor from '../CardItems/Infor';
import ProfileImge from '../CardItems/ProfileImg';
import { getProfile } from '@/api/getProfile';
import { updateProfile } from '@/api/updateProfile';
import useAxiosPrivate from '@/hooks/useAxiosPrivate'; 
import { useAuthStore } from '@/store/useAuthStore';
import { uploadFile } from '@/api/uploadFile';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const Card = () => {
  const axiosPrivate = useAxiosPrivate();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    profile_picture: '',
    full_name: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getProfile();
        if (data && data.username && data.email) {
          setUserData({
            username: data.username || '',
            email: data.email || '',
            profile_picture: data.profile_picture || '',
            full_name: data.full_name || ''
          });
        } else {
          showNotification("Dữ liệu không hợp lệ", "error");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        showNotification("Không thể tải thông tin người dùng", "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleFieldChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveField = async (field) => {
    try {
      setIsLoading(true);
      const response = await updateProfile(
        axiosPrivate,
        field === 'full_name' ? userData.full_name : undefined,
        field === 'username' ? userData.username : undefined,
        field === 'profile_picture' ? userData.profile_picture : undefined
      );

      if (field === 'username') {
        updateUser({ username: userData.username });
      } else if (field === 'full_name') {
        updateUser({ full_name: userData.full_name });
      } else if (field === 'profile_picture') {
        updateUser({ profile_picture: userData.profile_picture });
      }
      
      showNotification(`${field === 'username' ? 'Tên người dùng' : 'Tên'} đã được cập nhật thành công!`, "success");
      console.log("Profile updated:", response);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      showNotification(`Không thể cập nhật ${field === 'username' ? 'tên người dùng' : 'Tên'}. Vui lòng thử lại.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

const handleAvatarUpload = async (image) => {
  try {
    setIsLoading(true);
    const uploadedImageUrl = await uploadFile(axiosPrivate, image); 
    setUserData(prev => ({
      ...prev,
      profile_picture: uploadedImageUrl
    }));
    updateUser({
      username: userData.username,
      full_name: userData.full_name,
      profile_picture: uploadedImageUrl
    });
    showNotification("Ảnh đại diện đã được cập nhật!", "success");
  } catch (error) {
    console.error("Không thể cập nhật ảnh:", error);
    showNotification("Không thể cập nhật ảnh. Vui lòng thử lại.", "error");
  } finally {
    setIsLoading(false);
  }
};


  const cardFields = [
    {
      field: 'username',
      title: "Tên người dùng",
      infor: userData.username,
      confirm: "Đổi tên người dùng",
      note: "Tên người dùng của bạn chỉ có thể được thay đổi một lần",
      type: "text",
      placeholder: "Nhập tên người dùng mới"
    },
    {
      field: 'full_name',
      title: "Tên",
      infor: userData.full_name,
      confirm: "Đổi tên",
      note: "Nhập tên mới",
      type: "text",
      placeholder: "Nhập tên mới"
    },
  ];
  
  return (
    <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
      {notification.show && (
        <div className={`m-4 p-3 rounded ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-400' 
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {notification.message}
        </div>
      )}

      <div className='border-b-2 p-6'>
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton circle width={96} height={96} />
            <div className="flex flex-col gap-2">
              <Skeleton width={150} height={20} />
              <Skeleton width={100} height={16} />
            </div>
          </div>
        ) : (
          <ProfileImge 
            src={userData.profile_picture} 
            fullName={userData.full_name} 
            onAvatarUploaded={handleAvatarUpload}
          />
        )}
      </div>

      <div>
        {cardFields.map((field, index) => (
          <div
            key={index}
            className={`p-6 ${index !== cardFields.length - 1 ? 'border-b-2 border-gray-200' : ''}`}
          >
            {isLoading ? (
              <div>
                <Skeleton width={150} height={20} style={{ marginBottom: '0.5rem' }} />
                <Skeleton height={40} width="100%" />
                <Skeleton width={200} height={16} style={{ marginTop: '0.5rem' }} />
              </div>
            ) : (
              <Infor 
                title={field.title} 
                infor={field.infor} 
                confirm={field.confirm} 
                note={field.note} 
                type={field.type} 
                value={userData[field.field]}
                onchange={(e) => handleFieldChange(field.field, e.target.value)}
                placeholder={field.placeholder}
                onSave={() => handleSaveField(field.field)}
                isLoading={isLoading}
                operation="Sửa" 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
