import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMenu,
  IoClose,
  IoHome,
  IoPeople,
  IoLibrary,
  IoBook,
  IoStatsChart,
  IoLogOut,
  IoSettings,
} from "react-icons/io5";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: IoHome,
      label: "Dashboard",
      color: "text-blue-600",
    },
    {
      path: "/admin/users",
      icon: IoPeople,
      label: "Quản lý người dùng",
      color: "text-green-600",
    },
    {
      path: "/admin/topics",
      icon: IoLibrary,
      label: "Quản lý chủ đề",
      color: "text-purple-600",
    },
    {
      path: "/admin/vocabularies",
      icon: IoBook,
      label: "Quản lý từ vựng",
      color: "text-orange-600",
    },
    {
      path: "/admin/analytics",
      icon: IoStatsChart,
      label: "Thống kê",
      color: "text-red-600",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/accounts/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={() => setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Đóng menu sidebar"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSidebarOpen(false);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed cho mobile, static cho desktop */}
      <aside
        className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        fixed lg:sticky
        inset-y-0 lg:top-0 left-0 z-40
        w-64 h-screen lg:h-screen
        bg-white shadow-xl border-r border-gray-200
        transition-transform duration-300 ease-in-out
        flex flex-col
        overflow-hidden
      `}
        role="navigation"
        aria-label="Menu điều hướng admin"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
          {/* Mobile hamburger button */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Mở menu sidebar"
              aria-label="Mở menu sidebar"
            >
              <IoMenu className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Đóng menu sidebar"
            aria-label="Đóng menu sidebar"
          >
            <IoClose className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 mt-6 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" role="menu">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-xl text-left
                transition-all duration-200 group
                ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }
              `}
              title={item.label}
              aria-label={`Điều hướng đến ${item.label}`}
              role="menuitem"
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive(item.path)
                    ? item.color
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
                aria-hidden="true"
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={user?.profile_picture || "/default-avatar.png"}
              alt={`Ảnh đại diện của ${user?.full_name || "Admin"}`}
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.full_name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center space-x-1 px-3 py-2 text-xs text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              title="Về trang chủ"
              aria-label="Về trang chủ"
            >
              <IoSettings className="w-3 h-3" aria-hidden="true" />
              <span>Trang chủ</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-1 px-3 py-2 text-xs text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
              title="Đăng xuất khỏi hệ thống"
              aria-label="Đăng xuất khỏi hệ thống"
            >
              <IoLogOut className="w-3 h-3" aria-hidden="true" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Mở menu sidebar"
                aria-label="Mở menu sidebar"
              >
                <IoMenu className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </button>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                  {menuItems.find((item) => isActive(item.path))?.label ||
                    "Admin Panel"}
                </h1>
                <p className="text-sm text-gray-500">
                  Quản lý hệ thống học từ vựng
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <img
                src={user?.profile_picture || "/default-avatar.png"}
                alt={`Ảnh đại diện của ${user?.full_name || "Administrator"}`}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* Page Content - Sử dụng Outlet thay vì children */}
        <main 
          className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto relative z-10"
          role="main"
          aria-label="Nội dung chính"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;