import { filterUserData } from "../helpers/fillData";
import { sendRequestNewVocabularyEmail } from "../helpers/sendRequestNewVocabulary";
import db from "../models";
import dotenv from "dotenv";
dotenv.config();
const getSimilarVocabulary = async (word: string, language: string) => {
  try {
    if (language == "Japanese") {
      const vocabularies = await db.vocabulary.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            {
              word: {
                [db.Sequelize.Op.like]: `%${word}%`
              }
            },
            {
              pronunciation: {
                [db.Sequelize.Op.like]: `%${word}%`
              }
            }
          ]
        }
      });
      return vocabularies;
    } else {
      const vocabularies = await db.vocabulary.findAll({
        where: {
          meaning: {
            [db.Sequelize.Op.like]: `%${word}%`
          }
        }
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
      include: [{
        model: db.vocabularyTopicUser,
        attributes: ['mastered_words'],
        where: { user_id },
        required: false,
      },
     ],
    });
    return topics;
  } catch (error) {
    throw error;
  }
};
const getVocabularyByTopic = async (topic_id: string, user_id: string) => {
 try {
     const vocabularies = await db.vocabulary.findAll({
       where: { topic_id },
       include: [{
        model: db.vocabularyUser,
        attributes: ['is_saved', 'had_learned'],
        where: { user_id },
        required: false,
      },
     ],
     });
     return vocabularies;
 } catch (error) {
    throw error;
 }
};


const updateVocabularyUser = async (user_id: string, vocabulary_id: string, is_saved: boolean, had_learned: boolean) => {
  try {
    
    const vocabularyUser = await db.vocabularyUser.findOne({ where: { user_id, vocabulary_id } });
    if (!vocabularyUser) {
      if(had_learned) {
      await db.vocabularyTopicUser.update({
        mastered_words: db.Sequelize.literal(`mastered_words + 1`),
      }, {
        where: { user_id, topic_id: vocabulary_id }
      });
      await checkLevelUser(user_id, 10);
    }
      await db.vocabularyUser.create({ user_id, vocabulary_id, is_saved, had_learned });
    } 
    else {
      if(!had_learned) {
        await db.vocabularyTopicUser.update({
          mastered_words: db.Sequelize.literal(`mastered_words - 1`),
        }, {
          where: { user_id, topic_id: vocabulary_id }
        });
        await checkLevelUser(user_id, -10);
      }
      await db.vocabularyUser.update({ is_saved, had_learned }, { where: { user_id, vocabulary_id } });
    }
    return true;
  } catch (error) {
    throw error;
  }
} 

const requestNewVocabulary = async (word: string, email: string , comment: string) => {
   try {
      await sendRequestNewVocabularyEmail(word, email, comment);
      return true;
   } catch (error) {
    throw error;
   }
};

const getAlToFindVocabulary = async (word: string , language: string) => {
  try {
    const response = await fetch('http://itkotoba-al-server.azurewebsites.net/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                word: word,
                language: language
            })
        });
        const data = await response.json();
      if(language == "Japanese") {
        const findTopic = await db.vocabularyTopic.findOne({where: {name: data.data.topic.trim()}});
        if(!findTopic) {
          await db.vocabularyTopic.create({
            name: data.data.topic.trim()
          });
        }
        await db.vocabulary.create({
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
          language: "Japanese"
        });
      }
      if(language == "Vietnamese") {
          const findTopic = await db.vocabularyTopic.findOne({where: {name: data.data.topic.trim()}});
        if(!findTopic) {
          await db.vocabularyTopic.create({
            name: data.data.topic.trim()
          });
        }
        await db.vocabulary.create({
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
          language: "Vietnamese"
        });
      }
        return data.data;
    
  } catch (error) {
    throw error;
  }
}

const getHistorySearch = async (user_id: string) => {
  try {
    const history = await db.searchHistory.findAll({
      where: { user_id },
      attributes: ['searched_at' , 'vocab_id'],
      include: [{
        model: db.vocabulary,
        attributes: ['word', 'pronunciation', 'meaning', 'example', 'usage' , 'example_meaning']
      }],
      order: [['searched_at', 'DESC']]
    });
    return history;
  } catch (error) {
    throw error;
  }
}
 const checkLevelUser = async (user_id: string , new_points: number) => {
    try {
      const user = await db.user.findByPk(user_id);
      if(!user) {
        throw new Error("User not found");
      }
      if(user.total_points + new_points >= user.levelThreshold) {
        await db.user.update({
          current_level: Number(user.current_level) + 1,
          levelThreshold: Number(user.levelThreshold) + (Number(user.current_level) * 100 + 500),
          total_points: Number(user.total_points) + Number(new_points) - Number(user.levelThreshold)
        }, {
          where: { user_id }
        });
      }
      else {
        await db.user.update({
          total_points: Number(user.total_points) + Number(new_points)
        }, {
          where: { user_id }
        });
      }
      const userData = filterUserData(user);
      return userData;
    } catch (error) {
      throw error;
    }
  }

const addHistorySearch = async (user_id: string, vocabulary_id: string) => {
  try {
    const vocabulary = await db.vocabulary.findByPk(vocabulary_id);
    if (!vocabulary) {
      throw new Error("Vocabulary not found");
    }
    const existingHistory = await db.searchHistory.findOne({
      where: { user_id, vocab_id: vocabulary_id }
    });
    if (existingHistory) {
      await db.searchHistory.update({
        searched_at: new Date()
      }, {
        where: { user_id, vocab_id: vocabulary_id }
      });
    } else {
      await db.searchHistory.create({
        user_id,
        vocab_id : vocabulary_id,
        searched_at: new Date()
      });
    }
    return true;
  } catch (error) {
    throw error;
  }
 
}

  export default { getSimilarVocabulary, getVocabularyByTopic, getAlToFindVocabulary , requestNewVocabulary , getAllTopic , getHistorySearch , addHistorySearch , checkLevelUser , updateVocabularyUser   };

