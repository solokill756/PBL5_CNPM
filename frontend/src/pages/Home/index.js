import React, { useEffect } from "react";
import DefaultHeader from "@/layouts/DefaultHeader";
import ClassList from "@/components/Class/ClassList";
import FlashCardList from "@/components/FlashCard/FlashCardList";
import AuthorList from "@/components/Author/AuthorList";
import { Link } from "react-router-dom";
import VocabList from "@/components/Vocabulary/VocabList";
import BlueButton from "@/components/BlueButton";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import NopeNotice from "@/components/NopeNotice";
import { useHomeStore } from "@/store/useHomeStore";
import { useFlashcardStore } from "@/store/useflashcardStore";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { classes, flashcards, topAuthors, vocabs, init, loading } =
    useHomeStore();

  const setAxios = useFlashcardStore((state) => state.setAxios);

  useEffect(() => {
    setAxios(axiosPrivate);

    init(axiosPrivate);
  }, [init, axiosPrivate, setAxios]);

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
            {!loading.classes &&
            !loading.flashcards &&
            classes?.length === 0 &&
            flashcards?.length === 0 ? (
              <NopeNotice type="lớp học" />
            ) : (
              <>
                <ClassList classes={classes} loading={loading.classes} />
                <div className="mt-5">
                  <FlashCardList
                    flashCards={flashcards}
                    loading={loading.flashcards}
                  />
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
            <AuthorList authors={topAuthors} loading={loading.authors} />
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="flex w-[80%] mb-6 justify-between items-center">
            <span className="flex-1 text-gray-600 text-lg font-semibold">
              Gợi ý
            </span>
          </div>
          <div className="w-[80%]">
            <VocabList vocabs={vocabs} loading={loading.vocabs} />
          </div>
          <div className="my-8 flex !justify-end !items-end">
            <BlueButton
              name={"Xem tất cả"}
              isActive={"login"}
              path={"/vocabulary"}
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
