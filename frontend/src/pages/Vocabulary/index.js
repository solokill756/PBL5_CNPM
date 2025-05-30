import CategoryGrid from '@/components/Vocabulary/CategoryGrid';
import VocabularySearch from '@/components/Vocabulary/VocabularySearch';
import DefaultHeader from '@/layouts/DefaultHeader';
import React, { useEffect, useState } from 'react';
import useVocabularyStore from '@/store/useVocabularyStore';
import VocabularyDetail from '@/components/Vocabulary/VocabularyDetail';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import VocabularyLevel from '@/components/Vocabulary/VocabularyLevel';
import useTopicStore from '@/store/useTopicStore';

const Vocabulary = () => {
  const axios = useAxiosPrivate();
  const { selectedWord, error: vocabError } = useVocabularyStore();
  const { 
    categories, 
    userLevel, 
    loading, 
    error, 
    initializeUserData,
    clearError 
  } = useTopicStore();

  useEffect(() => {
    initializeUserData(axios, false);
    
    return () => {
      clearError();
    };
  }, []);

  if (loading && categories.length === 0) {
    return (
      <main className="flex flex-col items-center flex-grow scrollbar-hide">
        <DefaultHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center flex-grow scrollbar-hide">
        <DefaultHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 text-lg font-semibold mb-2">Có lỗi xảy ra</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => initializeUserData(axios)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide">
      <DefaultHeader />

      <h1 className="text-4xl font-bold text-center mt-8 mb-4">Tìm trên ITKotoba</h1>
      <p className="text-center text-gray-600 mb-8">
        Học từ vựng tiếng Nhật cùng ITKotoba
      </p>
      
      <VocabularySearch />
      
      {selectedWord ? (
        <div className="mt-8 max-w-full w-full px-10">
          <VocabularyDetail />
        </div>
      ) : (
        <div className="mt-8 max-w-full w-full px-10">
          {userLevel && userLevel.current_level && (
            <VocabularyLevel userLevel={userLevel} />
          )}
          
          {vocabError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{vocabError}</p>
            </div>
          )}
          
          <h2 className="text-2xl font-bold mt-8 mb-6">Duyệt theo chủ đề</h2>
          <CategoryGrid 
            categories={categories} 
            loading={loading}
            error={error}
            userLevel={userLevel}
          />
        </div>
      )}
    </main>
  );
};

export default Vocabulary;