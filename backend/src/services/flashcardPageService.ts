import db from "../models";
import { sendLinkListFlashCard } from "../utils/sendLinkListFlashCard";


const rateListFlashcard = async (list_id: string, rate: number, user_id: string , comment: string) => {
    try {
        const currentRate = await db.listFlashcard.findOne({
            where: { list_id },
        });
        await db.flashcardStudy.update({
            rate: Number(rate),
            comment: comment,
        }, {
            where: { list_id, user_id },
        });
        const allRates = await db.flashcardStudy.findAll({
            where: {
                list_id,
                rate: { [db.Sequelize.Op.gt]: 0 },
            },
            attributes: ['rate'],
        });
        const sumOfPeopleRate = allRates.reduce((sum: number, rate: any) => sum + rate.rate, 0);
        const newRate = (currentRate.rate + sumOfPeopleRate) / (allRates.length + 1);
        await db.listFlashcard.update({
            rate: newRate,
        }, {
            where: { list_id },
        });
        return { rate: newRate };
    } catch (error) {
        throw new Error("Error rating list flashcard");
    }
};

const likeFlashcard = async (flashcard_id: string, user_id: string) => {
    try {
        const data = await db.flashcardUser.update({
            like_status: true,
        }, {
            where: { flashcard_id, user_id },
        });
        return data;
    } catch (error) {
        throw new Error("Error liking flashcard");
    }
};

const unlikeFlashcard = async (flashcard_id: string, user_id: string) => {
    try {
        const data = await db.flashcardUser.update({
            like_status: false,
        }, {
            where: { flashcard_id, user_id },
        });
        return data;
    } catch (error) {
        throw new Error("Error unliking flashcard");
    }
};


const updateReviewCount = async (flashcard_id: string, user_id: string) => {
    try {
        const flashcard = await db.flashcardUser.findOne({
            where: { flashcard_id, user_id },
        });
        const newReviewCount = flashcard.review_count + 1;
        const updatedFlashcard = await db.flashcardUser.update({ review_count: newReviewCount }, { where: { flashcard_id, user_id } });
        return updatedFlashcard;
    } catch (error) {
        throw new Error("Error updating review count");
    }
};

const updateLastReview = async (flashcard_id: string, user_id: string) => {
    const updatedFlashcards = await db.flashcardUser.update({ last_review: new Date() }, { where: { flashcard_id, user_id } });
    return updatedFlashcards;
};

const getFlashcardByListId = async (list_id: string, user_id: string) => {
    try {
        const flashcardStudy = await db.flashcardStudy.findOne({where: {list_id, user_id}});
        if(flashcardStudy){
            await db.flashcardStudy.update({
                review_count: flashcardStudy.review_count + 1,
                last_review: new Date(),
            }, {where: {list_id, user_id}});
        }
        else{
            await db.flashcardStudy.create({
                list_id,
                user_id,
                review_count: 1,
                last_review: new Date(),
            });
        }
        const flashcards = await db.flashcard.findAll({
            where: { list_id },
            attributes: ["flashcard_id", "front_text", "back_text", "custom_note", "ai_explanation"],

            include: [
                {
                    model: db.flashcardUser,
                    attributes: ["like_status"],
                    where: { user_id: user_id },
                    required : false,
                },
            ],
            order: [
                [db.flashcardUser, 'last_review', 'DESC'],
            ],
            subQuery: false,
        }

        );
        
        return flashcards;
    } catch (error) {
        throw new Error("Error fetching flashcards");
    }
};

const checkRateFlashcard = async (list_id: string, user_id: string)  => {
    try {
        const flashcard = await db.flashcardStudy.findOne({
            where: { list_id, user_id },
        });
        if (flashcard.rate > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error("Error checking rate flashcard");
    }
};

const addListFlashcardToClass = async (list_id : string , classes : string[]) => {
  try {
      await db.listFlashCardClass.destroy({where: {list_id}});
      for (const class_id of classes) {   
          await db.listFlashCardClass.create({list_id, class_id});
      }
      return true;
  } catch (error) {
      throw new Error("Error adding list flashcard to class");
  }
};

const shareLinkListFlashcardToUser = async (list_id : string , email : string) => {

    try {
        const listFlashcard = await db.listFlashcard.findOne({where: {list_id}});
        const link = `http://3000/flashcard/id`;
        await sendLinkListFlashCard(email, link, listFlashcard.name);
        return true;
    } catch (error) {
        throw new Error("Error sharing link list flashcard to user");
    }
};


const getClassOfUser = async (user_id : string) => {
    try {
        const classes = await db.class.findAll({where: {created_by: user_id}});
        return classes;
    } catch (error) {
        throw new Error("Error getting class of user");
    }
};

export { rateListFlashcard, likeFlashcard, unlikeFlashcard, updateReviewCount, updateLastReview, getFlashcardByListId, checkRateFlashcard, addListFlashcardToClass, shareLinkListFlashcardToUser, getClassOfUser };










