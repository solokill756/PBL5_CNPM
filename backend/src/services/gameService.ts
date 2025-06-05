import { create } from "domain";
import { quizData } from "../helpers/fillData";
import db from "../models";
import shuffleArray from "../utils/shuffleArray";

const getRandomQuestion = async () => {
  try {
    const questions = await db.flashcard.findAll({
      order: db.sequelize.random(),
      limit: 20,
    });
    const shuffledData = shuffleArray([...questions]);
    const flashcards = shuffledData.map((item: any) => {
      return {
        front_text: item.front_text,
        back_text: item.back_text,
      };
    });
    const number_of_questions = flashcards.length;
    const numberBackTextQuestion = Math.floor(
      Math.random() * number_of_questions
    );
    const numberFrontTextQuestion = number_of_questions;
    const quizs = [];
    let options = flashcards.map((flashcard: any) => {
      return flashcard.back_text;
    });
    for (let i = 0; i < numberBackTextQuestion; i++) {
      // Get 3 random wrong answers
      const wrongAnswers = options.filter(
        (option) => option !== flashcards[i].back_text
      );
      const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);
      // Combine correct answer with wrong answers and shuffle
      const allOptions = shuffleArray([
        ...shuffledWrongAnswers,
        flashcards[i].back_text,
      ]);
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
      const wrongAnswers = options.filter(
        (option) => option !== flashcards[i].front_text
      );
      const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);

      // Combine correct answer with wrong answers and shuffle
      const allOptions = shuffleArray([
        ...shuffledWrongAnswers,
        flashcards[i].front_text,
      ]);

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
  } catch (error) {
    throw new Error("Error getting random question");
  }
};

const updatePlayScore = async (
  userId: string,
  points: number,
  isWinner: boolean,
  opponentId?: string
) => {
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    db.user.update(
      { total_points: user.total_points + points, is_active: true },
      { where: { user_id: userId } }
    );
    const winCount = isWinner ? 1 : 0;
    const check = db.battleStats.findOne({
      where: {
        user_id: userId,
      },
    });
    if (check) {
      db.battleStats.update(
        {
          games_played: user.games_played + 1,
          games_won: user.games_won + winCount,
          total_battle_points: user.total_battle_points + points,
        },
        { where: { user_id: userId } }
      );
    } else {
      db.battleStats.create({
        user_id: userId,
        games_played: 1,
        games_won: winCount,
        total_battle_points: points,
      });
    }
    if (opponentId) {
      const opponent = await db.user.findByPk(opponentId);
      if (!opponent) {
        throw new Error("Opponent not found");
      }
      db.user.update(
        { total_points: opponent.total_points + points, is_active: true },
        { where: { user_id: opponentId } }
      );
      const opponentCheck = db.battleStats.findOne({
        where: {
          user_id: opponentId,
        },
      });
      if (opponentCheck) {
        db.battleStats.update(
          {
            games_played: opponent.games_played + 1,
            games_won: opponent.games_won + winCount,
            total_battle_points: opponent.total_battle_points + points,
          },
          { where: { user_id: opponentId } }
        );
      } else {
        db.battleStats.create({
          user_id: opponentId,
          games_played: 1,
          games_won: winCount,
          total_battle_points: points,
        });
      }
    }
    await db.battleHistory.create({
      user_id: userId,
      opponent_id: opponentId,
      points_earned: points,
      is_winner: isWinner,
      created_at: new Date(),
    });
  } catch (error) {
    throw new Error("Error updating play score");
  }
};

const getBattleLeaderboard = async () => {
  try {
    const topPlayers = await db.battleStats.findAll({
      order: [["total_battle_points", "DESC"]],
      limit: 10,
      include: [
        {
          model: db.user,
          attributes: ["username", "profile_picture"],
        },
      ],
    });
    return topPlayers;
  } catch (error) {
    throw new Error("Error getting battle leaderboard");
  }
};

const getBattleHistory = async (userId: string) => {
  try {
    const history = await db.battleHistory.findAll({
      where: {
        user_id: userId,
      },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: db.user,
          attributes: ["username", "profile_picture"],
        },
      ],
    });
    return history;
  } catch (error) {
    throw new Error("Error getting battle history");
  }
};

export default {
  getRandomQuestion,
  updatePlayScore,
  getBattleLeaderboard,
  getBattleHistory,
};
