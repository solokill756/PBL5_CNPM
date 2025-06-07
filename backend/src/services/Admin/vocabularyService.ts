import db from "../../models";

const addVocabulary = async (vocabulary: any): Promise<any> => {
  try {
    return await db.vocabulary.create({ ...vocabulary });
  } catch (error) {
    throw error;
  }
};

const deleteVocabulary = async (vocabulary_id: string): Promise<boolean> => {
  try {
    await db.vocabulary.destroy({ where: { vocabulary_id } });
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
      { where: { vocabulary_id } }
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
      where: { vocabulary_id },
      include: [
        {
          model: db.vocabularyTopic,
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
