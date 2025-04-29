import React, { useMemo } from 'react';
import { FlashcardArray } from 'react-quizlet-flashcard';
import RoundButton from '@/components/RoundButton';
import FlashcardElement from '@/components/FlashCard/FlashCardElement';
import { useFlashcardStore } from '@/store/useflashcardStore';
import { IoMdShuffle } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import SettingModal from '../Modal/SettingModal';

export default function FlashCardArea() {
  const {
    displayDeck,
    currentIndex,
    isShuffled,
    shuffle,
    showShuffleStatus,
    toggleStar,
    starredMap,
    setCurrentIndex
  } = useFlashcardStore();

  const showFrontFirst = useFlashcardStore(state => state.showFrontFirst);
  const openModal = useFlashcardStore(state => state.openModal);

  const cardsForQuizlet = useMemo(() => {
    return displayDeck.map(({ id, front, back }) => {
      // nếu showFrontFirst = false, đảo front/back
      const frontText = showFrontFirst ? front : back;
      const backText  = showFrontFirst ? back  : front;
      return {
        id,
        frontHTML: (
          <FlashcardElement
            text={frontText}
            star={!!starredMap[id]}
            onClick={() => toggleStar(id)}
          />
        ),
        backHTML: (
          <FlashcardElement
            text={backText}
            star={!!starredMap[id]}
            onClick={() => toggleStar(id)}
          />
        ),
      };
    });
  }, [displayDeck, starredMap, showFrontFirst]);

  return (
    <div className="relative mt-6 mb-3">
      <FlashcardArray
        cards={cardsForQuizlet}
        controls
        onCardChange={(_, idx) => setCurrentIndex(idx)}
      />
      <div className="absolute flex gap-4 bottom-0 right-0">
        <RoundButton border={'border-none'} icon={<IoMdShuffle />} onClick={shuffle} />
        <RoundButton border={'border-none'} icon={<IoSettingsOutline />} onClick={() => {openModal('setting')}} />
        <SettingModal />
      </div>
      {showShuffleStatus && (
        <div className="absolute w-full rounded-xl bg-red-100 z-10 bottom-0">
          <span className="flex items-center justify-center text-xs py-2">
            {isShuffled ? 'Trộn thẻ đang bật' : 'Trộn thẻ đang tắt'}
          </span>
        </div>
      )}
    </div>
  );
}