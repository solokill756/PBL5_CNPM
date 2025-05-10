import { useState, useMemo, useCallback } from "react";

// Fisher–Yates shuffle, đảm bảo không trùng với bản gốc
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useShuffle(originalCards) {
  // chỉ shuffle 1 lần mỗi khi originalCards thay đổi
  const shuffledCards = useMemo(() => shuffleArray(originalCards), [originalCards]);

  const [displayCards, setDisplayCards] = useState(originalCards);
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // khi user lật card
  const handleCardChange = useCallback((_, idx) => {
    setCurrentIndex(idx);
  }, []);

  // toggle giữa shuffled/original, giữ nguyên card đang xem
  const handleShuffle = useCallback(() => {
    const currentCardId = displayCards[currentIndex]?.id;
    const nextIsShuffled = !isShuffled;
    const nextDeck = nextIsShuffled ? shuffledCards : originalCards;
    const newIndex = nextDeck.findIndex(c => c.id === currentCardId);

    setDisplayCards(nextDeck);
    setIsShuffled(nextIsShuffled);
    setCurrentIndex(newIndex >= 0 ? newIndex : 0);
  }, [isShuffled, displayCards, currentIndex, originalCards, shuffledCards]);

  return {
    displayCards,
    isShuffled,
    currentIndex,
    handleShuffle,
    handleCardChange,
  };
}
