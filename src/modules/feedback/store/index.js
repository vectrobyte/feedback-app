import { defineStore } from 'pinia'
import QUESTIONS from "../data/questions.json";

export const useFeedbackStore = defineStore('feedback', {
    state: () => ({
        loading: false,
        questions: [],
        responses: [],
    }),
    actions: {
        saveAnswer(index, userResponses, additionalAnswer) {
            const currentQuestion = this.questions[index];
            const responseIndex = this.responses.findIndex(response => response.questionId === currentQuestion.id);

            const response = {
                questionId: currentQuestion.id,
                questionText: currentQuestion.questionText,
                userResponses: userResponses,
                additionalAnswer: additionalAnswer,
            };

            if (responseIndex === -1) {
                this.responses.push(response);
            } else {
                this.responses[responseIndex] = response;
            }
        },
        async fetchQuestions() {
            this.loading = true;
            return new Promise(resolve => {
                setTimeout(() => {
                    this.questions = QUESTIONS;
                    this.loading = false;
                    resolve();
                }, 1000);
            });
        },
    }
});
