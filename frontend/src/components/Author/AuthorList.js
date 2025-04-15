import React, { useEffect, useRef, useState } from "react";
import ScrollButton from "../ScrollButton";
import { useNavigate } from "react-router-dom";
import AuthorItem from "./AuthorItem";
import useScrollable from "@/hooks/useScrollable";

const AuthorList = () => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const authorList = [
    {
      name: "Huy123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      numberClass: "2",
      numberFlashcard: '100',
      avatar:
        "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
    },
    {
      name: "Mchien",
      numberClass: "2",
      numberFlashcard: '100',
      avatar:
        "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
    },
    {
      name: "ThanhHuy",
      numberClass: "2",
      numberFlashcard: '100',
      avatar:
        "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
    },
    {
      name: "abcXYZ",
      numberClass: "2",
      numberFlashcard: '100',
      avatar:
        "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
    },
  ];

  const { isLeftVisible, isRightVisible, handleScroll } = useScrollable({
    scrollRef: scrollRef,
    itemsToScroll: 2,
    scrollBehavior: 'smooth',
  })

  return (
    <div
      className="relative flex items-center max-w-[700px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && isLeftVisible && (
        <ScrollButton direction="left" onClick={() => handleScroll("left")} />
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex scroll-smooth overflow-x-hidden scroll-snap-x snap-mandatory"
      >
        {authorList.map((card, index) => (
          <AuthorItem
            key={index}
            name={card.name}
            numberClass={card.numberClass}
            numberFlashcard={card.numberFlashcard}
            avatar={card.avatar}
          />
        ))}
      </div>

      {isHovered && isRightVisible && (
        <ScrollButton direction="right" onClick={() => handleScroll("right")} />
      )}
    </div>
  );
};

export default AuthorList;
