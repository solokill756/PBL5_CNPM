import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import FlashCardHeader from "@/components/FlashCard/FlashCardHeader";
import FlashCardOptionList from "@/components/FlashCard/FlashCardOptionList";
import DefaultHeader from "@/layouts/DefaultHeader";
import { FlashcardArray } from "react-quizlet-flashcard";
import RoundButton from "@/components/RoundButton";
import "./index.css";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdShuffle } from "react-icons/io";
import FlashcardElement from "@/components/FlashCard/FlashCardElement";

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const rawCards = [
  { id: 1, front: "勉強", back: "Học tập" },
  { id: 2, front: "学校", back: "Trường học" },
  { id: 3, front: "先生", back: "Giáo viên" },
  { id: 4, front: "学生", back: "Học sinh" },
  { id: 5, front: "図書館", back: "Thư viện" },
  { id: 6, front: "病院", back: "Bệnh viện" },
  { id: 7, front: "映画", back: "Phim" },
  { id: 8, front: "天気", back: "Thời tiết" },
  { id: 9, front: "雨", back: "Mưa" },
  { id: 10, front: "晴れ", back: "Trời nắng" },
  { id: 11, front: "風", back: "Gió" },
  { id: 12, front: "時間", back: "Thời gian" },
  { id: 13, front: "今日", back: "Hôm nay" },
  { id: 14, front: "明日", back: "Ngày mai" },
  { id: 15, front: "昨日", back: "Hôm qua" },
  { id: 16, front: "食べる", back: "Ăn" },
  { id: 17, front: "飲む", back: "Uống" },
  { id: 18, front: "行く", back: "Đi" },
  { id: 19, front: "来る", back: "Đến" },
  { id: 20, front: "見る", back: "Xem" },
  { id: 21, front: "聞く", back: "Nghe" },
  { id: 22, front: "書く", back: "Viết" },
  { id: 23, front: "読む", back: "Đọc" },
  { id: 24, front: "話す", back: "Nói chuyện" },
  { id: 25, front: "友達", back: "Bạn bè" },
  { id: 26, front: "家族", back: "Gia đình" },
  { id: 27, front: "父", back: "Bố" },
  { id: 28, front: "母", back: "Mẹ" },
  { id: 29, front: "兄", back: "Anh trai" },
  { id: 30, front: "姉", back: "Chị gái" },
  { id: 31, front: "弟", back: "Em trai" },
  { id: 32, front: "妹", back: "Em gái" },
  { id: 33, front: "猫", back: "Mèo" },
  { id: 34, front: "犬", back: "Chó" },
  { id: 35, front: "車", back: "Xe hơi" },
  { id: 36, front: "自転車", back: "Xe đạp" },
  { id: 37, front: "駅", back: "Nhà ga" },
  { id: 38, front: "店", back: "Cửa hàng" },
  { id: 39, front: "会社", back: "Công ty" },
  { id: 40, front: "仕事", back: "Công việc" },
  { id: 41, front: "料理", back: "Nấu ăn" },
  { id: 42, front: "音楽", back: "Âm nhạc" },
  { id: 43, front: "歌", back: "Bài hát" },
  { id: 44, front: "運動", back: "Vận động" },
  { id: 45, front: "買い物", back: "Mua sắm" },
  { id: 46, front: "旅行", back: "Du lịch" },
  { id: 47, front: "朝", back: "Buổi sáng" },
  { id: 48, front: "昼", back: "Buổi trưa" },
  { id: 49, front: "晩", back: "Buổi tối" },
  { id: 50, front: "夜", back: "Đêm" },
];

export default function FlashCard() {
  const [showShuffleStatus, setShowShuffleStatus] = useState(false);
  const [starredMap, setStarredMap] = useState({});
  const toggleStar = useCallback((id) => {
    setStarredMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Decks
  const originalDeck = useMemo(
    () => rawCards.map(({ id, front, back }) => ({ id, front, back })),
    []
  );
  const shuffledDeck = useMemo(
    () => shuffleArray(originalDeck),
    [originalDeck]
  );

  const [displayDeck, setDisplayDeck] = useState(originalDeck);
  const [isShuffled, setIsShuffled] = useState(false);

  // Current card index
  const [currentIndex, setCurrentIndex] = useState(0);
  const controlRef = useRef({});

  const handleCardChange = useCallback((_, index) => {
    setCurrentIndex(index);
  }, []);

  const handleShuffle = useCallback(() => {
    const currentId = displayDeck[currentIndex]?.id;
    const nextShuffled = !isShuffled;
    const nextDeck = nextShuffled ? shuffledDeck : originalDeck;
    const newIndex = nextDeck.findIndex((c) => c.id === currentId);

    setIsShuffled(nextShuffled);
    setDisplayDeck(nextDeck);
    setShowShuffleStatus(true);
    setTimeout(() => {
      setShowShuffleStatus(false);
      clearTimeout();
    }, 2000);
    setCurrentIndex(newIndex >= 0 ? newIndex : 0);
  }, [currentIndex, displayDeck, isShuffled, shuffledDeck, originalDeck]);

  // Prepare cards with JSX
  const cardsForQuizlet = useMemo(
    () =>
      displayDeck.map(({ id, front, back }) => ({
        id,
        frontHTML: (
          <FlashcardElement
            text={front}
            star={!!starredMap[id]}
            onClick={() => toggleStar(id)}
          />
        ),
        backHTML: (
          <FlashcardElement
            text={back}
            star={!!starredMap[id]}
            onClick={() => toggleStar(id)}
          />
        ),
      })),
    [displayDeck, starredMap, toggleStar]
  );

  const handleSave = () => {
    // save logic
  };
  const handleShare = () => {
    // share logic
  };
  const handleSetting = () => {
    // settings logic
  };

  return (
    <main className="flex flex-1 flex-grow-1 flex-col items-center scrollbar-hide">
      <DefaultHeader />
      <FlashCardHeader
        title="JLPT N3 漢字 総まとめ"
        onSave={handleSave}
        onShare={handleShare}
      />
      <FlashCardOptionList />
      <div className="mt-6 mb-3 relative">
        <FlashcardArray
          cards={cardsForQuizlet}
          controls
          forwardRef={controlRef}
          onCardChange={handleCardChange}
        />
        <div className="absolute flex gap-4 bottom-0 right-0">
          <RoundButton
            icon={<IoMdShuffle />}
            border="border-none"
            onClick={handleShuffle}
          />
          <RoundButton
            icon={<IoSettingsOutline />}
            border="border-none"
            onClick={handleSetting}
          />
        </div>
        {showShuffleStatus && (
          <div className="absolute w-full rounded-xl bg-red-100 z-10 bottom-0">
            <span className="flex items-center text-gray-700 font-medium justify-center text-xs py-2">
              {isShuffled ? "Trộn thẻ đang bật" : "Trộn thẻ đang tắt"}
            </span>
          </div>
        )}
      </div>
      <div className="w-[870px] mb-4">
        <div className="border-[1.5px] border-solid border-zinc-200"></div>
      </div>
    </main>
  );
}
