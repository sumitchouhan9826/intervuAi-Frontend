import { create } from 'zustand';

const useInterviewStore = create((set, get) => ({
  currentInterview: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  isLoading: false,
  timer: 0,

  setInterview: (interview) =>
    set({
      currentInterview: interview,
      questions: interview?.questions || [],
      currentQuestionIndex: 0,
      answers: [],
    }),

  addAnswer: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
    })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setTimer: (timer) => set({ timer }),

  incrementTimer: () => set((state) => ({ timer: state.timer + 1 })),

  resetInterview: () =>
    set({
      currentInterview: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      isLoading: false,
      timer: 0,
    }),

  getCurrentQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    return questions[currentQuestionIndex] || null;
  },

  isLastQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    return currentQuestionIndex >= questions.length - 1;
  },
}));

export default useInterviewStore;
