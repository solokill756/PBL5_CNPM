import React from 'react';
import { IoBook, IoLibrary, IoTrendingUp } from 'react-icons/io5';

const RankingItem = ({ user, isCurrentUser }) => {
  const getRankDisplay = (rank) => {
    if (rank <= 3) {
      const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
      return (
        <div className="text-2xl">
          {medals[rank]}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-gray-600">#{rank}</span>
      </div>
    );
  };

  const getLevelColor = (level) => {
    if (level >= 10) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (level >= 7) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (level >= 5) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (level >= 3) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${
      isCurrentUser 
        ? 'bg-blue-50 border-blue-200 shadow-sm' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="flex-shrink-0">
          {getRankDisplay(user.rank)}
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.profile_picture || '/default-avatar.png'}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">
              {user.full_name || user.username}
            </h3>
            {isCurrentUser && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Bạn
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(user.level)}`}>
              Level {user.level}
            </span>
            <div className="flex items-center gap-1">
              <IoBook className="w-3 h-3" />
              <span>{user.words_mastered}</span>
            </div>
            <div className="flex items-center gap-1">
              <IoLibrary className="w-3 h-3" />
              <span>{user.topics_completed}</span>
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-gray-800">
            {user.total_points.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">điểm</div>
        </div>
      </div>
    </div>
  );
};

export default RankingItem;