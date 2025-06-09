import React, { useEffect, useState } from "react";
import DefaultHeader from "@/layouts/DefaultHeader";
import ClassList from "@/components/Class/ClassList";
import FlashCardList from "@/components/FlashCard/FlashCardList";
import AuthorList from "@/components/Author/AuthorList";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import NopeNotice from "@/components/NopeNotice";
import { getResearch } from "@/api/getResearch";
import { useSearchParams, Link } from "react-router-dom";

const SearchResults = () => {
  const axiosPrivate = useAxiosPrivate();
  const [searchParams] = useSearchParams(); 
  const searchQuery = searchParams.get('q') || ''; 
  const [searchData, setSearchData] = useState({
    listFlashCards: [],
    Classes: [],
    users: [],
    totalResults: {
      listFlashCards: 0,
      Classes: 0,
      users: 0
    }
  });
  
  const [loading, setLoading] = useState({
    flashcards: false,
    classes: false,
    authors: false,
    overall: false
  });

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) return;
      
      setLoading(prev => ({ ...prev, overall: true }));
      
      try {
        const result = await getResearch(axiosPrivate, searchQuery);
        
        if (result.status === 'success') {
          setSearchData(result.data);
        } else {
          // Reset data nếu không có kết quả
          setSearchData({
            listFlashCards: [],
            Classes: [],
            users: [],
            totalResults: {
              listFlashCards: 0,
              Classes: 0,
              users: 0
            }
          });
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchData({
          listFlashCards: [],
          Classes: [],
          users: [],
          totalResults: {
            listFlashCards: 0,
            Classes: 0,
            users: 0
          }
        });
      } finally {
        setLoading(prev => ({ ...prev, overall: false }));
      }
    };

    performSearch();
  }, [searchQuery, axiosPrivate]);

  const hasFlashcards = searchData.listFlashCards?.length > 0;
  const hasClasses = searchData.Classes?.length > 0;
  const hasAuthors = searchData.users?.length > 0;
  const hasAnyResults = hasFlashcards || hasClasses || hasAuthors;

  return (
    <main className="flex flex-1 flex-grow-1 flex-col">
      <DefaultHeader />
      <div className="flex w-full overflow-hidden justify-center mt-4">
        <div className="w-2/3 flex flex-col justify-center items-center space-y-5">
          
          {/* Header tìm kiếm */}
          <div className="flex w-[80%] justify-between items-center">
            <span className="px-3 w-full text-gray-600 text-lg font-semibold">
              {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Kết quả tìm kiếm'}
            </span>
          </div>

          {searchQuery && !loading.overall && (
            <div className="w-[80%] px-3 text-sm text-gray-500">
              Tìm thấy {searchData.totalResults.listFlashCards + searchData.totalResults.Classes + searchData.totalResults.users} kết quả
              ({searchData.totalResults.listFlashCards} flashcard, {searchData.totalResults.Classes} lớp học, {searchData.totalResults.users} tác giả)
            </div>
          )}

          <div className="w-[80%]">
            {loading.overall ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Đang tìm kiếm...</div>
              </div>
            ) : !hasAnyResults && searchQuery ? (
              <NopeNotice 
                type="kết quả" 
                customMessage={`Không tìm thấy kết quả nào cho "${searchQuery}"`}
                actionText="Thử từ khóa khác"
              />
            ) : (
              <>
                {/* Flashcards section */}
                {hasFlashcards && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Flashcards ({searchData.totalResults.listFlashCards})
                      </h3>
                    </div>
                    <FlashCardList
                      flashCards={searchData.listFlashCards} 
                      loading={loading.flashcards}
                    />
                  </div>
                )}

                {/* Classes section */}
                {hasClasses && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Lớp học ({searchData.totalResults.Classes})
                      </h3>
                    </div>
                    <ClassList 
                      classes={searchData.Classes} 
                      loading={loading.classes}
                    />
                  </div>
                )}

                {/* Authors section */}
                {hasAuthors && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Tác giả ({searchData.totalResults.users})
                      </h3>
                    </div>
                    <AuthorList 
                      authors={searchData.users} 
                      loading={loading.authors}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>    
    </main>
  );
};

export default SearchResults;