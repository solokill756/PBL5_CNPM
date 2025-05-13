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

const getAllTopic = async () => {
  try {
    const topics = await db.vocabularyTopic.findAll();
    return topics;
  } catch (error) {
    throw error;
  }
};
const getVocabularyByTopic = async (topic_id: string) => {
 try {
     const vocabularies = await db.vocabulary.findAll({
       where: { topic_id },
     });
     return vocabularies;
 } catch (error) {
    throw error;
 }
};


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

const addHistorySearch = async (user_id: string, vocabulary_id: string) => {
  try {
    const vocabulary = await db.vocabulary.findByPk(vocabulary_id);
    if (!vocabulary) {
      throw new Error("Vocabulary not found");
    }
    const history = await db.searchHistory.create({
      user_id,
      vocab_id : vocabulary_id,
      searched_at: new Date()
    });
    return history;
  } catch (error) {
    throw error;
  }
}

export default { getSimilarVocabulary, getVocabularyByTopic, getAlToFindVocabulary , requestNewVocabulary , getAllTopic , getHistorySearch , addHistorySearch };

