import CategoryGrid from "@/components/Vocabulary/CategoryGrid";
import VocabularySearch from "@/components/Vocabulary/VocabularySearch";
import DefaultHeader from "@/layouts/DefaultHeader";
import React, { useEffect, useState, useRef } from "react";
import useVocabularyStore from "@/store/useVocabularyStore";
import VocabularyDetail from "@/components/Vocabulary/VocabularyDetail";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import VocabularyLevel from "@/components/Vocabulary/VocabularyLevel";
import useTopicStore from "@/store/useTopicStore";
import { useLocation } from "react-router-dom";

const Vocabulary = () => {
  const axios = useAxiosPrivate();
  const location = useLocation();
  const {
    selectedWord,
    error: vocabError,
    clearResults,
  } = useVocabularyStore();
  const {
    categories,
    userLevel,
    loadingStates,
    error,
    initializeUserData,
    clearError,
  } = useTopicStore();

  const [isInitializing, setIsInitializing] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const lastLocationKey = useRef(location.key);

  const isLoadingCategories = loadingStates.categories;
  const isLoadingUserLevel = loadingStates.userLevel;
  const isLoading = isLoadingCategories || isLoadingUserLevel;

  useEffect(() => {
    const shouldRefresh = () => {
      return (
        !hasInitialized ||
        lastLocationKey.current !== location.key ||
        categories.length === 0 ||
        !userLevel.user_id
      );
    };

    const initializeData = async () => {
      if (shouldRefresh()) {
        setIsInitializing(true);

        try {
          const forceRefresh =
            lastLocationKey.current !== location.key ||
            categories.length === 0 ||
            !userLevel.user_id;

          await initializeUserData(axios, forceRefresh);
          setHasInitialized(true);
          lastLocationKey.current = location.key;
        } catch (error) {
          console.error("Error initializing vocabulary page:", error);
        } finally {
          setIsInitializing(false);
        }
      } else {
        setIsInitializing(false);
      }
    };

    initializeData();

    return () => {
      clearError();
    };
  }, [
    location.key,
    axios,
    categories.length,
    userLevel.user_id,
    hasInitialized,
  ]);

  useEffect(() => {
    if (
      location.pathname === "/vocabulary" &&
      !location.pathname.includes("/vocabulary/")
    ) {
      clearResults();
    }
  }, [location.pathname, clearResults]);

  if (isInitializing || (isLoading && categories.length === 0)) {
    return (
      <main className="flex flex-col items-center flex-grow scrollbar-hide">
        <DefaultHeader />
        <h1 className="text-4xl font-bold text-center mt-8 mb-4">
          Tìm trên ITKotoba
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Học từ vựng tiếng Nhật cùng ITKotoba
        </p>

        <VocabularySearch />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600 mx-auto mb-4"></div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="flex flex-col items-center flex-grow scrollbar-hide">
        <DefaultHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Có lỗi xảy ra
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setHasInitialized(false);
                setIsInitializing(true);
                initializeUserData(axios, true);
              }}
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

      <h1 className="text-4xl font-bold text-center mt-8 mb-4">
        Tìm trên ITKotoba
      </h1>
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
          {/* Loading indicator cho user level */}
          {isLoadingUserLevel ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            userLevel &&
            userLevel.current_level && <VocabularyLevel userLevel={userLevel} />
          )}

          {vocabError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{vocabError}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Duyệt theo chủ đề</h2>
            {isLoadingCategories && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-indigo-600 mr-2"></div>
                Đang cập nhật...
              </div>
            )}
          </div>

          <CategoryGrid
            categories={categories}
            loading={isLoadingCategories}
            error={error}
            userLevel={userLevel}
          />
        </div>
      )}
    </main>
  );
};

export default Vocabulary;
