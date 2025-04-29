import React from "react";
import FlashCardHeader from "@/components/FlashCard/FlashCardHeader";
import FlashCardOptionList from "@/components/FlashCard/FlashCardOptionList";
import DefaultHeader from "@/layouts/DefaultHeader";
import { useFlashcardStore } from "@/store/useflashcardStore";
import FlashCardArea from "@/components/FlashCard/FlashCardArea";
import FeedbackModal from "@/components/Feedback/FeedbackModal";
import "./index.css";
import ShareModal from "@/components/Modal/ShareModal";
import SaveModal from "@/components/Modal/SaveModal";

export default function FlashCard() {
   const openModal = useFlashcardStore(state => state.openModal);

   return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide">
      <DefaultHeader />
      <FlashCardHeader
        title="JLPT N3 漢字 総まとめ"
        onSave={() => openModal('save')}
        onShare={() => openModal('share')}
        onStar={() => openModal('star')}
      />
      <FlashCardOptionList />
      <FlashCardArea />
      <hr className="w-[870px] border-zinc-200 my-4" />
      <FeedbackModal />
      <ShareModal />
      <SaveModal />
    </main>
  );
}
