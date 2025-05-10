import React from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, children, size = "max-w-2xl" }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
      onClick={handleOverlayClick} 
    >
      <div className={`relative w-full ${size} max-h-full`}>
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="p-5">
            {children}
          </div>
        </div>
        <button className="absolute p-3 top-0 right-0" onClick={onClose}><IoClose className="size-6"/></button>
      </div>
    </div>
  );
};

export default Modal;
