import React from 'react';
import { IoTrendingUp, IoBook, IoLibrary } from 'react-icons/io5';

const CurrentUserCard = ({ currentUser, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-center">
        <p className="text-gray-500">Bạn chưa có trong bảng xếp hạng</p>
        <p className="text-sm text-gray-400 mt-1">Hãy học tập để xuất hiện trên bảng!</p>
      </div>
    );
  }

  const getRankDisplay = (rank) => {
    if (rank <= 3) {
      const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
      return medals[rank];
    }
    return `#${rank}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.profile_picture || '/default-avatar.png'}
              alt={currentUser.username}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              {getRankDisplay(currentUser.rank)}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800">{currentUser.full_name || currentUser.username}</h3>
            <p className="text-blue-600 font-medium">Hạng {currentUser.rank} • Level {currentUser.level}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{currentUser.total_points.toLocaleString()}</div>
          <div className="text-sm text-gray-500">điểm</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center gap-2">
          <IoBook className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">{currentUser.words_mastered} từ đã học</span>
        </div>
        <div className="flex items-center gap-2">
          <IoLibrary className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">{currentUser.topics_completed} chủ đề hoàn thành</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentUserCard;