import React, { useEffect, useState } from "react";
import DefaultHeader from "@/layouts/DefaultHeader";
import ClassList from "@/components/Class/ClassList";
import FlashCardList from "@/components/FlashCard/FlashCardList";
import AuthorList from "@/components/Author/AuthorList";
import { Link, useNavigate } from "react-router-dom";
import VocabList from "@/components/Vocabulary/VocabList";
import BlueButton from "@/components/BlueButton";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { fetchRecentClasses } from "@/api/recentClass";
import { fetchRecentFlashcards } from "@/api/recentFlashcard";
import { fetchTopAuthor } from "@/api/topAuthor";
import { fetchSuggessVocabs } from "@/api/suggestVocab";
import NopeNotice from "@/components/NopeNotice";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const [classes, setClasses] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [vocabs, setVocabs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRecentClasses = async () => {
      try {
        const { data } = await fetchRecentClasses(axiosPrivate);
        if (data) {
          setClasses(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getRecentFlashcards = async () => {
      try {
        const { data } = await fetchRecentFlashcards(axiosPrivate);
        if (data) {
          setFlashcards(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getTopAuthors = async () => {
      try {
        const { data } = await fetchTopAuthor(axiosPrivate);
        if (data) {
          setTopAuthors(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getSuggestedVocabs = async () => {
      try {
        const { data } = await fetchSuggessVocabs(axiosPrivate);
        if (data) {
          setVocabs(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRecentClasses();
    getRecentFlashcards();
    getTopAuthors();
    getSuggestedVocabs();
  }, [axiosPrivate, navigate]);

  return (
    <main className="flex flex-1 flex-grow-1 flex-col">
      <DefaultHeader />
      <div className="flex w-full overflow-hidden justify-center mt-4">
        <div className="w-2/3 flex flex-col justify-center items-center space-y-5">
          <div className="flex w-[80%] justify-between items-center">
            <span className="px-3 w-full text-gray-600 text-lg font-semibold">
              Gần đây
            </span>
          </div>
          <div className="w-[80%]">
            {classes?.length === 0 && flashcards?.length === 0 ? (
              <NopeNotice type={'lớp học'}/>
            ) : (
              <>
                <ClassList classes={classes} />
                <div className="mt-5">
                  <FlashCardList flashCards={flashcards} />
                </div>
              </>
            )}
          </div>

          <div className="flex w-[80%] mt-6 justify-between items-center">
            <span className="px-3 flex w-full text-gray-600 text-lg font-semibold">
              Tác giả hàng đầu
            </span>
          </div>
          <div className="w-[80%]">
            <AuthorList authors={topAuthors} />
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="flex w-[80%] mb-6 justify-between items-center">
            <span className="flex-1 text-gray-600 text-lg font-semibold">
              Gợi ý
            </span>
          </div>
          <div className="w-[80%]">
            <VocabList vocabs={vocabs} />
          </div>
          <div className="my-8 flex !justify-end !items-end">
            <BlueButton
              name={"Xem tất cả"}
              isActive={"login"}
              size={"w-32 h-8 !bg-red-700 hover:!bg-red-800"}
            />
          </div>
        </div>
      </div>
      <div className="flex my-6 w-full items-center">
        <div className="w-1/12"></div>
        <div className="flex-1 space-x-4 text-[.875rem]">
          <Link className="text-gray-700 font-semibold">Quyền riêng tư</Link>
          <Link className="text-gray-700 font-semibold">Điều khoản</Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
