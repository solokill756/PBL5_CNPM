import React, { useEffect } from 'react';
import DefaultHeader from '@/layouts/DefaultHeader';
import useRankingStore from '@/store/useRankingStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import RankingHeader from '@/components/Ranking/RankingHeader';
import TimeFilter from '@/components/Ranking/TimeFilter';
import CurrentUserCard from '@/components/Ranking/CurrentUserCard';
import RankingList from '@/components/Ranking/RankingList';

const Ranking = () => {
  const axios = useAxiosPrivate();
  
  const {
    rankings,
    currentUserRank,
    timeFilter,
    loadingStates,
    error,
    setTimeFilter,
    fetchRankings,
    refreshRankings,
    clearError,
  } = useRankingStore();

  // Initialize rankings on component mount
  useEffect(() => {
    fetchRankings();
    
    return () => {
      clearError();
    };
  }, []);

  const handleRefresh = () => {
    refreshRankings();
  };

  const handleFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  if (error) {
    return (
      <main className="flex flex-col items-center flex-grow scrollbar-hide">
        <DefaultHeader />
        <div className="w-full max-w-4xl mx-auto px-6 py-8">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="text-red-600 text-xl font-semibold mb-2">
              Có lỗi xảy ra
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchRankings(axios);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide bg-gray-50 min-h-screen">
      <DefaultHeader />
      
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <RankingHeader 
          onRefresh={handleRefresh}
          isRefreshing={loadingStates.refreshing}
        />

        {/* Time Filter */}
        <TimeFilter 
          currentFilter={timeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Current User Card */}
        <CurrentUserCard 
          currentUser={currentUserRank}
          isLoading={loadingStates.rankings && !rankings.length}
        />

        {/* Rankings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Bảng xếp hạng
            </h2>
            {loadingStates.refreshing && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                Đang cập nhật...
              </div>
            )}
          </div>

          <RankingList 
            rankings={rankings}
            isLoading={loadingStates.rankings}
            currentUserId={currentUserRank?.user_id}
          />
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Bảng xếp hạng được cập nhật mỗi 30 giây</p>
          <p className="mt-1">Hãy tiếp tục học tập để cải thiện thứ hạng của bạn! 🚀</p>
        </div>
      </div>
    </main>
  );
};

export default Ranking;