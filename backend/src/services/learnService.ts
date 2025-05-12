import db from "../models";
import shuffleArray from "../utils/shuffleArray";

const addFlashcardToLearn = async (list_id: string, user_id: string) => {
  try {
    const flashcards = await db.flashcard.findAll({
      where: {
        list_id: list_id,
      },
    });
    for (const flashcard of flashcards) {
      const flashcardUser = await db.flashcardUser.findOne({
        where: {
          flashcard_id: flashcard.flashcard_id,
          user_id: user_id,
        },
      });
      if (!flashcardUser) {
        await db.flashcardUser.create({
          flashcard_id: flashcard.flashcard_id,
          user_id: user_id,
          created_at: new Date(),
        });
      }
    }
    return true;
  } catch (error) {
    throw new Error("Error adding flashcard to learn");
  }
};

const remenberFlashcard = async (
  flashcard_ids: string[],
  user_id: string,
  list_id: string
) => {
  try {
    for (const flashcard_id of flashcard_ids) {
      await db.flashcardUser.update(
        {
          remember_status: true,
          last_review: new Date(),
        },
        {
          where: {
            flashcard_id: flashcard_id,
            user_id: user_id,
          },
        }
      );
    }
    await db.flashcardStudy.update(
      {
        number_word_forget:
          db.flashcardStudy.number_word_forget - flashcard_ids.length,
      },
      { where: { list_id: list_id, user_id: user_id } }
    );
    return true;
  } catch (error) {
    throw new Error("Error remembering flashcard");
  }
};

const notRemenberFlashcard = async (
  flashcard_ids: string[],
  user_id: string,
  list_id: string
) => {
  try {
    for (const flashcard_id of flashcard_ids) {
      const flashcardUser = await db.flashcardUser.findOne({
        where: {
          flashcard_id: flashcard_id,
          user_id: user_id,
        },
      });
      if (!flashcardUser) {
        throw new Error("Flashcard not found");
      }
      await db.flashcardUser.update(
        {
          remember_status: false,
          review_count: flashcardUser.review_count + 1,
          last_review: new Date(),
        },
        {
          where: {
            flashcard_id: flashcard_id,
            user_id: user_id,
          },
        }
      );
    }
    await db.flashcardStudy.update(
      {
        number_word_forget:
          db.flashcardStudy.number_word_forget + flashcard_ids.length,
      },
      { where: { list_id: list_id, user_id: user_id } }
    );
    return true;
  } catch (error) {
    throw new Error("Error not remembering flashcard");
  }
};

const saveProcess = async (
  list_id: string,
  user_id: string,
  number_word_forget: number,
  flashcard_id: string
) => {
  try {
    const flashcardStudy = await db.flashcardStudy.findOne({
      where: {
        list_id: list_id,
        user_id: user_id,
      },
    });
    if (!flashcardStudy) {
      await db.flashcardStudy.create({
        list_id: list_id,
        user_id: user_id,
        last_review_flashcard_id: flashcard_id,
        last_accessed: new Date(),
        number_word_forget: number_word_forget,
      });
    } else {
      await db.flashcardStudy.update(
        {
          last_review_flashcard_id: flashcard_id,
          last_accessed: new Date(),
          number_word_forget: number_word_forget,
        },
        {
          where: {
            list_id: list_id,
            user_id: user_id,
          },
        }
      );
    }
    return true;
  } catch (error) {
    throw new Error("Error saving process");
  }
};

const getFlashCardLearn = async (list_id: string, user_id: string) => {
  try {
    const listFlashcard = await db.flashcardStudy.findOne({
      where: {
        list_id: list_id,
        user_id: user_id,
      },
    });
    if (!listFlashcard) {
      throw new Error("List flashcard not found");
    }

    const flashcards = await db.flashcard.findAll({
      where: {
        list_id: list_id,
      },
      include: [
        {
          model: db.flashcardUser,
          attributes: ["last_review"],
          where: {
            remember_status: false,
            user_id: user_id,
          },
        },
      ],
      order: [[db.flashcardUser, "last_review", "ASC"]],
    });

    const shuffleFlashcards = shuffleArray([...flashcards]);

    if (listFlashcard.last_review_flashcard_id) {
      const index = shuffleFlashcards.findIndex(
        (flashcard: any) =>
          flashcard.flashcard_id === listFlashcard.last_review_flashcard_id
      );
      if (index !== -1) {
        const [targetFlashcard] = shuffleFlashcards.splice(index, 1);
        shuffleFlashcards.unshift(targetFlashcard);
      }
    }

    // Tính số nhóm và số flashcard mỗi nhóm
    const totalFlashcards = listFlashcard.number_word_forget; // Tổng số flashcard chưa nhớ

    // Xác định số nhóm (total_groups) động
    const total_groups = Math.max(1, Math.ceil(Math.sqrt(totalFlashcards)));

    // Tính số flashcard mỗi nhóm (process)
    const process = Math.ceil(totalFlashcards / total_groups);

    return {
      listStudyInfor: listFlashcard,
      flashcards: shuffleFlashcards,
      flashcardInGroup: process, // Số flashcard mỗi nhóm
      total_groups: total_groups, // Tổng số nhóm
    };
  } catch (error) {
    throw new Error("Error getting flashcard learn");
  }
};

const resetLearn = async (list_id: string, user_id: string) => {
  try {
    // Lấy tất cả flashcard thuộc list_id
    const flashcards = await db.flashcard.findAll({
      where: {
        list_id: list_id,
      },
      attributes: ["flashcard_id"], // Chỉ lấy flashcard_id để tối ưu
    });

    if (flashcards.length === 0) {
      // Nếu không có flashcard, vẫn cập nhật flashcardStudy và trả về true
      await db.flashcardStudy.update(
        {
          number_word_forget: 0,
          last_review_flashcard_id: null,
        },
        {
          where: {
            list_id: list_id,
            user_id: user_id,
          },
        }
      );
      return true;
    }

    // Lấy danh sách flashcard_id
    const flashCardIds = flashcards.map(
      (flashcard: any) => flashcard.flashcard_id
    );

    // Cập nhật tất cả flashcardUser cùng lúc
    await db.flashcardUser.update(
      {
        remember_status: false,
      },
      {
        where: {
          flashcard_id: {
            [db.Sequelize.Op.in]: flashCardIds, // Sử dụng IN để cập nhật nhiều bản ghi
          },
          user_id: user_id,
        },
      }
    );

    // Cập nhật flashcardStudy
    await db.flashcardStudy.update(
      {
        number_word_forget: flashCardIds.length,
        last_review_flashcard_id: null,
      },
      {
        where: {
          list_id: list_id,
          user_id: user_id,
        },
      }
    );

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Error resetting learn");
  }
};

export {
  addFlashcardToLearn,
  remenberFlashcard,
  notRemenberFlashcard,
  saveProcess,
  getFlashCardLearn,
  resetLearn,
};
