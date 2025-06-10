import { IoIosDoneAll } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { io } from "socket.io-client";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const { accessToken } = useAuthStore();
  const user_id = useAuthStore((state) => state.user?.id);
  const socketRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      try {
        if (!accessToken || !user_id) {
          setConnectionError("Thiếu token xác thực hoặc ID người dùng");
          return;
        }

        socketRef.current = io("https://backendserver-app.azurewebsites.net", {
          auth: { token: accessToken },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 30000,
        });

        socketRef.current.on("connect", () => {
          console.log("Đã kết nối Socket.IO");
          setConnected(true);
          setConnectionError("");
          socketRef.current.emit("register", user_id);
          console.log("Sent register with user_id:", user_id);
        });

        socketRef.current.on("notification", (data) => {
          console.log("Received notification data:", data);
          
          if (data.notifications) {
            console.log("Setting notifications:", data.notifications);
            setNotifications(data.notifications);
          }
          
          if (data.newNotification) {
            console.log("Adding new notification:", data.newNotification);
            setNotifications((prev) => {
              if (prev.some((n) => n.notification_id === data.newNotification.notification_id)) {
                return prev;
              }
              return [data.newNotification, ...prev];
            });
          }
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("Lỗi kết nối Socket.IO:", error);
          setConnected(false);
          setConnectionError("Lỗi kết nối: " + (error.message || "Không thể kết nối tới server"));
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("Socket.IO đã ngắt kết nối:", reason);
          setConnected(false);
          if (reason !== "io client disconnect") {
            setConnectionError("Mất kết nối: " + reason);
          }
        });

        socketRef.current.on("error", (error) => {
          console.error("Socket error:", error);
          setConnectionError("Lỗi socket: " + error.message);
        });
      } catch (error) {
        console.error("Lỗi khởi tạo Socket.IO:", error);
        setConnectionError("Lỗi khởi tạo kết nối");
      }
    };

    if (accessToken && user_id) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [accessToken, user_id]);

  const markAsRead = (notification) => {
    if (!socketRef.current || !user_id) {
      setConnectionError("Thiếu kết nối socket hoặc ID người dùng");
      return;
    }
    
    try {
      socketRef.current.emit("mark_as_read", {
        notification_id: notification.notification_id,
        user_id: user_id
      });
      
      setNotifications(prev => 
        prev.filter(n => n.notification_id !== notification.notification_id)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setConnectionError("Lỗi khi đánh dấu thông báo là đã đọc");
    }
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
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    {notification.title && (
                      <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                    )}
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => markAsRead(notification)}
                    className="relative group"
                    aria-label="Đánh dấu đã đọc"
                  >
                    <IoIosDoneAll
                      size={30}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    />
                    <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Đánh dấu đã đọc
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}