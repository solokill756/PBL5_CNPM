import { quizData } from "../helpers/fillData";
import db from "../models";
import shuffleArray from "../utils/shuffleArray";


const GenerateQuiz = async (list_id: string, type_quiz: number, number_of_questions: number , topic_id: string) => {
    try {
        if(topic_id) {
            const data = await db.vocabulary.findAll({
                where: {
                    topic_id: topic_id
                }
            });
            const shuffledData = shuffleArray([...data]);
            const flashcards = shuffledData.map((item: any) => {
                return {
                   front_text: item.word,
                   back_text: item.meaning
                }
            });
            number_of_questions = shuffledData.length / 2;
            const numberBackTextQuestion = Math.floor(Math.random() * number_of_questions);
            const numberFrontTextQuestion = number_of_questions;
            const quizs = [];
            let options = flashcards.map((flashcard: any) => {
                    return flashcard.back_text;
                });

            for (let i = 0; i < numberBackTextQuestion; i++) {
                // Get 3 random wrong answers
                const wrongAnswers = options.filter(option => option !== flashcards[i].back_text);
                const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);
                // Combine correct answer with wrong answers and shuffle
                const allOptions = shuffleArray([...shuffledWrongAnswers, flashcards[i].back_text]);
                const quiz = quizData(
                    flashcards[i].front_text,
                    allOptions[0],
                    allOptions[1],
                    allOptions[2],
                    allOptions[3],
                    flashcards[i].back_text
                );
                quizs.push(quiz);
            }
            options = flashcards.map((flashcard: any) => {
                return flashcard.front_text;
            });

            for (let i = numberBackTextQuestion; i < numberFrontTextQuestion; i++) {
                // Get 3 random wrong answers
                const wrongAnswers = options.filter(option => option !== flashcards[i].front_text);
                const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);

                // Combine correct answer with wrong answers and shuffle
                const allOptions = shuffleArray([...shuffledWrongAnswers, flashcards[i].front_text]);

                const quiz = quizData(
                    flashcards[i].back_text,
                    allOptions[0],
                    allOptions[1],
                    allOptions[2],
                    allOptions[3],
                    flashcards[i].front_text
                );
                quizs.push(quiz);
            }
            const shuffledQuizs = shuffleArray([...quizs]);
            return shuffledQuizs;
        }
        else {
        const quizs = [];
        const flashcards = await db.flashcard.findAll({
                where: {
                    list_id: list_id
                }
            });
        const shuffled_flashcards = shuffleArray([...flashcards]);
        if (type_quiz === 1) {
            const options = shuffled_flashcards.map((flashcard: any) => {
                return flashcard.back_text;
            });

            for (let i = 0; i < number_of_questions; i++) {
                // Get 3 random wrong answers
                const wrongAnswers = options.filter(option => option !== flashcards[i].back_text);
                const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);

                // Combine correct answer with wrong answers and shuffle
                const allOptions = shuffleArray([...shuffledWrongAnswers, flashcards[i].back_text]);

                const quiz = quizData(
                    flashcards[i].front_text,
                    allOptions[0],
                    allOptions[1],
                    allOptions[2],
                    allOptions[3],
                    flashcards[i].back_text
                );
                quizs.push(quiz);
            }
        }
        else if (type_quiz === 2) {
            const options = shuffled_flashcards.map((flashcard: any) => {
                return flashcard.front_text;
            });

            for (let i = 0; i < number_of_questions; i++) {
                // Get 3 random wrong answers
                const wrongAnswers = options.filter(option => option !== flashcards[i].front_text);
                const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);

                // Combine correct answer with wrong answers and shuffle
                const allOptions = shuffleArray([...shuffledWrongAnswers, flashcards[i].front_text]);

                const quiz = quizData(
                    flashcards[i].back_text,
                    allOptions[0],
                    allOptions[1],
                    allOptions[2],
                    allOptions[3],
                    flashcards[i].front_text
                );
                quizs.push(quiz);
            }
        }
        return quizs;
    } 
    } catch (error) {
        throw new Error("Error generating quiz");
    }
}

const saveResultQuiz = async (score: number, user_id: string , number_of_questions: number) => {
    try {
        const result = number_of_questions - score <= 2 ? "pass" : "fail";
        const kq =  await db.quizResult.create({
            score: score,
            user_id: user_id,
            result: result,
            completed_at: new Date()
        });
        return kq;
    } catch (error) {
        throw new Error("Error saving quiz result");
    }
}

export { GenerateQuiz, saveResultQuiz }

