import React, { useEffect, useRef, useState } from "react";
import ScrollButton from "../ScrollButton";
import { useNavigate } from "react-router-dom";
import AuthorItem from "./AuthorItem";

const AuthorList = () => {
  const scrollRef = useRef(null);

  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
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

  const updateButtonVisibility = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const offset = 5; // Sai số để tránh lỗi làm tròn

    setIsLeftVisible(scrollLeft > offset);
    setIsRightVisible(scrollLeft + clientWidth < scrollWidth - offset);
  };

  const handleScroll = (direction) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollAmount = 620; // Độ dài cuộn
    const newScrollLeft =
      direction === "left"
        ? scrollContainer.scrollLeft - scrollAmount
        : scrollContainer.scrollLeft + scrollAmount;

    scrollContainer.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", updateButtonVisibility);
    updateButtonVisibility();

    return () => {
      scrollContainer.removeEventListener("scroll", updateButtonVisibility);
    };
  }, []);

  return (
    <div
      className="relative flex items-center max-w-[620px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && isLeftVisible && (
        <ScrollButton direction="left" onClick={() => handleScroll("left")} />
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-hidden scroll-smooth scrollbar-hide w-full px-4"
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
