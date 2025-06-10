import React from "react";
import DropdownDefault from "../DropdownDefault";
import { TbCards } from "react-icons/tb";
import { RiHeartAddLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";
import { Link } from "react-router-dom";
import RoundButton from "../RoundButton";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";

const ModeHeader = ({
  mode,
  flashcardId,
  flashcardTitle,
  currentIndex,
  totalCard,
  onSetting,
  onClose,
}) => {
  const modeOptions = [
    {
      value: "detail",
      label: "Thẻ ghi nhớ",
      icon: <TbCards className="size-5 text-red-500" />,
      to: `/flashcard/${flashcardId}/detail`,
    },
    {
      value: "learn",
      label: "Học",
      icon: <RiHeartAddLine className="size-5 text-red-500" />,
      to: `/flashcard/${flashcardId}/learn`,
    },
    {
      value: "quiz",
      label: "Kiểm tra",
      icon: <MdOutlineQuiz className="size-5 text-red-500" />,
      to: `/flashcard/${flashcardId}/quiz`,
    },
    { value: "home", label: "Trang chủ", to: "/" },
    { value: "search", label: "Từ vựng", to: "/vocabulary" },
  ];

  return (
    <div className="relative flex w-full mr-8 items-center justify-between">
      <DropdownDefault
        icon={
          mode === "detail" ? (
            <TbCards className="size-8 text-red-500" />
          ) : mode === "learn" ? (
            <RiHeartAddLine className="size-8 text-red-500" />
          ) : (
            <MdOutlineQuiz className="size-8 text-red-500" />
          )
        }
        border={false}
        className="border-b-[2.5px] border-red-300 px-4 py-1"
        buttonLabel={
          mode === "detail"
            ? "Thẻ ghi nhớ"
            : mode === "learn"
            ? "Học"
            : "Kiểm tra"
        }
        menu={modeOptions}
      />

      {/* Đoạn giữa căn giữa màn hình */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center font-semibold text-base">
        <span>
          {typeof currentIndex !== "undefined" &&
          typeof totalCard !== "undefined" &&
          flashcardTitle
            ? `${currentIndex} / ${totalCard}`
            : ""}
        </span>
        {flashcardTitle && (
          <Link to={`/flashcard/${flashcardId}`} className="hover:text-red-400">
            {flashcardTitle}
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <RoundButton
          icon={<IoSettingsOutline className="!size-6 " />}
          border={"border-none"}
          onClick={onSetting}
        />
        <RoundButton
          icon={<AiOutlineClose className="!size-6 " />}
          border={"border-none"}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default ModeHeader;