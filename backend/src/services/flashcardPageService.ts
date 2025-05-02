import db from "../models";


const rateListFlashcard = async (list_id: string, rate: number, user_id: string) => {
    try {
        const currentRate = await db.listFlashcard.findOne({
            where: { list_id },
        });
        await db.flashcardStudy.update({
            rate: Number(rate),
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
        const flashcards = await db.flashcard.findAll({
            where: { list_id },
            attributes: ["flashcard_id", "front_text", "back_text", "custom_note", "ai_explanation"],

            include: [
                {
                    model: db.flashcardUser,
                    attributes: ["like_status"],
                    where: { user_id: user_id },
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

const checkRateFlashcard = async (list_id: string, user_id: string) => {
    const flashcard = await db.flashcardStudy.findOne({
        where: { list_id, user_id },
    });
    if (flashcard.rate > 0) {
        return true;
    }
    return false;
};



export { rateListFlashcard, likeFlashcard, unlikeFlashcard, updateReviewCount, updateLastReview, getFlashcardByListId, checkRateFlashcard };










