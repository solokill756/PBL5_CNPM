import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircle, IoWarningOutline, IoInformationCircle, IoClose } from "react-icons/io5";
import { useToast, TOAST_TYPES } from "@/context/ToastContext";

// Toast component
const Toast = ({ id, type, message, onClose }) => {
  // Define styles based on toast type
  let bgColor, textColor, borderColor, icon;
  
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      bgColor = "bg-gradient-to-r from-green-50 to-emerald-50";
      textColor = "text-emerald-700";
      borderColor = "border-emerald-200";
      icon = <IoCheckmarkCircle className="w-5 h-5 text-emerald-500" />;
      break;
    case TOAST_TYPES.ERROR:
      bgColor = "bg-gradient-to-r from-red-50 to-rose-50";
      textColor = "text-rose-700";
      borderColor = "border-rose-200";
      icon = <IoWarningOutline className="w-5 h-5 text-rose-500" />;
      break;
    default:
      bgColor = "bg-gradient-to-r from-blue-50 to-indigo-50";
      textColor = "text-indigo-700";
      borderColor = "border-indigo-200";
      icon = <IoInformationCircle className="w-5 h-5 text-indigo-500" />;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg border ${borderColor} flex items-center justify-between min-w-[280px] max-w-sm`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <p className="font-medium text-sm">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <IoClose className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

// Toast container
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;