import React, { useRef, useState } from "react";
import FlashCardItem from "./FlashCardItem";
import ScrollButton from "../ScrollButton";
import useScrollable from "@/hooks/useScrollable";
import fallbackAvatar from "@/assets/images/avatar.jpg";

const FlashCardList = ({ flashCards = [], loading }) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const { isLeftVisible, isRightVisible, handleScroll } = useScrollable({
    scrollRef,
    itemsToScroll: 2,
    scrollBehavior: "smooth",
  });

  const skeletons = new Array(2).fill(null);

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
        {(loading ? skeletons : flashCards).map((card, index) => (
          <FlashCardItem
            key={index}
            id={loading ? "" : card.list_id}
            title={loading ? "" : card.title}
            author={loading ? "" : card.User.username}
            number={loading ? 0 : card.FlashcardCount}
            avatar={loading ? fallbackAvatar : (card.User.profile_picture || fallbackAvatar)}
            loading={loading}
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