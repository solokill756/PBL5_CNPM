import { IoIosDoneAll } from "react-icons/io";
import { useState } from "react";

export default function NotificationCard() {
  const [notifications, setNotifications] = useState([
    "Bạn có lịch học từ lớp ITNIHONGO",
    "Bộ flashcard Điện toán đám mây đã được thêm vào lớp ITNIHONGO", 
    "Bạn đã tạo lớp ITNIHONGO",
    "Chúc mừng bạn đã mở khoá Level 2",
  ]);

  const markAsRead = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

   return (
    <div className="min-h-screen p-5">
      <div className=" mx-auto bg-white rounded-2xl p-5 shadow-lg">
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-800 text-lg font-medium leading-relaxed hover:bg-gray-100 transition duration-200 cursor-pointer"
            >
            <div className="flex items-center justify-between">
              {notification}
              <div className="relative group">
                <IoIosDoneAll 
                  size={30} 
                  className="text-green-600 hover:text-green-800 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(index);
                  }}
                />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-sm font-medium shadow-md px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Đánh dấu là đã đọc
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}