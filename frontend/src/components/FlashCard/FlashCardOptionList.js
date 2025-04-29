import { TbCards } from "react-icons/tb";
import FlashCardOption from "./FlashCardOption";
import { RiHeartAddLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";

const FlashCardOptionList = ({ onOptionClick }) => {
  return (
    <div className="w-full max-w-4xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlashCardOption
          icon={<TbCards className="size-8 text-red-500" />}
          label="Thẻ ghi nhớ"
          // onClick={() => onOptionClick("memory")}
        />
        <FlashCardOption
          icon={
            // <div className="bg-blue-100 p-2 rounded-full">
            <RiHeartAddLine className="size-8 text-red-500" />
            // </div>
          }
          label="Học"
          // onClick={() => onOptionClick("learn")}
        />
        <FlashCardOption
          icon={
            // <div className="bg-blue-500 p-2 rounded-md">
            <MdOutlineQuiz className="size-8 text-red-500" />
            // </div>
          }
          label="Kiểm tra"
          // onClick={() => onOptionClick("test")}
        />
      </div>
    </div>
  );
};

export default FlashCardOptionList;
