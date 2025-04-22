import React, { useEffect, useRef, useState } from "react";
import ScrollButton from "../ScrollButton";
import AuthorItem from "./AuthorItem";
import useScrollable from "@/hooks/useScrollable";
import fallbackAvatar from "@/assets/images/avatar.jpg";


const AuthorList = ( { authors } ) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
        className="flex w-full scroll-smooth overflow-x-hidden scroll-snap-x snap-mandatory"
      >
        {authors.map((card, index) => (
          <AuthorItem
            key={index}
            name={card.username}
            numberClass={card.ClassCount}
            numberFlashcard={card.ListFlashCardCount}
            avatar={card.profile_picture ? card.profile_picture : fallbackAvatar}
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
