import { filterUserData } from "../../helpers/fillData";
import { sendRequestNewVocabularyEmail } from "../../helpers/sendRequestNewVocabulary";
import db from "../../models";
import dotenv from "dotenv";
import achivermentService from "./achivermentService";
dotenv.config();

const getTopicVocabularyByID = async (topic_id: string) => {
  try {
    const topic = await db.vocabularyTopic.findByPk(topic_id);
    return topic;
  } catch (error) {
    throw error;
  }
};

const getSimilarVocabulary = async (word: string, language: string) => {
  try {
    if (language == "Japanese") {
      const vocabularies = await db.vocabulary.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            {
              word: {
                [db.Sequelize.Op.like]: `%${word}%`,
              },
            },
            {
              pronunciation: {
                [db.Sequelize.Op.like]: `%${word}%`,
              },
            },
          ],
        },
      });
      return vocabularies;
    } else {
      const vocabularies = await db.vocabulary.findAll({
        where: {
          meaning: {
            [db.Sequelize.Op.like]: `%${word}%`,
          },
        },
      });
      return vocabularies;
    }
  } catch (error) {
    throw error;
  }
};

const getAllTopic = async (user_id: string) => {
  try {
    const topics = await db.vocabularyTopic.findAll({
      include: [
        {
          model: db.vocabularyTopicUser,
          attributes: ["mastered_words"],
          where: { user_id },
          required: false,
        },
      ],
      where: { is_show: true },
    });
    return topics;
  } catch (error) {
    throw error;
  }
};
const getVocabularyByTopic = async (topic_id: string, user_id: string) => {
  try {
    const vocabularies = await db.vocabulary.findAll({
      where: { topic_id, is_show: true },
      include: [
        {
          model: db.vocabularyUser,
          attributes: ["is_saved", "had_learned"],
          where: { user_id },
          required: false,
        },
      ],
    });
    const checkTopicLearn = await db.vocabularyTopicUser.findOne({
      where: { topic_id, user_id },
    });
    if (!checkTopicLearn) {
      await db.vocabularyTopicUser.create({
        topic_id,
        user_id,
        mastered_words: 0,
      });
    }
    return vocabularies;
  } catch (error) {
    throw error;
  }
};

