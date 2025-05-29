import CategoryGrid from '@/components/Vocabulary/CategoryGrid';
import VocabularySearch from '@/components/Vocabulary/VocabularySearch';
import DefaultHeader from '@/layouts/DefaultHeader';
import React, { useEffect, useState } from 'react';
import useVocabularyStore from '@/store/useVocabularyStore';
import VocabularyDetail from '@/components/Vocabulary/VocabularyDetail';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import VocabularyLevel from '@/components/Vocabulary/VocabularyLevel';
import useLevelStore from '@/store/useLevelStore';

// Mock enriched categories data
const mockEnrichedCategories = [
  {
    topic_id: 1,
    name: "Cơ bản",
    description: "Từ vựng tiếng Nhật CNTT cơ bản",
    image_url: "https://placehold.co/64x64/indigo/white/png?text=N5",
    required_level: 1,
    total_words: 50,
    mastered_words: 45
  },
  {
    topic_id: 2,
    name: "Lập trình",
    description: "Từ vựng liên quan đến lập trình",
    image_url: "https://placehold.co/64x64/indigo/white/png?text=N4",
    required_level: 2,
    total_words: 40,
    mastered_words: 30
  },
  {
    topic_id: 3,
    name: "Mạng máy tính",
    description: "Từ vựng liên quan đến mạng và CSDL",
    image_url: "https://placehold.co/64x64/indigo/white/png?text=N3",
    required_level: 3,
    total_words: 60,
    mastered_words: 25
  },
  {
    topic_id: 4,
    name: "Điện toán đám mây",
    description: "Thuật ngữ về cloud computing",
    image_url: "https://placehold.co/64x64/indigo/white/png?text=N2",
    required_level: 4,
    total_words: 45,
    mastered_words: 0
  },
  {
    topic_id: 5,
    name: "AI và Big Data",
    description: "Từ vựng về AI, ML và xử lý dữ liệu lớn",
    image_url: "https://placehold.co/64x64/indigo/white/png?text=N1",
    required_level: 5,
    total_words: 55,
    mastered_words: 0
  }
];

const Vocabulary = () => {
  const axios = useAxiosPrivate();
  const { selectedWord, categories, fetchCategories, error } = useVocabularyStore();
  const { getLevelInfo, fetchLevelInfo } = useLevelStore();
  const [enrichedCategories, setEnrichedCategories] = useState([]);
  const [levelInfo, setLevelInfo] = useState(null);

  useEffect(() => {
    fetchCategories(axios);
    
    // Đoạn này sẽ được thay thế bằng API call thực tế
    const loadUserLevel = async () => {
      try {
        // Sử dụng fetchLevelInfo từ useLevelStore để lấy dữ liệu cấp độ
        const info = await fetchLevelInfo(axios);
        setLevelInfo(info);
      } catch (error) {
        console.error('Error loading user level:', error);
      }
    };
    
    loadUserLevel();
  }, [fetchCategories, fetchLevelInfo]);
  
  useEffect(() => {
    // Trong ứng dụng thực tế, sẽ gọi API riêng hoặc kết hợp dữ liệu từ BE
    if (categories && categories.length > 0) {
      // Để demo, dùng dữ liệu mẫu đã làm phong phú
      setEnrichedCategories(mockEnrichedCategories);
    }
  }, [categories]);

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
          {/* User Level Progress Section - Đã tách thành component riêng */}
          {levelInfo && <VocabularyLevel userLevel={levelInfo} />}
          
          <h2 className="text-2xl font-bold mt-8 mb-6">Duyệt theo chủ đề</h2>
          <CategoryGrid 
            error={error} 
            categories={enrichedCategories} 
            userLevel={levelInfo?.level || 1}
          />
        </div>
      )}
    </main>
  );
};

export default Vocabulary;