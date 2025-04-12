import React, { useContext } from "react";
import DefaultHeader from "@/layouts/DefaultHeader";
import ClassList from "@/components/Class/ClassList";
import FlashCardList from "@/components/FlashCard/FlashCardList";
import AuthorList from "@/components/Author/AuthorList";
import { Link } from "react-router-dom";
import VocabList from "@/components/Vocabulary/VocabList";
import BlueButton from "@/components/BlueButton";

const Home = () => {
  const classes = [
    { name: "Nihongo Classdddddddddddđdd", author: "Thanh Huy", member: "5" },
    { name: "Nihongo Class", author: "Thanh Huy", member: "5" },
    { name: "Nihongo Class", author: "Thanh Huy", member: "5" },
    { name: "Nihongo Class", author: "Thanh Huy", member: "5" },
  ];

  return (
    <main className="flex flex-1 flex-grow-1 flex-col items-center">
      <DefaultHeader />
      <div className="flex w-full overflow-hidden justify-center mt-4">
        <div className="w-2/3 flex flex-col justify-center items-center gap-4">
          <div className="flex w-[80%] justify-between items-center">
            <span className="px-3 w-full text-gray-600 text-lg font-semibold">
              Gần đây
            </span>
          </div>
          <div className="w-[80%]">
            <ClassList classes={classes} />
          </div>
          <div className="w-[80%] mt-5">
            <FlashCardList />
          </div>
          <div className="flex w-[80%] mt-6 justify-between items-center">
            <span className="flex w-full text-gray-600 text-lg font-semibold">
              Tác giả hàng đầu
            </span>
          </div>
          <div className="w-[80%]">
            <AuthorList />
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="flex w-[80%] mb-6 justify-between items-center">
            <span className="flex-1 text-gray-600 text-lg font-semibold">
              Gợi ý
            </span>
          </div>
          <div className="w-[80%]">
            <VocabList />
          </div>
          <div className="my-8 flex !justify-end !items-end">
            <BlueButton
              name={"Xem tất cả"}
              isActive={"login"}
              size={"w-32 h-8"}
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
