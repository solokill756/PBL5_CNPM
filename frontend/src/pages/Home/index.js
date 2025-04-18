import React, { useContext } from "react";
import DefaultHeader from "@/layouts/DefaultHeader";
import ClassList from "@/components/Class/ClassList";
import FlashCardList from "@/components/FlashCard/FlashCardList";
import AuthorList from "@/components/Author/AuthorList";
import { Link } from "react-router-dom";
import VocabList from "@/components/Vocabulary/VocabList";
import BlueButton from "@/components/BlueButton";
import { Button } from "@chakra-ui/react";
import AuthContext from "@/context/AuthProvider";
import Cookies from "js-cookie";

const Home = () => {
  const { setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    try {
      // Lưu accessToken vào cookie
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setAuth(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

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
        <div className="w-2/3 flex flex-wrap justify-center gap-4">
          <div className="flex w-full justify-between items-center">
            <div className="w-[13%]"></div>
            <span className="flex-1 text-gray-600 text-lg font-semibold">
              Gần đây
            </span>
          </div>
          <ClassList classes={classes} />
          <div className="mt-5">
            <FlashCardList />
          </div>
          <div className="flex w-full mt-6 justify-between items-center">
            <div className="w-[13%]"></div>
            <span className="flex-1 text-gray-600 text-lg font-semibold">
              Tác giả hàng đầu
            </span>
          </div>
          <div className="">
            <AuthorList />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="flex mb-6 w-full justify-between items-center">
            <div className="w-[10%]"></div>
            <span className="flex-1 text-gray-600 text-lg font-semibold">
              Gợi ý
            </span>
          </div>
          <VocabList />
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
