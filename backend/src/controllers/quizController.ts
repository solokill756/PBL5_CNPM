import { GenerateQuiz, saveResultQuiz } from "../services/quizSevice";
import { Request , Response } from "express";
const generateQuizController = async (req : Request , res : Response) => {
   try {
     const { list_id , type_quiz , number_of_questions } = req.body;
     const quiz = await GenerateQuiz(list_id , Number(type_quiz) , Number(number_of_questions));
     res.status(200).json(quiz);
   } catch (error) {
    res.status(500).json({message : (error as Error).message});
   }
}

const saveResultQuizController = async (req : Request , res : Response) => {
    const { score  } = req.body;
    const user_id =(req as any).user.user_id;
    if(!user_id){
        return res.status(401).json({message : "Unauthorized"});
    }
    try {
        const result = await saveResultQuiz(Number(score) , user_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message : (error as Error).message});
    }
}

export {generateQuizController , saveResultQuizController}
