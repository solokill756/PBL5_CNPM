import React, { useState } from "react";
import Modal from "./Modal";
import { Listbox } from "@headlessui/react";
import { RiArrowDropDownLine } from "react-icons/ri";

const QuizModal = ({ isOpen, onClose, onSubmit, maxQuestions, title }) => {

  const answerOptions = [
    { label: "Tiếng Việt", value: "vietnamese" },
    { label: "Tiếng Nhật", value: "japanese" },
  ];


  const [questionCount, setQuestionCount] = useState(20);
  const [answerType, setAnswerType] = useState(answerOptions[0]); 

  const [questionTypes, setQuestionTypes] = useState({
    trueFalse: false,
    multipleChoice: true,
    match: false,
    written: false,
  });

  const toggleQuestionType = (type) => {
    setQuestionTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = () => {
    const payload = {
      questionCount,
      answerType: answerType.value,
      questionTypes,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="max-w-xl">
      <div className="space-y-6">
        <p className="text-base text-gray-800">{title}</p>
        <h2 className="text-3xl font-extrabold text-gray-800">Thiết lập bài kiểm tra</h2>

        <div className="flex justify-between items-center">
          <span className="text-base text-gray-800 font-semibold">Câu hỏi (tối đa {maxQuestions})</span>
          <input
            type="number"
            min={1}
            max={maxQuestions}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-36 border-2 border-gray-200 rounded-3xl px-2 py-1"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-base text-gray-800 font-semibold">Trả lời bằng</span>
          <div className="">
            <Listbox value={answerType} onChange={setAnswerType}>
              <div className="relative">
                <Listbox.Button className="relative w-36 cursor-pointer rounded-3xl border-2 border-gray-200 py-2 pl-4 pr-10 text-left text-gray-600 font-semibold hover:bg-gray-100 focus:outline-none">
                  <span>{answerType.label}</span>
                  <span className="pointer-events-none absolute inset-y-0 -right-2 flex items-center pr-3">
                    <RiArrowDropDownLine className="w-10 h-10 text-gray-600" />
                  </span>
                </Listbox.Button>

                <Listbox.Options className="absolute z-0 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {answerOptions.map((opt, index) => (
                    <Listbox.Option
                      key={index}
                      value={opt}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-4 pr-4 text-gray-600 ${
                          active ? "bg-gray-100" : "text-gray-600"
                        }`
                      }
                    >
                      {opt.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>
                
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="w-48 bg-red-700 hover:bg-red-800 text-white font-medium py-2 rounded-3xl "
          >
            Bắt đầu làm kiểm tra
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QuizModal;
