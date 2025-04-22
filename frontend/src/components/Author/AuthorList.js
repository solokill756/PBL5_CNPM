import React, { useRef, useState } from "react";
import AuthorItem from "./AuthorItem";
import ScrollButton from "../ScrollButton";
import useScrollable from "@/hooks/useScrollable";
import fallbackAvatar from "@/assets/images/avatar.jpg";

const AuthorList = ({ authors = [], loading }) => {
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
      className="relative flex items-center max-w-[700px]"
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
        {(loading ? skeletons : authors).map((card, index) => (
          <AuthorItem
            key={index}
            name={loading ? "" : card.username}
            numberClass={loading ? 0 : card.ClassCount}
            numberFlashcard={loading ? 0 : card.ListFlashCardCount}
            avatar={
              loading ? fallbackAvatar : card.profile_picture || fallbackAvatar
            }
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

export default AuthorList;
