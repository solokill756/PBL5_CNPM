import React from 'react';
import { IoTrophy, IoRefresh } from 'react-icons/io5';

const RankingHeader = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg">
          <IoTrophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bảng xếp hạng</h1>
          <p className="text-gray-600">Cùng nhau tiến bộ mỗi ngày</p>
        </div>
      </div>
      
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <IoRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">Làm mới</span>
      </button>
    </div>
  );
};

export default RankingHeader;