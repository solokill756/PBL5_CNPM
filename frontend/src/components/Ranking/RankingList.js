import React from 'react';
import RankingItem from './RankingItem';

const RankingList = ({ rankings, isLoading, currentUserId }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!rankings || rankings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏆</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có dữ liệu xếp hạng</h3>
        <p className="text-gray-500">Hãy quay lại sau nhé!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rankings.map((user) => (
        <RankingItem
          key={user.user_id}
          user={user}
          isCurrentUser={user.user_id === currentUserId}
        />
      ))}
    </div>
  );
};

export default RankingList;