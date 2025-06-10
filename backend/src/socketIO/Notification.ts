import { Server, Socket } from "socket.io";
import db from "../models";

interface NotificationPayload {
  title: string;
  message: string;
  created_at: number;
  user_id: string;
  is_read: string;
}

interface ReminderCheckData {
  user_id: string;
  timezone?: string;
}

const getCurrentTimestamp = (): number => {
  return Date.now();
};

export function setupNotificationSocket(io: Server) {
  const userSocketMap = new Map<string, string>();
  const reminderIntervals = new Map<string, NodeJS.Timeout>();
  const dataNofications = new Map<string, any[]>();

  const formatDateTime = (
    timestamp: number,
    timezone: string = "Asia/Ho_Chi_Minh"
  ): string => {
    return new Date(timestamp).toLocaleString("vi-VN", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getCurrentTimeInTimezone = (
    timezone: string = "Asia/Ho_Chi_Minh"
  ): Date => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
  };

  const parseTimeString = (
    timeString: string
  ): { hours: number; minutes: number } => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return { hours, minutes };
  };

  const getNextReminderTimestamp = (
    reminderTime: string,
    timezone: string = "Asia/Ho_Chi_Minh"
  ): number => {
    const { hours, minutes } = parseTimeString(reminderTime);
    const now = getCurrentTimeInTimezone(timezone);

    // Tạo thời gian reminder cho hôm nay
    const todayReminder = new Date(now);
    todayReminder.setHours(hours, minutes, 0, 0);

    // Nếu thời gian reminder hôm nay đã qua, chuyển sang ngày mai
    if (todayReminder <= now) {
      todayReminder.setDate(todayReminder.getDate() + 1);
    }

    return todayReminder.getTime();
  };

  const isTimeToRemind = (
    reminderTime: string,
    timezone: string = "Asia/Ho_Chi_Minh",
    tolerance: number = 60000
  ): boolean => {
    const { hours, minutes } = parseTimeString(reminderTime);
    const now = getCurrentTimeInTimezone(timezone);

    // Tạo thời gian reminder cho hôm nay
    const todayReminder = new Date(now);
    todayReminder.setHours(hours, minutes, 0, 0);

    // Kiểm tra xem hiện tại có trong khoảng thời gian tolerance không
    const timeDiff = Math.abs(now.getTime() - todayReminder.getTime());
    return timeDiff <= tolerance;
  };

  const setupReminderForUser = async (user_id: string) => {
    try {
      const user = await db.user.findOne({
        where: {
          user_id: user_id,
        },
      });

      if (!user || !user.reminder_time || !user.reminder_status) {
        return;
      }

      // Clear existing reminder if any
      if (reminderIntervals.has(user_id)) {
        clearInterval(reminderIntervals.get(user_id)!);
      }

      // Set up new reminder interval (check every minute)
      const reminderInterval = setInterval(async () => {
        const timezone = user.timezone || "Asia/Ho_Chi_Minh";

        if (isTimeToRemind(user.reminder_time, timezone)) {
          // Send reminder notification
          const reminderNotification: NotificationPayload = {
            title: "🔔 Nhắc nhở hàng ngày",
            message:
              user.reminder_message ||
              "Đến giờ bắt đầu ngày mới để học từ vựng it Tiếng nhật tại ITKOTOBA rồi!",
            created_at: getCurrentTimestamp(),
            user_id: user_id,
            is_read: "false",
          };

          // Save notification to database
          await db.notification.create(reminderNotification);

          // Update notifications cache
          const updatedNotifications = await db.notification.findAll({
            where: { user_id: user_id },
            order: [["created_at", "DESC"]],
          });
          dataNofications.set(user_id, updatedNotifications);

          // Send to user if online
          if (userSocketMap.has(user_id)) {
            const targetSocketId = userSocketMap.get(user_id)!;

            const data = {
              newNofication: reminderNotification,
              nofications: updatedNotifications,
              timestamp: getCurrentTimestamp(),
              reminderTime: user.reminder_time,
            };

            io.to(targetSocketId).emit("notification", data);

            console.log(
              `Daily reminder sent to user ${user_id} at ${formatDateTime(
                getCurrentTimestamp(),
                timezone
              )}`
            );
          }

          // Log reminder activity
          console.log(
            `Daily reminder triggered for user ${user_id} at ${user.reminder_time}`
          );
        }
      }, 60000); // Check every minute

      reminderIntervals.set(user_id, reminderInterval);
      console.log(
        `Reminder setup completed for user ${user_id} at ${user.reminder_time}`
      );
    } catch (error) {
      console.error(`Error setting up reminder for user ${user_id}:`, error);
    }
  };

  io.on("connection", async (socket: Socket) => {
    console.log(
      `Socket connected: ${socket.id} at ${formatDateTime(
        getCurrentTimestamp()
      )}`
    );

    socket.on("register", async (user_id: string) => {
      try {
        userSocketMap.set(user_id, socket.id);

        // Load user notifications
        const notifications = await db.notification.findAll({
          where: {
            user_id: user_id,
          },
          order: [["created_at", "DESC"]],
        });

        dataNofications.set(user_id, notifications);

        // Setup reminder for this user
        await setupReminderForUser(user_id);

        console.log(`User ${user_id} registered and reminder setup initiated`);

        // Send current server time to client
        socket.emit("server-time", {
          timestamp: getCurrentTimestamp(),
          formatted: formatDateTime(getCurrentTimestamp()),
          timezone: "Asia/Ho_Chi_Minh",
        });
        // socket.emit("notification", {
        //   notifications: dataNofications.get(user_id),
        //   timestamp: getCurrentTimestamp(),
        // });
      } catch (error) {
        console.error(`Error registering user ${user_id}:`, error);
      }
    });

    socket.on("check-reminderTime", async (data: ReminderCheckData) => {
      try {
        const { user_id, timezone = "Asia/Ho_Chi_Minh" } = data;

        const user = await db.user.findOne({
          where: {
            user_id: user_id,
          },
        });

        if (!user) {
          socket.emit("reminder-check-result", {
            success: false,
            message: "User not found",
          });
          return;
        }

        const now = getCurrentTimeInTimezone(timezone);
        const currentTime = now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: timezone,
        });

        let reminderStatus = {
          current_time: currentTime,
          current_timestamp: getCurrentTimestamp(),
          user_reminder_time: user.reminder_time,
          reminder_status: user.reminder_status || false,
          reminder_message: user.reminder_message || "",
          timezone: timezone,
          is_time_to_remind: false,
          next_reminder_timestamp: null as number | null,
        };

        if (user.reminder_time && user.reminder_status) {
          reminderStatus.is_time_to_remind = isTimeToRemind(
            user.reminder_time,
            timezone
          );
          reminderStatus.next_reminder_timestamp = getNextReminderTimestamp(
            user.reminder_time,
            timezone
          );

          // If it's time to remind, send immediate notification
          if (reminderStatus.is_time_to_remind) {
            const immediateNotification: NotificationPayload = {
              title: "⏰ Thời gian nhắc nhở",
              message:
                user.reminder_message || "Đã đến thời gian nhắc nhở hàng ngày!",
              created_at: getCurrentTimestamp(),
              user_id: user_id,
              is_read: "false",
            };

            await db.notification.create(immediateNotification);

            const updatedNotifications = await db.notification.findAll({
              where: { user_id: user_id },
              order: [["created_at", "DESC"]],
            });

            dataNofications.set(user_id, updatedNotifications);

            socket.emit("notification", {
              newNofication: immediateNotification,
              nofications: updatedNotifications,
            });
          }
        }

        socket.emit("reminder-check-result", {
          success: true,
          data: reminderStatus,
        });
      } catch (error: any) {
        console.error("Error checking reminder time:", error);
        socket.emit("reminder-check-result", {
          success: false,
          message: "Error checking reminder time",
          error: error.message,
        });
      }
    });

    socket.on("get-current-time", () => {
      const now = getCurrentTimestamp();
      const vietnamTime = getCurrentTimeInTimezone("Asia/Ho_Chi_Minh");

      socket.emit("current-time", {
        timestamp: now,
        formatted: formatDateTime(now),
        time_only: vietnamTime.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        iso: new Date(now).toISOString(),
        timezone: "Asia/Ho_Chi_Minh",
      });
    });

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected: ${socket.id} at ${formatDateTime(
          getCurrentTimestamp()
        )}`
      );

      // Remove user from socket map and clear reminder
      for (const [user_id, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(user_id);

          // Clear reminder interval when user disconnects
          if (reminderIntervals.has(user_id)) {
            clearInterval(reminderIntervals.get(user_id)!);
            reminderIntervals.delete(user_id);
          }

          console.log(`User ${user_id} disconnected and reminder cleared`);
          break;
        }
      }
    });
  });

  // Cleanup function for graceful shutdown
  const cleanup = () => {
    console.log("Cleaning up notification socket...");
    for (const [, interval] of reminderIntervals.entries()) {
      clearInterval(interval);
    }
    reminderIntervals.clear();
    userSocketMap.clear();
    dataNofications.clear();
    console.log("Notification socket cleanup completed");
  };

  // Return cleanup function for use in server shutdown
  return { cleanup };
}
