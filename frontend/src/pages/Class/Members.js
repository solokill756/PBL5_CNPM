import React, {useState, useEffect} from 'react'
import DefaultHeader from '@/layouts/DefaultHeader'
import InviteActions from '@/components/ClassCard/Invite'
import Options from '@/components/ClassCard/Options'
import { useParams, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { getClass } from '@/api/getClass'
import { MdDeleteOutline } from "react-icons/md"
import { deleteMember } from '@/api/deleteMember'

const Members = () => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const axiosPrivate = useAxiosPrivate();
  const { classId } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const showCustomNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const fetchClassData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getClass(axiosPrivate, classId);
        console.log('Received class data:', response);
        
        setClassData(response);
      } catch (err) {
        console.error('Error fetching class data:', err);
        setError(err.message || 'Failed to load class data');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (classId) {
        fetchClassData();
      }
    }, [axiosPrivate, classId]);
    
    const users = classData?.members;
    const createdBy = classData?.created_by;

    const handleDeleteMember = async () => {
      try {
        await deleteMember(axiosPrivate);
        await fetchClassData();
        
        showCustomNotification('Đã xóa thành viên thành công!', 'success');
      } catch (error) {
        console.error('Error deleting member:', error);
        
        showCustomNotification('Có lỗi xảy ra khi xóa thành viên. Vui lòng thử lại!', 'error');
      }
    };
     
  return (
    <main className='min-h-screen flex flex-col'>
      <DefaultHeader />

      {/* Custom Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notificationType === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">
                {notificationType === 'success' ? '✓' : '✕'}
              </span>
              <span className="font-medium">
                {notificationType === 'success' ? 'Thành công' : 'Lỗi'}
              </span>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <p className="text-sm mt-1">{notificationMessage}</p>
        </div>
      )}

      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center mb-8">
           <h1 className='text-5xl font-bold text-center'>
              <span className="text-red-800">
                {classData?.class_name || 'Kanji N2'}
              </span>
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <Options
            />
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className='flex items-center justify-center mb-4'>
                  <InviteActions onMemberAdded={() => fetchClassData()} />
              </div>
              
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {users && users.length > 0 ? (
              users.map((member) => {
                const isAdmin = member.User?.user_id === createdBy;
                
                return (
                  <div key={member.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="relative mr-4">
                      {member.User?.profile_picture ? (
                        <img 
                          className="w-10 h-10 rounded-full object-cover" 
                          src={member.User.profile_picture}
                          alt={member.User?.username || 'User avatar'}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                          {member.User?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 font-medium text-sm">
                            {member.User?.username || 'Unknown User'}
                          </span>
                          {isAdmin && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                              Quản trị viên lớp học
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 text-xs">
                          {member.User?.email}
                        </span>
                      </div>
                    </div>
                    <MdDeleteOutline 
                      className="text-gray-400 hover:text-red-500 cursor-pointer size-6"
                      onClick={() => handleDeleteMember(member.User?.user_id, member.User?.username)}
                    />
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">
                {loading ? 'Đang tải...' : 'Không có thành viên nào'}
              </div>
            )}
        </div>
      </div>
    </main>
  )
}

export default Members;