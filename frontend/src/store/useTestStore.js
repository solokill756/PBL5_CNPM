import { create } from 'zustand';
import { postTest } from '@/api/postTest';

export const useTestStore = create((set) => ({
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

    fetchQuestions: async (topic_id) => {
        try {
            set({ loading: true, error: null });

            const data = await postTest(topic_id);
            
            if (!data) {
                throw new Error('Không thể tải được dữ liệu câu hỏi');
            }
            const formatted = data.map((q, index) => ({
                id: index + 1,
                definition: q.question,
                options: [q.option_a, q.option_b, q.option_c, q.option_d],
                answer: q.correct_answer,
            }));

            set({ questions: formatted, loading: false });
        } catch (error) {
            console.error('Error fetching questions:', error);
            set({ 
                error: error.message || 'Có lỗi xảy ra khi tải câu hỏi',
                loading: false 
            });
        }
    },

}));