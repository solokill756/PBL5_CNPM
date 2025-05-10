import { TbCards } from "react-icons/tb";
import FlashCardOption from "./FlashCardOption";
import { RiHeartAddLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const FlashCardOptionList = ({ onOptionClick, flashcardId }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlashCardOption
          icon={<TbCards className="size-8 text-red-500" />}
          label="Thẻ ghi nhớ"
          onClick={() => navigate(`/flashcard/${flashcardId}/detail`)}
        />
        <FlashCardOption
          icon={<RiHeartAddLine className="size-8 text-red-500" />}
          label="Học"
          onClick={() => navigate(`/flashcard/${flashcardId}/learn`)}
        />
        <FlashCardOption
          icon={<MdOutlineQuiz className="size-8 text-red-500" />}
          label="Kiểm tra"
          onClick={() => navigate(`/flashcard/${flashcardId}/quiz`)}
        />
      </div>
    </div>
  );
};

export default FlashCardOptionList;
