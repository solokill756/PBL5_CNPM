import React, { useEffect, useState } from 'react';
import DefaultHeader from '@/layouts/DefaultHeader';
import InviteActions from '@/components/ClassCard/Invite';
import Options from '@/components/ClassCard/Options';
import ListFlashcard from '@/components/ClassCard/ListFlashcard';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { getClass } from '@/api/getClass';
import AddFlashcardToClass from '@/components/Modal/AddFlashcardToClass';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useAuthStore } from '@/store/useAuthStore';
import { removeFlashcard } from '@/api/removeFlashcard';
const FlashcardSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

const ClassDetail = () => {
  const { classId } = useParams(); 
  const axiosPrivate = useAxiosPrivate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFlashcardOpen, setIsAddFlashcardOpen] = useState(false); 
  // const [subjects, setSubjects] = useState([]);
  const user = useAuthStore(state => state.user);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  const openAddFlashcardModal = () => {
    setIsAddFlashcardOpen(true);
  };

  const closeAddFlashcardModal = () => {
    setIsAddFlashcardOpen(false);
  };

  const handleAddSubject = (subjectId) => {
    // setSubjects(prev => 
    //   prev.map(subject => 
    //     subject.id === subjectId 
    //       ? { ...subject, isAdded: !subject.isAdded }
    //       : subject
    //   )
    // );
     closeAddFlashcardModal();
  };

  const handleCreateNew = () => {
    console.log('Tạo mới học phần');
  };

  const handleNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const fetchClassData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching class data for ID:', classId);
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
    const handleDeleteFlashcard = async (listId) => {

        try {
            await removeFlashcard(axiosPrivate, classId, listId);
            await fetchClassData(); 
            handleNotification('success', 'Đã xóa học phần khỏi lớp học');
        } catch (error) {
            console.error('Error deleting flashcard:', error);
            handleNotification('error', 'Có lỗi xảy ra khi xóa học phần');
        }
    };

    useEffect(() => {
        if (classId) {
            fetchClassData();
        }
    }, [axiosPrivate, classId]);

  if (error) {
    return (
      <main className='min-h-screen flex flex-col'>
        <DefaultHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen flex flex-col'>
      <DefaultHeader />

      {/* Notification */}
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
          {loading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ) : (
            <>
              <h1 className='text-5xl font-bold text-center'>
                <span className="text-red-800">
                  {classData?.class_name || 'Không tìm thấy lớp học'}
                </span>
              </h1>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="flex space-x-4">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ) : (
              <Options />
            )}
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className='flex items-center justify-center gap-4 mb-4'>
                {loading ? (
                  <div className="animate-pulse flex gap-4">
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                ) : (
                  <>
                    <InviteActions onMemberAdded={() => fetchClassData()} />
                   <IoIosAddCircleOutline 
                      size={60} 
                      onClick={openAddFlashcardModal}
                      className='cursor-pointer text-red-700 hover:text-red-800 transition-colors duration-300'
                      />
                  </>
                )}
              </div>             
            </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-red-700 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800">Danh sách học phần</h3>
            </div>
            <div className="text-sm text-gray-500">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ) : (
                `${classData?.lists?.length || 0} học phần`
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-1">
            {loading ? (
              <FlashcardSkeleton />
            ) : (
               <ListFlashcard 
                  lists={classData?.lists} 
                  createdBy={classData?.createdBy}
                  currentUserId={user?.id} 
                  classCreatorId={classData?.createdBy?.user_id}
                  onDeleteFlashcard={handleDeleteFlashcard}
                />
            )}
          </div>
        </div>
      </div>

      <AddFlashcardToClass
        isOpen={isAddFlashcardOpen}
        onClose={closeAddFlashcardModal}
        onAddFlashcard={handleAddSubject}
        onCreateNew={handleCreateNew}
        onSuccess={fetchClassData} 
        onNotification={handleNotification} 
        classId={classId}
      />
    </main>
  );
};

export default ClassDetail;