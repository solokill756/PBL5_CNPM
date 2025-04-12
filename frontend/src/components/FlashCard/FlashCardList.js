import React, { useEffect, useRef, useState } from "react";
import FlashCardItem from "./FlashCardItem";
import ScrollButton from "../ScrollButton";

const FlashCardList = () => {
  const scrollRef = useRef(null);

  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const flashCardList = [
    {
      name: "まとめ1 複合動詞_N2語彙_耳から覚える",
      author: "Thanh Huy",
      number: "90",
      avatar:
        "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
    },
    {
      name: "まとめ1 複合動詞_N2語彙_耳から覚える",
      author: "Thanh Huy",
      number: "90",
      avatar:
        "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
    },
    {
      name: "まとめ2 複合動詞_N2語彙_耳から覚える",
      author: "Thanh Huy",
      number: "50",
      avatar:
        "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
    },
    {
      name: "まとめ3 複合動詞_N2語彙_耳から覚える",
      author: "Thanh Huy",
      number: "120",
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
      className="relative items-center max-w-[700px]"
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
        {flashCardList.map((card, index) => (
          <FlashCardItem
            key={index}
            name={card.name}
            author={card.author}
            number={card.number}
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

export default FlashCardList;
