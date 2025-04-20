import { useState } from "react";
import FlashcardElement from "./FlashCardElement";

const FlashcardContent = ({ front, back }) => {
  const [star, setStar] = useState(false);

  const toggleStar = () => {
    setStar((prev) => !prev);
  };

  return {
    frontHTML: <FlashcardElement text={front} onClick={toggleStar} star={star} />,
    backHTML: <FlashcardElement text={back} onClick={toggleStar} star={star} />,
  };
};

export default FlashcardContent;
