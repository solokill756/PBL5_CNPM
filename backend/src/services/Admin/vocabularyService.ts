import db from "../../models";

const addVocabulary = async (vocabularys: any[]): Promise<boolean> => {
  try {
    if (!Array.isArray(vocabularys) || vocabularys.length === 0) {
      throw new Error("Invalid input: vocabularys must be a non-empty array");
    }
    for (const vocabulary of vocabularys) {
      await db.vocabularyTopic.update(
        { vocab_count: db.sequelize.literal("vocab_count + 1") },
        { where: { topic_id: vocabulary.topic_id } }
      );
    }
    await db.vocabulary.bulkCreate(vocabularys);
    return true;
  } catch (error) {
    throw error;
  }
};

const deleteVocabulary = async (vocabulary_id: string): Promise<boolean> => {
  try {
    await db.vocabulary.destroy({ where: { vocab_id: vocabulary_id } });
    return true;
  } catch (error) {
    throw new Error("Error deleting vocabulary");
  }
};

const updateVocabulary = async (
  vocabulary_id: string,
  updateFields: Record<string, any>
): Promise<boolean> => {
  try {
    await db.vocabulary.update(
      { ...updateFields },
      { where: { vocab_id: vocabulary_id } }
    );
    return true;
  } catch (error) {
    throw new Error("Error updating vocabulary");
  }
};

const getAllVocabulary = async (): Promise<any> => {
  try {
    const allVocabulary = await db.vocabulary.findAll({
      include: [
        {
          model: db.vocabularyTopic,
          as: "Topic",
          required: false,
        },
      ],
    });
    return allVocabulary;
  } catch (error) {
    throw new Error("Error fetching all vocabulary");
  }
};

const getVocabularyById = async (vocabulary_id: string): Promise<any> => {
  try {
    const vocabulary = await db.vocabulary.findOne({
      where: { vocab_id: vocabulary_id },
      include: [
        {
          model: db.vocabularyTopic,
          as: "Topic",
          required: false,
        },
      ],
    });
    return vocabulary;
  } catch (error) {
    throw new Error("Error fetching vocabulary by ID");
  }
};

export default {
  addVocabulary,
  deleteVocabulary,
  updateVocabulary,
  getAllVocabulary,
  getVocabularyById,
};
