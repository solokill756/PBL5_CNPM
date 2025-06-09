import db from "../../models";

const addListFlashCard = async (
  user_id: string,
  tile: string,
  description: string,
  flashcards: any[]
) => {
  try {
    const listFlashcard = await db.listFlashcard.create({
      user_id,
      title: tile,
      description,
    });

    for (const flashcard of flashcards) {
      await db.flashcard.create({
        list_id: listFlashcard.list_id,
        front_text: flashcard.front_text,
        back_text: flashcard.back_text,
      });
    }
    return listFlashcard;
  } catch (error) {}
};

const deleteListFlashCard = async (list_id: string) => {
  try {
    await db.flashcard.destroy({ where: { list_id } });
    await db.listFlashcard.destroy({ where: { list_id } });
    return true;
  } catch (error) {
    throw new Error("Error deleting list flashcard");
  }
};

const updateListFlashCard = async (
  list_id: string,
  updateFields: Record<string, any>
) => {
  const { flashcards, ...fieldsToUpdate } = updateFields;
  try {
    if (Object.keys(fieldsToUpdate).length > 0) {
      await db.listFlashcard.update(
        { ...fieldsToUpdate },
        { where: { list_id } }
      );
    }
    await db.flashcard.destroy({ where: { list_id } });
    for (const flashcard of flashcards) {
      await db.flashcard.create({
        list_id,
        front_text: flashcard.front_text,
        back_text: flashcard.back_text,
      });
    }
  } catch (error) {
    throw new Error("Error updating list flashcard");
  }
};

const getForgetFlashcard = async (length: Number, user_id: string) => {
  try {
    const flashcards = await db.flashcardUser.findAll({
      order: [
        ["last_review", "ASC"],
        ["review_count", "DESC"],
      ],
      where: {
        user_id,
      },
      limit: length,
      include: [
        {
          model: db.flashcard,
        },
      ],
    });
    return flashcards;
  } catch (error) {
    throw new Error("Error retrieving forget flashcards");
  }
};

export default {
  getForgetFlashcard,
  addListFlashCard,
  deleteListFlashCard,
  updateListFlashCard,
};
