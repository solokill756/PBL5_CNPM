import React, { useEffect, useState } from "react";
import FlashCardHeader from "@/components/FlashCard/FlashCardHeader";
import FlashCardOptionList from "@/components/FlashCard/FlashCardOptionList";
import DefaultHeader from "@/layouts/DefaultHeader";
import { useFlashcardStore } from "@/store/useflashcardStore";
import FlashCardArea from "@/components/FlashCard/FlashCardArea";
import FeedbackModal from "@/components/Feedback/FeedbackModal";
import "./index.css";
import ShareModal from "@/components/Modal/ShareModal";
import SaveModal from "@/components/Modal/SaveModal";
import { useHomeStore } from "@/store/useHomeStore";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { fetchFlashcardList } from "@/api/getFlashcardList";
import AuthorInfo from "@/components/Author/AuthorInfor";

export default function FlashCard() {
  const { flashcardId } = useParams();
  const [meta, setMeta] = useState(null);
  const [items, setItems] = useState([]);
  const axios = useAxiosPrivate();

  const openModal = useFlashcardStore((state) => state.openModal);
  const loading = useFlashcardStore((state) => state.loading);
  const isFlashcardSaved = useFlashcardStore((state) => state.isFlashcardSaved);
  const getFlashcardById = useHomeStore((state) => state.getFlashcardById);

  useEffect(() => {
    // Lấy metadata từ store (nếu có)
    const foundMeta = getFlashcardById(flashcardId);
    console.log("Cardd " + foundMeta);

    setMeta(foundMeta);

    // Lấy các item của list
    const fetchItems = async () => {
      try {
        const data = await fetchFlashcardList(axios, flashcardId);
        setItems(data);
      } catch (e) {
        setItems([]);
      }
    };
    fetchItems();
  }, [flashcardId]);

  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide">
      <DefaultHeader />
      {meta && (
        <FlashCardHeader
          title={meta.title}
          rating={parseFloat(Number(meta.rate).toFixed(1))}
          ratingCount={`(${meta.number_rate} đánh giá)`}
          onSave={() => openModal("save")}
          onShare={() => openModal("share")}
          onStar={() => openModal("star")}
          isSaved={isFlashcardSaved(flashcardId)}
        />
      )}
      <FlashCardOptionList />
      <FlashCardArea items={items} loading={loading} />
      <FeedbackModal />
      <ShareModal />
      <SaveModal />
      <hr className="w-[870px] border-zinc-200 my-4" />
      <AuthorInfo className="justify-start" authorName={'huy'} authorAvatar={'https://i.pravatar.cc/300'} authorCreatedAt={'1 năm'}/>
    </main>
  );
}
