import { defineStore } from 'pinia'
import { ref } from 'vue'

const QUESTIONS = [
    {
        id: "111",
        questionText: "How did you hear us?",
        answers: [
            {
                position: 1,
                answerText: "Facebook"
            },
            {
                position: 2,
                answerText: "Social Media"
            },
            {
                position: 3,
                answerText: "Tiktok"
            },
            {
                position: 4,
                answerText: "Others",
                acceptFreeFormText: true
            }
        ],
    },
    {
        id: "222",
        multiAnswer: true,
        questionText: "How old are you?",
        answers: [
            {
                position: 1,
                answerText: "0-10"
            },
            {
                position: 2,
                answerText: "10-20"
            },
            {
                position: 3,
                answerText: "20-30"
            },
            {
                position: 4,
                answerText: "Others",
                acceptFreeFormText: true
            }
        ]
    },
    {
        id: "333",
        questionText: "What are you looking for?",
        answers: [
            {
                position: 1,
                answerText: "Service"
            },
            {
                position: 2,
                answerText: "Assistance"
            },
            {
                position: 3,
                answerText: "Issues"
            },
            {
                position: 4,
                answerText: "Others",
                acceptFreeFormText: true
            }
        ]
    }
];

export const useFeedbackStore = defineStore('feedback', () => {
    let loading = ref(false);
    let questions = ref([]);
    let responses = ref([]);

    const saveAnswer = (index, userResponses, additionalAnswer) => {
        const currentQuestion = questions.value[index]
        responses.value[index] = {
            questionId: currentQuestion.id,
            questionText: currentQuestion.questionText,
            userResponses: userResponses,
            additionalAnswer: additionalAnswer,
        }
    };

    const getAnswer = (questionId) => {
        return responses.value[questionId]
    };

    const fetchQuestions = async () => {
        loading.value = true;
        return new Promise(resolve => {
            setTimeout(() => {
                questions.value = QUESTIONS
                loading.value = false;
                resolve();
            }, 1000)
        })
    };

    return {
        loading,
        questions,
        responses,
        getAnswer,
        saveAnswer,
        fetchQuestions,
    };
})
