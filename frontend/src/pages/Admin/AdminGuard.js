import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const AdminGuard = ({ children }) => {
  const { user, accessToken } = useAuthStore();

  // Kiểm tra xác thực
  if (!accessToken) {
    return <Navigate to="/accounts/login" replace />;
  }

  // Kiểm tra user object
  if (!user) {
    return <Navigate to="/accounts/login" replace />;
  }

  // Kiểm tra quyền admin - strict check
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚫</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Truy cập bị từ chối
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn không có quyền truy cập vào khu vực quản trị.
              <br />
              <span className="text-sm text-red-600">
                Role hiện tại: {user?.role || 'Không xác định'}
              </span>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminGuard;