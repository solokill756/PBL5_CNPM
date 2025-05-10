import React from "react";
import { FaStar } from "react-icons/fa";
import { MdMoreHoriz, MdOutlineBookmarkAdd, MdOutlineReportProblem } from "react-icons/md";
import { RiShare2Line } from "react-icons/ri";
import RoundButton from "../RoundButton";
import { FaRegCopy } from "react-icons/fa6";
import { useFlashcardStore } from "@/store/useflashcardStore";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const dropdownMenu = [
  {
    label: "Tạo một bản sao",
    icon: <FaRegCopy className="size-5"/>
  },
  {
    label: "Báo cáo",
    icon: <MdOutlineReportProblem className="size-5"/>
  },
];

const FlashCardHeader = ({ title, rating, ratingCount, onSave, onShare, onMore, onStar, loading = false }) => {
  const { flashcardId } = useParams();
  const { isFlashcardSaved } = useFlashcardStore();
  
  const isSaved = isFlashcardSaved(flashcardId);

  return (
    <div className="w-full max-w-4xl px-4 py-4">
      <div className="flex items-center justify-between">
      {loading ? (
          <Skeleton 
            width={350} 
            height={36} 
            baseColor="#fff4f4" 
            highlightColor="#F0F0F0" 
            borderRadius={4}
          />
        ) : (
          <h1 className="text-3xl font-bold text-gray-800 truncate max-w-[350px]">{title}</h1>
        )}
        <div className="flex items-center gap-2">
          <RoundButton 
            icon={<MdOutlineBookmarkAdd />} 
            onClick={onSave} 
            isSaved={isSaved}
          />
          <RoundButton icon={<RiShare2Line />} onClick={onShare} />
          <RoundButton 
            icon={<MdMoreHoriz />} 
            onClick={onMore} 
            isDropdown={true} 
            menu={dropdownMenu}
          />
        </div>
      </div>
      <div onClick={onStar} className="flex items-center mt-1 p-3 text-gray-600 cursor-pointer hover:bg-zinc-100 hover:rounded-full w-fit">
        <FaStar className="size-5 text-yellow-400 fill-yellow-400" />
        {loading ? (
          <Skeleton 
            width={120} 
            height={24} 
            baseColor="#fff4f4" 
            highlightColor="#F0F0F0" 
            borderRadius={4}
            className="ml-2"
          />
        ) : rating ? (
          <span className="ml-2 text-md font-medium">{rating.toFixed(1)} {ratingCount}</span>
        ) : (
          <span className="ml-2 text-md font-medium">Cho điểm đánh giá đầu tiên</span>
        )}
      </div>
    </div>
  );
};

export default FlashCardHeader;