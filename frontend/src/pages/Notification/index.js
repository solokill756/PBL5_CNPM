import { IoIosDoneAll } from "react-icons/io";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { io } from "socket.io-client";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const { accessToken } = useAuthStore();

  useEffect(() => {
    let socket;

    const connect = () => {
      try {
        if (!accessToken) {
          setConnectionError("Không có token xác thực");
          return;
        }

        socket = io("https://backendserver-app.azurewebsites.net", {
          auth: { token: accessToken },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 30000,
        });

        socket.on("connect", () => {
          console.log("Đã kết nối Socket.IO");
          setConnected(true);
          setConnectionError("");
        });

        socket.on("message", (data) => {
          console.log("Nhận tin:", data);
          try {
            setNotifications((prev) => [...prev, data.notification || data]);
          } catch (err) {
            console.error("Lỗi xử lý tin:", err);
          }
        });

        socket.on("connect_error", (error) => {
          console.error("Lỗi kết nối Socket.IO:", error);
          setConnected(false);
          setConnectionError("Lỗi kết nối: " + (error.message || "Không thể kết nối tới server"));
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket.IO đã ngắt kết nối:", reason);
          setConnected(false);
          if (reason !== "io client disconnect") {
            setConnectionError("Mất kết nối: " + reason);
          }
        });
      } catch (error) {
        console.error("Lỗi khởi tạo Socket.IO:", error);
        setConnectionError("Lỗi khởi tạo kết nối");
      }
    };

    connect();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [accessToken]);

  const markAsRead = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className={`text-sm ${connected ? "text-green-600" : "text-red-600"}`}>
              {connected ? "Đã kết nối" : "Mất kết nối"}
            </span>
          </div>
        </div>

        {connectionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {connectionError}
          </div>
        )}

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có thông báo nào</div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-800 text-lg font-medium leading-relaxed hover:bg-gray-100 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1 pr-4">{notification}</span>
                  <div className="relative group">
                    <IoIosDoneAll
                      size={30}
                      className="text-green-600 hover:text-green-800 cursor-pointer transition-colors duration-200"
                      onClick={() => markAsRead(index)}
                    />
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Đánh dấu là đã đọc
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}