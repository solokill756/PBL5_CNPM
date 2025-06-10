import db from "../../models";
import { io } from "../../server";

const addTopic = async (topic: any): Promise<any> => {
  try {
    const data = await db.vocabularyTopic.create({ ...topic });

    const payload = {
      title: "Bộ Topic mới",
      message: `Bộ Topic mới ${data.name} vừa được thêm vào hệ thống.`,
      timestamp: Date.now(),
    };
    const activeUsers = await db.user.findAll({
      where: { role: "user" },
      attributes: ["user_id"],
    });

    // Create notifications for all active users
    const notificationPromises = activeUsers.map((user: any) =>
      db.notification.create({
        ...payload,
        user_id: user.user_id,
      })
    );
    await Promise.all(notificationPromises);
    console.log(`Notification saved for ${activeUsers.length} users`);
    io.emit("notification", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteTopic = async (topic_id: string): Promise<boolean> => {
  try {
    const data = await db.vocabularyTopic.findOne({ where: { topic_id } });
    await db.vocabularyTopic.destroy({ where: { topic_id } });
    const deletePayload = {
      title: "🗑️ Topic đã được xóa",
      message: `Topic "${data.name}" đã được xóa khỏi hệ thống.`,
      created_at: Date.now(),
    };
    const activeUsers = await db.user.findAll({
      where: { role: "user" },
      attributes: ["user_id"],
    });

    // Create notifications for all active users
    const notificationPromises = activeUsers.map((user: any) =>
      db.notification.create({
        ...deletePayload,
        user_id: user.user_id,
      })
    );

    await Promise.all(notificationPromises);
    console.log(`Notification saved for ${activeUsers.length} users`);
    io.emit("notification", deletePayload);
    try {
      io.emit("notification", deletePayload);
    } catch (socketError) {
      console.error("Error sending deletion notification:", socketError);
    }
    return data;
  } catch (error) {
    throw new Error("Error deleting topic");
  }
};

const updateTopic = async (
  topic_id: string,
  updateFields: Record<string, any>
): Promise<boolean> => {
  try {
    const data = await db.vocabularyTopic.update(
      { ...updateFields },
      { where: { topic_id } }
    );
    const updatePayload = {
      title: "📝 Topic đã được cập nhật",
      message: `Topic "${updateTopic.name}" đã được cập nhật với thông tin mới.`,
      created_at: Date.now(),
    };
    const activeUsers = await db.user.findAll({
      where: { role: "user" },
      attributes: ["user_id"],
    });

    // Create notifications for all active users
    const notificationPromises = activeUsers.map((user: any) =>
      db.notification.create({
        ...updatePayload,
        user_id: user.user_id,
      })
    );

    await Promise.all(notificationPromises);
    console.log(`Notification saved for ${activeUsers.length} users`);
    try {
      io.emit("notification", updatePayload);
    } catch (socketError) {
      console.error("Error sending update notification:", socketError);
    }
    return data;
  } catch (error) {
    throw new Error("Error updating topic");
  }
};

const getAllTopic = async (): Promise<any> => {
  try {
    const allTopic = await db.vocabularyTopic.findAll();
    return allTopic;
  } catch (error) {
    throw new Error("Error fetching all topics");
  }
};

const getTopicById = async (topic_id: string): Promise<any> => {
  try {
    const topic = await db.vocabularyTopic.findOne({
      where: { topic_id },
    });
    if (!topic) {
      throw new Error("Topic not found");
    }
    return topic;
  } catch (error) {
    throw new Error("Error fetching topic by ID");
  }
};

export default {
  addTopic,
  deleteTopic,
  updateTopic,
  getAllTopic,
  getTopicById,
};
