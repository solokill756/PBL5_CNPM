import React, { useState } from "react";
import Modal from "./Modal";
import { FiEdit } from "react-icons/fi";

const Infor = ({
  title,
  infor,
  operation,
  confirm,
  note,
  type,
  value,
  onchange,
  placeholder,
  onSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSave = () => {
    setIsModalOpen(false);
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 text-left ">
          {title}
        </h4>
        <span className="text-base font-normal text-gray-600 dark:text-gray-400">
          {infor}
        </span>
      </div>
      <div className="w-32 flex items-center justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className=" hover:bg-red-100 hover:rounded-3xl pl-6 pr-6 pt-3 pb-3"
        >
          <span className="text-red-800 font-semibold">{operation}</span>
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiEdit className="text-xl text-gray-700" />
            <h2 className="text-xl font-bold text-gray-800">{confirm}</h2>
          </div>

          <p className="mb-4 text-md font-normal text-gray-500">{note}</p>
          <div>
            <input
              type={type}
              value={value}
              onChange={onchange}
              placeholder={placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-row gap-4 justify-center mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-white text-gray-500 border border-gray-300 hover:bg-gray-200 px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              Huỷ
            </button>
            <button
              onClick={handleSave}
              className="bg-red-800 text-white hover:bg-red-700 px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              Lưu
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Infor;