import { create } from 'zustand';

export const useQuizStore = create((set) => ({
    questions: [],
    loading: false,
    error: null,
    answers: {}, 
    result: null,
    wrongQuestions: [],

  setAnswers: (answers) => set({ answers }),
  setResult: (result) => set({ result }),
  setWrongQuestions: (wrongQuestions) => set({ wrongQuestions }),
   setQuestions: (questions) => set({ questions }),

  fetchQuestions: async (list_id, type_quiz, number_of_questions, axiosPrivate) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosPrivate.post("/api/quiz//generateQuiz", {
        list_id, 
        type_quiz, 
        number_of_questions,
      });

      const data = res.data.data;
      const formatted = data.map((q, index) => ({
        id: index + 1,
        definition: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        answer: q.correct_answer,
      }));

      set({ questions: formatted, loading: false });
    } catch (err) {
      console.error("Error fetching questions:", err);
      set({ 
        error: err.response?.data?.message || "Lỗi tải câu hỏi", 
        loading: false 
      });
    }
  },
}));