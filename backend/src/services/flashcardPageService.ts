import { sendLinkListFlashCard } from './../utils/sendLinkListFlashCard';
import db from "../models";
import dotenv from 'dotenv';

dotenv.config();

const rateListFlashcard = async (list_id: string, rate: number, user_id: string , comment: string) => {
    try {
        const currentRate = await db.listFlashcard.findOne({
            where: { list_id },
        });
        await db.flashcardStudy.update({
            rate: rate,
            comment: comment,
        }, {
            where: { list_id, user_id },
        });
        const allRates = Number(currentRate.number_rate);
        const newRate = (currentRate.rate + rate) / (allRates + 1);
        await db.listFlashcard.update({
            rate: newRate,
            number_rate: allRates + 1,
        }, {
            where: { list_id },
        });
        return { rate: newRate, numberRate: allRates + 1 };
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
        else {
            await db.flashcardStudy.create({
                list_id,
                user_id,
                review_count: 1,
                last_review: new Date(),
            });
            
        }
      
        const listFlashcard = await db.flashcard.findAll({
            where: { list_id },
            include: [{
                model: db.flashcardUser,
                attributes: ["like_status"],
                required: false,
            }],
            subQuery: false
        });
        const inforListFlashcard = await db.listFlashcard.findOne({
            where: {list_id},
           
        });
        const userInfor = await db.user.findOne({
            where: {user_id: inforListFlashcard.user_id},
            attributes: ["username", "profile_picture"],
        });
        const data = {
            flashcard: listFlashcard,
            inforListFlashcard: inforListFlashcard,
            userInfor: userInfor,
        }
        return data;
    } catch (error) {
        throw new Error("Error fetching flashcards");
    }
};

const checkRateFlashcard = async (list_id: string, user_id: string) : Promise<{rate: number} | boolean> => {
    try {
        const flashcard = await db.flashcardStudy.findOne({
            where: { list_id, user_id },
        });
        if(flashcard){
            if (flashcard.rate > 0) {
                return {
                    rate: flashcard.rate,
                }
            }
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
        const link = `http://3000/flashcard/${list_id}`;
        await sendLinkListFlashCard(email, link, listFlashcard.name);
        return true;
    } catch (error) {
        throw new Error("Error sharing link list flashcard to user");
    }
};


const getClassOfUser = async (user_id : string) => {
    try {
        
        const classes = await db.class.findAll(
            {
                where: {created_by: user_id},
                include: [
                    {
                        model: db.listFlashCardClass,
                        attributes: ["list_id"],
                        required: false,
                    }
                ],
             
            }
        );
        return classes;
    } catch (error) {
        throw new Error("Error getting class of user");
    }
};

const getAllExplanation = async (flashcard_id: string) => {
    try {
        const flashcard = await db.flashcard.findOne({ where: { flashcard_id } });
        if (!flashcard) {
            throw new Error("Flashcard not found");
        }
        
        // Gọi đến Flask API
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: flashcard.front_text
            })
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Flask API error: ${response.status} - ${errorBody}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to generate explanation');
        }
        
        const explanation = result.response;
        
        // Update the flashcard with the explanation
        await db.flashcard.update(
            { ai_explanation: explanation },
            { where: { flashcard_id } }
        );
        
        return explanation;
    } catch (error) {
        console.error("Error during getAllExplanation:", error);
        throw new Error(`Error getting AI explanation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};



export { rateListFlashcard, likeFlashcard, unlikeFlashcard, updateReviewCount, updateLastReview, getFlashcardByListId, checkRateFlashcard, addListFlashcardToClass, shareLinkListFlashcardToUser, getClassOfUser, getAllExplanation };










