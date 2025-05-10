import { quizData } from "../helpers/fillData";
import db from "../models";
import shuffleArray from "../utils/shuffleArray";


const GenerateQuiz = async (list_id : string , type_quiz : number , number_of_questions : number) => {
   try {
     const flashcards = await db.flashcard.findAll({
         where: {
             list_id: list_id
         }
     }); 
    const shuffled_flashcards = shuffleArray([...flashcards]);
     const quizs = [];
     if(type_quiz === 1){
         const options = shuffled_flashcards.map((flashcard : any) => {
             return flashcard.back_text;
         });
         
         for(let i = 0; i < number_of_questions; i++){
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
     else if(type_quiz === 2) {
          const options = shuffled_flashcards.map((flashcard : any) => {
             return flashcard.front_text;
         });
         
         for(let i = 0; i < number_of_questions; i++){
             // Get 3 random wrong answers
             const wrongAnswers = options.filter(option => option !== flashcards[i].front_text);
             const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);
             
             // Combine correct answer with wrong answers and shuffle
             const allOptions = shuffleArray([...shuffledWrongAnswers, flashcards[i].front_text]);
             
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
     return quizs;
   } catch (error) {
    throw new Error("Error generating quiz");
   }
}

const saveResultQuiz = async (score : number , user_id : string) => {
  try {
   await db.quizResult.create({
          score : score,
          user_id : user_id,
          completed_at : new Date()
      });
      return {
        score : score,
      }
  } catch (error) {
    throw new Error("Error saving quiz result");
  }
}

export {GenerateQuiz , saveResultQuiz}

