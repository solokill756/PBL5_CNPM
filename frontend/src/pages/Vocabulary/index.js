import CategoryGrid from "@/components/Vocabulary/CategoryGrid";
import VocabularySearch from "@/components/Vocabulary/VocabularySearch";
import DefaultHeader from "@/layouts/DefaultHeader";
import React, { useEffect, useState, useRef } from "react";
import useVocabularyStore from "@/store/useVocabularyStore";
import VocabularyDetail from "@/components/Vocabulary/VocabularyDetail";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import VocabularyLevel from "@/components/Vocabulary/VocabularyLevel";
import useTopicStore from "@/store/useTopicStore";

const Vocabulary = () => {
  const axios = useAxiosPrivate();
  const initializationRef = useRef(false);
  const lastFocusTime = useRef(Date.now());
  
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
    forceRefreshUserData,
    markNeedsRefresh,
    clearError,
    clearUserData,
    needsRefresh,
  } = useTopicStore();

  const [isInitialized, setIsInitialized] = useState(false);

  const isLoading = loadingStates.initializing || 
                   loadingStates.categories || 
                   loadingStates.userLevel ||
                   loadingStates.refreshing;

  // Window focus listener để detect khi user quay lại từ trang khác
  useEffect(() => {
    const handleWindowFocus = async () => {
      const currentTime = Date.now();
      const timeSinceLastFocus = currentTime - lastFocusTime.current;
      
      // Chỉ refresh nếu user đi xa hơn 10 giây (có thể từ trang test/battle)
      if (timeSinceLastFocus > 10000 && userLevel.user_id && isInitialized) {
        console.log("🔄 User returned after", Math.round(timeSinceLastFocus / 1000), "seconds - refreshing data");
        markNeedsRefresh();
        
        try {
          await forceRefreshUserData(axios);
        } catch (error) {
          console.error("Error refreshing on focus:", error);
        }
      }
      
      lastFocusTime.current = currentTime;
    };

    const handleWindowBlur = () => {
      lastFocusTime.current = Date.now();
    };

    // Add focus/blur listeners
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    
    // Visibility change fallback
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleWindowFocus();
      } else {
        handleWindowBlur();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userLevel.user_id, isInitialized, forceRefreshUserData, markNeedsRefresh, axios]);

  // Single initialization with deduplication
  useEffect(() => {
    if (initializationRef.current) return;
    
    const initialize = async () => {
      try {
        initializationRef.current = true;
        await initializeUserData(axios);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing vocabulary page:", error);
        initializationRef.current = false;
      }
    };

    initialize();

    return () => {
      clearError();
    };
  }, [initializeUserData, axios, clearError]);

  // Handle user change với debouncing
  useEffect(() => {
    const currentUserId = userLevel.user_id;
    
    // Chỉ dùng sessionStorage để detect user change, không store toàn bộ data
    const storedUserId = sessionStorage.getItem('currentUserId');
    
    if (currentUserId && storedUserId && currentUserId !== storedUserId) {
      // User changed, clear old data
      console.log("👤 User changed from", storedUserId, "to", currentUserId);
      clearUserData();
      setIsInitialized(false);
      initializationRef.current = false;
    }
    
    if (currentUserId) {
      sessionStorage.setItem('currentUserId', currentUserId);
    }
  }, [userLevel.user_id, clearUserData]);

  // Auto refresh when marked as needing refresh
  useEffect(() => {
    if (needsRefresh && userLevel.user_id && isInitialized) {
      console.log("🔄 Auto refreshing due to needsRefresh flag");
      forceRefreshUserData(axios);
    }
  }, [needsRefresh, userLevel.user_id, isInitialized, forceRefreshUserData, axios]);

  // Clear search results only once
  useEffect(() => {
    clearResults();
  }, [clearResults]);

  // Show loading while initializing or when no data yet
  if (!isInitialized || (isLoading && categories.length === 0 && !userLevel.user_id)) {
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
            <p className="text-gray-500">
              {loadingStates.refreshing ? "Đang cập nhật dữ liệu..." : "Đang tải dữ liệu..."}
            </p>
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
            <div className="text-red-600 text-lg font-semibold mb-2">
              Có lỗi xảy ra
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setIsInitialized(false);
                initializationRef.current = false;
                clearError();
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
          {userLevel && userLevel.current_level && (
            <VocabularyLevel userLevel={userLevel} />
          )}

          {vocabError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{vocabError}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Duyệt theo chủ đề</h2>
            {isLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-indigo-600 mr-2"></div>
                {loadingStates.refreshing ? "Đang cập nhật..." : "Đang tải..."}
              </div>
            )}
          </div>

          <CategoryGrid
            categories={categories}
            loading={isLoading}
            error={error}
            userLevel={userLevel}
          />
        </div>
      )}
    </main>
  );
};

export default Vocabulary;