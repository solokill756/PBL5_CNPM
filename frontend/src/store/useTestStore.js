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

    fetchQuestions: async (axiosPrivate, topic_id) => {
        console.log("Store fetchQuestions called with topic_id:", topic_id);
        
        try {
            set({ loading: true, error: null });

            const data = await postTest(axiosPrivate, topic_id);
            
            console.log("Data received from API:", data);
            
            if (!data || !Array.isArray(data)) {
                throw new Error('Không thể tải được dữ liệu câu hỏi hoặc dữ liệu không đúng định dạng');
            }

            if (data.length === 0) {
                throw new Error('Không có câu hỏi nào cho chủ đề này');
            }
            
            const formatted = data.map((q, index) => ({
                id: index + 1,
                definition: q.question,
                options: [q.option_a, q.option_b, q.option_c, q.option_d],
                answer: q.correct_answer,
            }));

            console.log("Formatted questions:", formatted);
            set({ questions: formatted, loading: false });
            
        } catch (error) {
            console.error('Error in fetchQuestions:', error);
            set({ 
                error: error.message || 'Có lỗi xảy ra khi tải câu hỏi',
                loading: false,
                questions: [] 
            });
        }
    },
}));