const updateVocabularyUser = async (
  user_id: string,
  vocabulary_id: string,
  topic_id: string,
  is_saved?: boolean,
  had_learned?: boolean
) => {
  try {
    const vocabularyUser = await db.vocabularyUser.findOne({
      where: { user_id, vocabulary_id },
    });
    if (!vocabularyUser) {
      if (had_learned == true) {
        await db.vocabularyTopicUser.update(
          {
            mastered_words: db.Sequelize.literal(`mastered_words + 1`),
          },
          {
            where: { user_id, topic_id: topic_id },
          }
        );
        await checkLevelUser(user_id, 10);
      }
      await db.vocabularyUser.create({
        user_id,
        vocabulary_id,
        is_saved: is_saved ?? false,
        had_learned: had_learned ?? false,
      });
    } else {
      if (had_learned == false) {
        await db.vocabularyTopicUser.update(
          {
            mastered_words: db.Sequelize.literal(
              `CASE WHEN mastered_words - 1 < 0 THEN 0 ELSE mastered_words - 1 END`
            ),
          },
          {
            where: { user_id, topic_id: topic_id },
          }
        );
        await checkLevelUser(user_id, -10);
      } else if (had_learned == true) {
        await db.vocabularyTopicUser.update(
          {
            mastered_words: db.Sequelize.literal(`mastered_words + 1`),
          },
          {
            where: { user_id, topic_id: topic_id },
          }
        );
        await checkLevelUser(user_id, 10);
      }
      if (is_saved != undefined && had_learned != undefined) {
        await db.vocabularyUser.update(
          { is_saved, had_learned },
          { where: { user_id, vocabulary_id } }
        );
      } else if (is_saved != undefined) {
        await db.vocabularyUser.update(
          { is_saved },
          { where: { user_id, vocabulary_id } }
        );
      } else if (had_learned != undefined) {
        await db.vocabularyUser.update(
          { had_learned },
          { where: { user_id, vocabulary_id } }
        );
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const requestNewVocabulary = async (
  word: string,
  email: string,
  comment: string
) => {
  try {
    await sendRequestNewVocabularyEmail(word, email, comment);
    return true;
  } catch (error) {
    throw error;
  }
};

const getAlToFindVocabulary = async (
  word: string,
  language: string,
  user_id: string
) => {
  try {
    const response = await fetch(
      "http://itkotoba-al-server.azurewebsites.net/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          word: word,
          language: language,
        }),
      }
    );
    const data = await response.json();
    if (language == "Japanese") {
      let findTopic = await db.vocabularyTopic.findOne({
        where: {
          name: data.data.topic.trim(),
        },
      });
      if (!findTopic) {
        findTopic = await db.vocabularyTopic.create({
          name: data.data.topic.trim(),
          description: data.data.description.trim(),
        });
      }
      let result = await db.vocabulary.findOne({
        where: {
          word: data.data.word.trim(),
        },
      });
      if (!result) {
        result = await db.vocabulary.create({
          word: data.data.word,
          pronunciation: data.data.pronunciation,
          meaning: data.data.meaning,
          example: data.data.example,
          usage: data.data.usage,
          example_meaning: data.data.example_meaning,
          level: data.data.level,
          type: data.data.type,
          topic_id: findTopic.topic_id,
          ai_suggested: "1",
          language: "Japanese",
        });
        await db.vocabularyTopic.update(
          {
            mastered_words: db.Sequelize.literal(`mastered_words + 1`),
          },
          {
            where: {
              topic_id: findTopic.topic_id,
              user_id: user_id,
            },
          }
        );
      }
      await addHistorySearch(user_id, result.vocab_id);
    }
    if (language == "Vietnamese") {
      let findTopic = await db.vocabularyTopic.findOne({
        where: { name: data.data.topic.trim() },
      });
      if (!findTopic) {
        findTopic = await db.vocabularyTopic.create({
          name: data.data.topic.trim(),
          description: data.data.description.trim(),
        });
      }
      let result = await db.vocabulary.findOne({
        where: {
          word: data.data.word.trim(),
        },
      });
      if (!result) {
        result = await db.vocabulary.create({
          word: data.data.meaning,
          meaning: data.data.word,
          type: data.data.type,
          topic_id: findTopic.topic_id,
          pronunciation: data.data.pronunciation,
          example: data.data.example,
          usage: data.data.usage,
          example_meaning: data.data.example_meaning,
          level: data.data.level,
          ai_suggested: "1",
          language: "Vietnamese",
        });
        await db.vocabularyTopic.update(
          {
            mastered_words: db.Sequelize.literal(`mastered_words + 1`),
          },
          {
            where: {
              topic_id: findTopic.topic_id,
              user_id: user_id,
            },
          }
        );
      }
      await addHistorySearch(user_id, result.vocab_id);
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

const getHistorySearch = async (user_id: string) => {
  try {
    const history = await db.searchHistory.findAll({
      where: { user_id },
      attributes: ["searched_at", "vocab_id"],
      include: [
        {
          model: db.vocabulary,
          attributes: [
            "word",
            "pronunciation",
            "meaning",
            "example",
            "usage",
            "example_meaning",
          ],
        },
      ],
      order: [["searched_at", "DESC"]],
    });
    return history;
  } catch (error) {
    throw error;
  }
};
const checkLevelUser = async (user_id: string, new_points: number) => {
  try {
    const user = await db.user.findByPk(user_id);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.total_points + new_points >= user.levelThreshold) {
      let level = user.current_level;
      let userTotalPoints = user.total_points + new_points;
      let userLevelThreshold = user.levelThreshold;
      while (userTotalPoints >= userLevelThreshold) {
        level += 1;
        userTotalPoints -= userLevelThreshold;
        await achivermentService.unlockAchievement(user_id, level);
        userLevelThreshold = level * 500;
      }
      await db.user.update(
        {
          current_level: level,
          total_points: userTotalPoints > 0 ? userTotalPoints : 0,
          levelThreshold: userLevelThreshold,
        },
        {
          where: { user_id },
        }
      );
    } else {
      await db.user.update(
        {
          total_points:
            user.total_points + new_points > 0
              ? user.total_points + new_points
              : 0,
        },
        {
          where: { user_id },
        }
      );
    }
    const userData = filterUserData(user);
    return userData;
  } catch (error) {
    throw error;
  }
};

const addHistorySearch = async (user_id: string, vocabulary_id: string) => {
  try {
    const vocabulary = await db.vocabulary.findByPk(vocabulary_id);
    if (!vocabulary) {
      throw new Error("Vocabulary not found");
    }
    const existingHistory = await db.searchHistory.findOne({
      where: { user_id, vocab_id: vocabulary_id },
    });
    if (existingHistory) {
      await db.searchHistory.update(
        {
          searched_at: new Date(),
        },
        {
          where: { user_id, vocab_id: vocabulary_id },
        }
      );
    } else {
      await db.searchHistory.create({
        user_id,
        vocab_id: vocabulary_id,
        searched_at: new Date(),
      });
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const checkTopicHasListFlashcard = async (topic_id: string) => {
  const topic = await db.vocabularyTopic.findByPk(topic_id);
  const check = await db.listFlashcard.findOne({
    where: {
      title: topic.name,
    },
  });
  if (check) {
    return true;
  } else {
    return false;
  }
};

const getFlashCardOftopic = async (topic_id: string, user_id: string) => {
  try {
    const list_vocab = await db.vocabulary.findAll({
      where: {
        topic_id,
      },
    });
    const topic = await db.vocabularyTopic.findByPk(topic_id);
    const check = await db.listFlashcard.findOne({
      where: {
        title: topic.name,
      },
    });
    if (check) {
      const flashcards = await db.flashcard.findAll({
        where: {
          list_id: check.list_id,
        },
      });
      return {
        listFlashcard: check,
        flashcards: flashcards,
        hasCreated: true,
      };
    } else {
      const listFlashcard = await db.listFlashcard.create({
        title: topic.name,
        description: topic.description,
        user_id: user_id,
      });
      const flashcards = list_vocab.map((item: any) => {
        return {
          front_text: item.word,
          back_text: item.meaning,
          list_id: listFlashcard.list_id,
          custom_note: item.example,
        };
      });
      await db.flashcardStudy.create({
        list_id: listFlashcard.list_id,
        user_id: user_id,
        last_accessed: Date.now(),
      });
      try {
        const flashcardPromises = flashcards.map((flashcard: any) => {
          return db.flashcard
            .create({
              ...flashcard,
            })
            .catch((_error: any) => {
              return null; // Trả về null nếu lỗi, không làm fail toàn bộ
            });
        });

        const results = await Promise.all(flashcardPromises);
        const successCount = results.filter((result) => result !== null).length;
        const failCount = results.length - successCount;

        console.log(
          `Flashcard creation completed: ${successCount} success, ${failCount} failed`
        );

        if (failCount > 0) {
          console.warn(`${failCount} flashcards failed to create`);
        }
        return {
          listFlashcard: listFlashcard,
          flashcards: flashcards,
          hasCreated: false,
        };
      } catch (error: any) {
        console.error("Error in flashcard creation process:", error);
        throw new Error(`Failed to create flashcards: ${error.message}`);
      }
    }
  } catch (error) {
    throw error;
  }
};

export default {
  getSimilarVocabulary,
  getVocabularyByTopic,
  getAlToFindVocabulary,
  requestNewVocabulary,
  getAllTopic,
  getHistorySearch,
  addHistorySearch,
  checkLevelUser,
  updateVocabularyUser,
  getTopicVocabularyByID,
  getFlashCardOftopic,
  checkTopicHasListFlashcard,
};
