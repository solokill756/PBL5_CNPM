import React, { useEffect, useRef } from 'react';
import DropdownDefault from '@/components/DropdownDefault';
import { IoLanguage, IoSearch } from "react-icons/io5";
import useVocabularyStore from '@/store/useVocabularyStore';
import SearchResult from './SearchResult';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';

const VocabularySearch = () => {
  const {
    searchTerm,
    translationType,
    setSearchTerm,
    setSelectedWord,
    setTranslationType,
    searchVocabulary,
    lastSearchWasAI,
    isSearchModalOpen: isOpen,
    closeSearchModal,
    openSearchModal,
  } = useVocabularyStore();

  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { word } = useParams();
  const searchTimeout = useRef(null);
  const searchContainerRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        closeSearchModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSearchModal]);

  // Handle URL parameters
  useEffect(() => {
    if (word) {
      const decodedWord = decodeURIComponent(word);
      setSearchTerm(decodedWord);
      
      if (!lastSearchWasAI) {
        const initializeFromParam = async () => {
          try {
            const results = await searchVocabulary(axios, decodedWord, translationType);
            if (results && results.length > 0) {
              setSelectedWord(results[0]);
            }
            closeSearchModal();
          } catch (error) {
            console.error('Error initializing from URL param:', error);
          }
        };
        
        initializeFromParam();
      }
    }
  }, [word, axios, lastSearchWasAI]);

  const handleFocus = () => {
    // Mở dropdown khi focus vào input
    if (!isOpen) {
      closeSearchModal(); // Reset trạng thái trước
      setTimeout(() => {
        // Đợi một chút để reset xong mới mở lại
        openSearchModal();
      }, 0);
    }
  };

  const handleSearch = async (value) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    try {
      // Pass true to add to history when user presses Enter
      const results = await searchVocabulary(axios, value, translationType, true);
      
      if (results && results.length > 0) {
        setSelectedWord(results[0]);
        navigate(`/vocabulary/${encodeURIComponent(value)}`, { replace: true });
      }
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length === 0) {
      setSelectedWord(null);
      navigate('/vocabulary', { replace: true });
    }
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchVocabulary(axios, value, translationType);
    }, 100);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const results = await handleSearch(searchTerm);
      closeSearchModal();
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const translationOptions = [
    {
      label: 'Việt - Nhật',
      value: 'Vietnamese',
      onClick: () => setTranslationType(axios, 'Vietnamese')
    },
    {
      label: 'Nhật - Việt',
      value: 'Japanese',
      onClick: () => setTranslationType(axios, 'Japanese')
    }
  ];

  const currentLabel = translationOptions.find(
    option => option.value === translationType
  )?.label || 'Nhật - Việt';

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-4">
        <div className="relative flex-grow" ref={searchContainerRef}>
          <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onKeyDown={handleKeyDown}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            placeholder="Tìm kiếm từ vựng IT"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <SearchResult />
        </div>
        
        <DropdownDefault
          icon={<IoLanguage className="w-5 h-5" />}
          buttonLabel={currentLabel}
          menu={translationOptions}
          className="w-48"
          border={true}
        />
      </div>
    </div>
  );
};

export default VocabularySearch;