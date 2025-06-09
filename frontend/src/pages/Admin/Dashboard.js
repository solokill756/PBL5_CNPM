import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IoPeople, 
  IoLibrary, 
  IoBook, 
  IoTrendingUp,
  IoEye,
  IoAdd,
  IoArrowUp,
  IoArrowDown
} from 'react-icons/io5';
import useAdminStore from '@/store/useAdminStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const Dashboard = () => {
  const axios = useAxiosPrivate();
  const { 
    users, 
    topics, 
    vocabularies, 
    loading,
    fetchDashboardData 
  } = useAdminStore();

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalTopics: 0,
    totalVocabularies: 0,
    activeUsers: 0,
  });

  // Debug logs
  console.log('Dashboard component rendering');
  console.log('Dashboard - users:', users);
  console.log('Dashboard - loading:', loading);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Dashboard: Starting to load data...');
        const data = await fetchDashboardData(axios);
        console.log('Dashboard: Data loaded:', data);
        
        // Calculate stats
        const totalUsers = data.users.length;
        const activeUsers = data.users.filter(user => !user.is_blocked).length;
        const totalTopics = data.topics.length;
        const totalVocabularies = data.vocabularies.length;

        setDashboardStats({
          totalUsers,
          totalTopics,
          totalVocabularies,
          activeUsers,
        });
      } catch (error) {
        console.error('Dashboard error:', error);
      }
    };

    loadDashboardData();
  }, [axios, fetchDashboardData]);

  if (loading.users || loading.topics || loading.vocabularies) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Chào mừng quay trở lại Admin!</h2>
        <p className="text-blue-100">
          Quản lý hệ thống học từ vựng hiệu quả và theo dõi hoạt động người dùng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IoPeople className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalUsers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <IoLibrary className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chủ đề</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalTopics}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <IoBook className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Từ vựng</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalVocabularies}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <IoTrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Người dùng hoạt động</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.activeUsers}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Hành động nhanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/admin/users'}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <IoPeople className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">Quản lý người dùng</h4>
                <p className="text-blue-600 text-sm">Xem và quản lý tài khoản</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/admin/topics'}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <IoLibrary className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="font-medium text-purple-800">Quản lý chủ đề</h4>
                <p className="text-purple-600 text-sm">Tạo và chỉnh sửa chủ đề</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/admin/vocabularies'}
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <IoBook className="w-8 h-8 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-800">Quản lý từ vựng</h4>
                <p className="text-orange-600 text-sm">Thêm và sửa từ vựng</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;