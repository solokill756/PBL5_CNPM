import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoSearch, 
  IoFilter, 
  IoEye, 
  IoCheckmarkCircle,
  IoClose,
  IoPeople,
  IoMail,
  IoCalendar,
  IoShield,
  IoBan
} from 'react-icons/io5';
import useAdminStore from '@/store/useAdminStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import DefaultAvatar from '@/assets/images/avatar.jpg';
import { useToast, TOAST_TYPES } from '@/context/ToastContext';

const UserStatusBadge = ({ isBlocked, isActive }) => {
  if (isBlocked) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <IoBan className="w-3 h-3 mr-1" />
        Bị chặn
      </span>
    );
  }
  
  if (isActive) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <IoCheckmarkCircle className="w-3 h-3 mr-1" />
        Hoạt động
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      <IoClose className="w-3 h-3 mr-1" />
      Chưa kích hoạt
    </span>
  );
};

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Chi tiết người dùng</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <img
                src={user.profile_picture || DefaultAvatar}
                alt={user.full_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
              />
              <div>
                <h4 className="text-xl font-semibold text-gray-800">{user.full_name}</h4>
                <p className="text-gray-600">@{user.username}</p>
                <UserStatusBadge isBlocked={user.is_blocked} isActive={user.verified} />
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <IoMail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-gray-800">{user.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <IoCalendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Ngày tạo</span>
                </div>
                <p className="text-gray-800">
                  {new Date(user.datetime_joined).toLocaleDateString('vi-VN')}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <IoShield className="w-4 h-4" />
                  <span className="text-sm font-medium">Vai trò</span>
                </div>
                <p className="text-gray-800">{user.role || 'User'}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <IoPeople className="w-4 h-4" />
                  <span className="text-sm font-medium">Trạng thái</span>
                </div>
                <p className="text-gray-800">
                  {user.verified ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                </p>
              </div>
            </div>

            {/* Learning Stats */}
            {/* {user.learning_stats && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3">Thống kê học tập</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{user.learning_stats.total_points || 0}</p>
                    <p className="text-sm text-gray-600">Điểm</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{user.learning_stats.current_level || 1}</p>
                    <p className="text-sm text-gray-600">Level</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{user.learning_stats.words_mastered || 0}</p>
                    <p className="text-sm text-gray-600">Từ đã học</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{user.learning_stats.topics_completed || 0}</p>
                    <p className="text-sm text-gray-600">Chủ đề</p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Users = () => {
  const axios = useAxiosPrivate();
  const { addToast } = useToast();
  const {
    users,
    loading,
    filters,
    fetchUsers,
    blockUser,
    unblockUser,
    getUserById,
    updateFilter
  } = useAdminStore();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      await fetchUsers(axios, {
        search: searchTerm,
        status: statusFilter
      });
    } catch (error) {
      addToast('Lỗi khi tải danh sách người dùng', TOAST_TYPES.ERROR);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    updateFilter('users', { search: e.target.value });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    updateFilter('users', { status });
  };

  const handleViewUser = async (userId) => {
    try {
      const user = await getUserById(axios, userId);
      setSelectedUser(user);
      setShowUserModal(true);
    } catch (error) {
      addToast('Lỗi khi tải thông tin người dùng', TOAST_TYPES.ERROR);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await unblockUser(axios, userId);
        addToast('Đã bỏ chặn người dùng thành công', TOAST_TYPES.SUCCESS);
      } else {
        await blockUser(axios, userId);
        addToast('Đã chặn người dùng thành công', TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      addToast('Lỗi khi thực hiện hành động', TOAST_TYPES.ERROR);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !user.is_blocked) ||
                         (statusFilter === 'blocked' && user.is_blocked);

    return matchesSearch && matchesStatus;
  });

  if (loading.users) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc username..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <IoFilter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Bị chặn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IoPeople className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <IoCheckmarkCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hoạt động</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => !u.is_blocked).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <IoBan className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bị chặn</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.is_blocked).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.user_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profile_picture || DefaultAvatar}
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.full_name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-800">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserStatusBadge isBlocked={user.is_blocked} isActive={user.verified} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewUser(user.user_id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <IoEye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleBlockUser(user.user_id, user.is_blocked)}
                        disabled={loading.userAction}
                        className={`p-2 rounded-lg transition-colors ${
                          user.is_blocked
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                        } disabled:opacity-50`}
                        title={user.is_blocked ? 'Bỏ chặn' : 'Chặn người dùng'}
                      >
                        {user.is_blocked ? (
                          <IoCheckmarkCircle className="w-4 h-4" />
                        ) : (
                          <IoBan className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <IoPeople className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default Users;