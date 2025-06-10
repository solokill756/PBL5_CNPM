import React, { useEffect, useState } from 'react'
import DefaultHeader from '@/layouts/DefaultHeader'
import OptionItem from '@/components/Option/OptionItem'
import CourseInfoComponent from '@/components/ClassCard/ClassCard'
import { fetchRecentClasses } from '@/api/recentClass'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import { IoAddCircleOutline } from "react-icons/io5";
import CreateClassModal from '@/components/Modal/CreateClassModal'
import { useAuthStore } from '@/store/useAuthStore'
import { deleteClass } from '@/api/deleteClass'

const ListClass = () => {
  const axiosPrivate = useAxiosPrivate();
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const user = useAuthStore(state => state.user);

  const handleDeleteClass = async (classId) => {
    try {
      const response = await deleteClass(axiosPrivate, classId);
      setClassData(prevData => 
      prevData.filter(classItem => classItem.class_id !== classId)
    );
    } catch (error) {
     
    }
  };

  useEffect(() => {
    const loadClassData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchRecentClasses(axiosPrivate);
        
        if (data && data.data) {                   
          if (Array.isArray(data.data)) {
            const formattedClasses = data.data.map(item => {
              const canDelete = user && user.id === item.created_by;
              return {
                id: item.id || item.class_id, 
                class_id: item.id || item.class_id,
                listCount: item.listFlashCardCount || item.listCount || 0, 
                studentCount: item.studentCount || item.student_count || 0,
                class_name: item.class_name || item.className || 'Không có tên',
                created_by: item.created_by,
                canDelete: canDelete
              };
            });
            setClassData(formattedClasses);
          } else {
            setClassData([]);
          }
        } else {
          setClassData([]);
        }
        
      } catch (err) {
        console.error('Error loading class data:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
        setClassData([]);
      } finally {
        setLoading(false);
      }
    };

    if (axiosPrivate) {
      loadClassData();
    }
  }, [axiosPrivate, refreshTrigger, user]); 

  return (
    <main className='min-h-screen flex flex-col'>
      <DefaultHeader />
      
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className='text-5xl font-bold text-center mb-4'>
          <span className="text-red-800">
            Thư viện của bạn
          </span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className=" text-red-800 px-4 py-3 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <IoAddCircleOutline size={60} />
        </button>
      </div>       
    </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="bg-whitemb-4">
          <div className="mb-6">
            <OptionItem />
          </div>
          
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-red-800 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800">Danh sách lớp học</h3>
            </div>
            <div className="text-sm text-gray-500">
              {loading ? "Đang tải..." : `${classData.length} lớp học`}
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full ml-4"></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 w-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : classData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lớp học nào</h3>
              <p className="text-gray-500">Bạn chưa tham gia lớp học nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classData.map((classItem) => (
                <div 
                  key={classItem.id}
                  onClick={() => navigate(`/classes/${classItem.class_id}`)} 
                  className="cursor-pointer" 
                >
                  <CourseInfoComponent
                    studentCount={classItem.studentCount}
                    listCount={classItem.listCount}
                    class_name={classItem.class_name}
                    class_id={classItem.class_id}
                    canDelete={classItem.canDelete}
                    onDelete={handleDeleteClass}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CreateClassModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onClassCreated={() => setRefreshTrigger(prev => prev + 1)}/>
    </main>
  );

}

export default ListClass