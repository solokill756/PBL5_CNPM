import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FlashCardHeader from "@/components/FlashCard/FlashCardHeader";
import FlashCardOptionList from "@/components/FlashCard/FlashCardOptionList";
import DefaultHeader from "@/layouts/DefaultHeader";
import { useFlashcardStore } from "@/store/useflashcardStore";
import FlashCardArea from "@/components/FlashCard/FlashCardArea";
import FeedbackModal from "@/components/Feedback/FeedbackModal";
import ShareModal from "@/components/Modal/ShareModal";
import SaveModal from "@/components/Modal/SaveModal";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import AuthorInfo from "@/components/Author/AuthorInfor";
import "./index.css";
import ModeHeader from "@/components/ModeHeader";
import { getTimeAgo } from "@/utils/getTimeAgo";
import defaultAvatar from "@/assets/images/avatar.jpg";
import { addFlashcardToLearn } from "@/api/addFlashcardToLearn";

export default function FlashCard({ mode = "" }) {
  const { flashcardId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axios = useAxiosPrivate();
  const prevModeRef = useRef(null);

  const {
    openModal,
    isFlashcardSaved,
    setAxios,
    fetchIsRated,
    currentIndex,
    displayDeck,
    fetchFlashcardList,
    flashcardMetadata,
    authorInfor,
    isDataLoaded,
    lastLoadedId,
    resetFlashcardState
  } = useFlashcardStore();

  useEffect(() => {
    const fetchData = async () => {
      if (mode !== "detail") setLoading(true);
      try {
        await addFlashcardToLearn(axios, flashcardId);

        if (!isDataLoaded || lastLoadedId !== flashcardId) {
          setAxios(axios);
          await fetchFlashcardList(axios, flashcardId);
          await fetchIsRated(axios, flashcardId);
        }
      } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [flashcardId, axios, setAxios, fetchIsRated, isDataLoaded, lastLoadedId]);

  useEffect(() => {
    // Kiểm tra nếu đang chuyển từ mode detail sang mode khác
    if (prevModeRef.current === "detail" && mode !== "detail") {
      resetFlashcardState();
    }
    
    // Cập nhật mode trước đó
    prevModeRef.current = mode;
  }, [mode]);

  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide">
      {/* Dropdown chuyển mode */}
      <div className="flex w-full justify-start">
        {mode === "detail" && (
          <ModeHeader
            mode={mode}
            flashcardId={flashcardId}
            flashcardTitle={flashcardMetadata.title}
            currentIndex={currentIndex}
            totalCard={displayDeck.length}
            onSetting={() => openModal("setting")}
            onClose={() => navigate(`/flashcard/${flashcardId}`)}
          />
        )}
      </div>

      {/* Chỉ hiện header khi không phải mode detail */}
      {mode !== "detail" && <DefaultHeader />}

      {flashcardMetadata && mode !== "detail" && (
        <FlashCardHeader
          title={flashcardMetadata.title}
          rating={parseFloat(Number(flashcardMetadata.rate).toFixed(1))}
          ratingCount={`(${flashcardMetadata.number_rate} đánh giá)`}
          onSave={() => openModal("save")}
          onShare={() => openModal("share")}
          onStar={() => openModal("star")}
          isSaved={isFlashcardSaved(flashcardId)}
          loading={loading}
        />
      )}

      {mode !== "detail" && <FlashCardOptionList flashcardId={flashcardId} />}

      <FlashCardArea mode={mode} loading={loading} error={error} />

      <FeedbackModal />
      <ShareModal />
      <SaveModal />

      {mode !== "detail" && (
        <>
          <hr className="w-[870px] border-zinc-200 my-4" />
          <AuthorInfo
            className="justify-start"
            authorName={authorInfor.username}
            authorAvatar={authorInfor.profile_picture || defaultAvatar}
            authorCreatedAt={getTimeAgo(flashcardMetadata.created_at)}
            loading={loading}
          />
        </>
      )}
    </main>
  );
}
