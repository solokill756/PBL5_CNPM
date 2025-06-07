import { quizData } from "../helpers/fillData";
import db from "../models";
import shuffleArray from "../utils/shuffleArray";
import vocabularyService from "./vocabularyService";
const getRandomQuestion = async () => {
  try {
    // Lấy tối đa 20 flashcard ngẫu nhiên từ database
    const questions = await db.vocabulary.findAll({
      order: db.sequelize.random(),
      limit: 20,
    });

    // Kiểm tra số lượng flashcard
    if (questions.length < 4) {
      throw new Error("Không đủ flashcard để tạo câu hỏi (cần tối thiểu 4)");
    }

    // Xáo trộn và chuyển đổi dữ liệu
    const shuffledData = shuffleArray([...questions]);
    const flashcards = shuffledData.map((item) => {
      return {
        front_text: item.word,
        back_text: item.meaning,
      };
    });

    const number_of_questions = flashcards.length;

    // Đảm bảo phân phối câu hỏi cân bằng (khoảng một nửa mỗi loại)
    const numberBackTextQuestion = Math.floor(number_of_questions / 2);
    const numberFrontTextQuestion = number_of_questions;
    const quizs = [];

    // Tạo câu hỏi với đáp án là back_text
    let options = flashcards.map((flashcard) => {
      return flashcard.back_text;
    });

    // Kiểm tra tính duy nhất của các lựa chọn
    const uniqueBackTextOptions = new Set(options);
    if (uniqueBackTextOptions.size < 4) {
      console.warn("Không đủ lựa chọn back_text duy nhất để tạo câu hỏi");
    }

    for (let i = 0; i < numberBackTextQuestion; i++) {
      // Kiểm tra nếu đã vượt quá số lượng flashcard
      if (i >= flashcards.length) {
        break;
      }

      // Lấy 3 đáp án sai ngẫu nhiên
      const wrongAnswers = options.filter(
        (option) => option !== flashcards[i].back_text
      );

      // Kiểm tra nếu không đủ đáp án sai
      if (wrongAnswers.length < 3) {
        console.warn(
          `Không đủ đáp án sai cho câu hỏi ${i}, bỏ qua câu hỏi này`
        );
        continue;
      }

      const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);

      // Kết hợp đáp án đúng với đáp án sai và xáo trộn
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

    // Tạo câu hỏi với đáp án là front_text
    options = flashcards.map((flashcard) => {
      return flashcard.front_text;
    });

    // Kiểm tra tính duy nhất của các lựa chọn
    const uniqueFrontTextOptions = new Set(options);
    if (uniqueFrontTextOptions.size < 4) {
      console.warn("Không đủ lựa chọn front_text duy nhất để tạo câu hỏi");
    }

    for (let i = numberBackTextQuestion; i < numberFrontTextQuestion; i++) {
      // Kiểm tra nếu đã vượt quá số lượng flashcard
      if (i >= flashcards.length) {
        break;
      }

      // Lấy 3 đáp án sai ngẫu nhiên
      const wrongAnswers = options.filter(
        (option) => option !== flashcards[i].front_text
      );

      // Kiểm tra nếu không đủ đáp án sai
      if (wrongAnswers.length < 3) {
        console.warn(
          `Không đủ đáp án sai cho câu hỏi ${i}, bỏ qua câu hỏi này`
        );
        continue;
      }

      const shuffledWrongAnswers = shuffleArray([...wrongAnswers]).slice(0, 3);

      // Kết hợp đáp án đúng với đáp án sai và xáo trộn
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

    // Kiểm tra nếu không có câu hỏi nào được tạo
    if (quizs.length === 0) {
      throw new Error("Không thể tạo câu hỏi với dữ liệu hiện có");
    }

    // Xáo trộn lần cuối tất cả câu hỏi
    const shuffledQuizs = shuffleArray([...quizs]);
    return shuffledQuizs;
  } catch (error) {
    console.error("Lỗi trong getRandomQuestion:", error);
    throw new Error(
      `Lỗi khi lấy câu hỏi ngẫu nhiên: ${
        error instanceof Error ? error.message : "Lỗi không xác định"
      }`
    );
  }
};

const updatePlayScore = async (
  userId: string,
  points: number,
  isWinner: boolean
  // opponentId?: string
) => {
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    vocabularyService.checkLevelUser(userId, points);
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
    // if (opponentId) {
    //   const opponent = await db.user.findByPk(opponentId);
    //   if (!opponent) {
    //     throw new Error("Opponent not found");
    //   }
    //   vocabularyService.checkLevelUser(opponentId, points);
    //   // Cập nhật điểm cho đối thủ
    //   const opponentCheck = db.battleStats.findOne({
    //     where: {
    //       user_id: opponentId,
    //     },
    //   });
    //   if (opponentCheck) {
    //     db.battleStats.update(
    //       {
    //         games_played: opponent.games_played + 1,
    //         games_won: opponent.games_won + winCount,
    //         total_battle_points: opponent.total_battle_points + points,
    //       },
    //       { where: { user_id: opponentId } }
    //     );
    //   } else {
    //     db.battleStats.create({
    //       user_id: opponentId,
    //       games_played: 1,
    //       games_won: winCount,
    //       total_battle_points: points,
    //     });
    //   }
    // }
    // await db.battleHistory.create({
    //   user_id: userId,
    //   opponent_id: opponentId,
    //   points_earned: points,
    //   is_winner: isWinner,
    //   created_at: new Date(),
    // });
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
