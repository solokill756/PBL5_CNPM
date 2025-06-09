import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminGuard from './AdminGuard';
import AdminLayout from '@/components/Admin/AdminLayout';

const AdminIndex = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminIndex;