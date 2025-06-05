import React from 'react';
import { Users, MapPin, GraduationCap } from 'lucide-react';

const CourseInfoComponent = (studentCount, ) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      {/* Header với thông tin cơ bản */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800">4 học phần</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-lg font-semibold text-gray-800">5 thành viên</span>
          </div>
        </div>
      </div>

      {/* Thông tin trường và địa điểm */}
      <div className="flex items-center space-x-2 text-gray-600 mb-4">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">Bách Khoa Đà Nẵng • Đà Nẵng, Việt Nam</span>
      </div>

      {/* Lớp học */}
      <div className="flex items-center space-x-2">
        <GraduationCap className="w-5 h-5 text-blue-600" />
        <span className="text-xl font-bold text-blue-600">Lớp N3</span>
      </div>
    </div>
  );
};

export default CourseInfoComponent;