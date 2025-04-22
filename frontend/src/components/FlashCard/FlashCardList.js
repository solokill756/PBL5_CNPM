import React, { useRef, useState } from "react";
import FlashCardItem from "./FlashCardItem";
import ScrollButton from "../ScrollButton";
import useScrollable from "@/hooks/useScrollable";
import fallbackAvatar from "@/assets/images/avatar.jpg";

const FlashCardList = ( { flashCards } ) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // const flashCardList = [
  //   {
  //     name: "まとめ1 複合動詞_N2語彙_耳から覚える",
  //     author: "Thanh Huy",
  //     number: "90",
  //     avatar:
  //       "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
  //   },
  //   {
  //     name: "まとめ1 複合動詞_N2語彙_耳から覚える",
  //     author: "Thanh Huy",
  //     number: "90",
  //     avatar:
  //       "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
  //   },
  //   {
  //     name: "まとめ2 複合動詞_N2語彙_耳から覚える",
  //     author: "Thanh Huy",
  //     number: "50",
  //     avatar:
  //       "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
  //   },
  //   {
  //     name: "まとめ3 複合動詞_N2語彙_耳から覚える",
  //     author: "Thanh Huy",
  //     number: "120",
  //     avatar:
  //       "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
  //   },
  // ];

  // Dùng custom hook, truyền ref và các thiết lập mong muốn
  const { isLeftVisible, isRightVisible, handleScroll } = useScrollable({
    scrollRef,
    itemsToScroll: 2,
    scrollBehavior: "smooth",
  });

  return (
    <div
      className="relative items-center max-w-[700px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && isLeftVisible && (
        <ScrollButton direction="left" onClick={() => handleScroll("left")} />
      )}
      <div
        ref={scrollRef}
        className="flex w-full scroll-smooth overflow-x-hidden scroll-snap-x snap-mandatory"
      >
        {flashCards.map((card, index) => (
          <FlashCardItem
            key={index}
            title={card.title}
            author={card.User.username}
            number={card.FlashcardCount}
            avatar={card.User.profile_picture ? card.User.profile_picture : fallbackAvatar}
          />
        ))}
      </div>
      {isHovered && isRightVisible && (
        <ScrollButton direction="right" onClick={() => handleScroll("right")} />
      )}
    </div>
  );
};

export default FlashCardList;

