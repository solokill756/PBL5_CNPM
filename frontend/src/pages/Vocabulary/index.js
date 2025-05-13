import CategoryGrid from '@/components/Vocabulary/CategoryGrid';
import VocabularySearch from '@/components/Vocabulary/VocabularySearch';
import DefaultHeader from '@/layouts/DefaultHeader';
import React, { useEffect } from 'react'
import useVocabularyStore from '@/store/useVocabularyStore';
import VocabularyDetail from '@/components/Vocabulary/VocabularyDetail';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';

const Vocabulary = () => {
  const axios = useAxiosPrivate();
  const { word } = useParams();
  const { selectedWord, categories, setSelectedWord, fetchCategories, searchVocabulary, setSearchTerm, closeSearchModal, searchResults, loading, error } = useVocabularyStore();

  useEffect(() => {
    fetchCategories(axios);
  }, [fetchCategories]);

  useEffect(() => {
    const handleWordParam = async () => {
      if (word) {
        const decodedWord = decodeURIComponent(word);
        setSearchTerm(decodedWord);
        
        // try {
        //   await searchVocabulary(axios, decodedWord);
        //   // Đợi searchVocabulary hoàn thành và kiểm tra kết quả
        //   if (searchResults && searchResults.length > 0) {
        //     setSelectedWord(searchResults[0]);
        //   }
        // } catch (error) {
        //   console.error('Error searching vocabulary:', error);
        // }

        // // Đóng modal sau khi xử lý xong
        // setTimeout(() => {
        //   closeSearchModal();
        // }, 0);
      }
    };

    handleWordParam();
  }, [word]);

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
        <div className="mt-12 max-w-full w-full px-10">
          <h2 className="text-2xl font-bold mb-6">Duyệt theo chủ đề</h2>
          <CategoryGrid error={error} categories={categories} />
        </div>
      )}
    </main>
  )
}

export default Vocabulary;
