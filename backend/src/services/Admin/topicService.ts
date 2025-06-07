import db from "../../models";

const addTopic = async (topic: any): Promise<any> => {
  try {
    return await db.vocabularyTopic.create({ ...topic });
  } catch (error) {
    throw error;
  }
};

const deleteTopic = async (topic_id: string): Promise<boolean> => {
  try {
    await db.vocabularyTopic.destroy({ where: { topic_id } });
    return true;
  } catch (error) {
    throw new Error("Error deleting topic");
  }
};

const updateTopic = async (
  topic_id: string,
  updateFields: Record<string, any>
): Promise<boolean> => {
  try {
    await db.vocabularyTopic.update(
      { ...updateFields },
      { where: { topic_id } }
    );
    return true;
  } catch (error) {
    throw new Error("Error updating topic");
  }
};

const getAllTopic = async (): Promise<any> => {
  try {
    const allTopic = await db.vocabularyTopic.findAll({
      include: [
        {
          model: db.vocabulary,
          required: false,
        },
      ],
    });
    return allTopic;
  } catch (error) {
    throw new Error("Error fetching all topics");
  }
};

const getTopicById = async (topic_id: string): Promise<any> => {
  try {
    const topic = await db.vocabularyTopic.findOne({
      where: { topic_id },
      include: [
        {
          model: db.vocabulary,
          required: false,
        },
      ],
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
