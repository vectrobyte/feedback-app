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
        ]
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
]

export const useFeedbackStore = defineStore('feedback', () => {
    let loading = ref(false)
    let errorMessage = ref(null)
    let questionList = ref([])

    let activeQuestionIndex = ref(null)

    let responses = ref({})

    const handlePrevious = () => {
        activeQuestionIndex.value--
    }
    const handleSkip = () => {
        activeQuestionIndex.value++
    }
    const saveAnswer = (userResponses, additionalAnswer) => {
        const currentQuestion = questionList.value[activeQuestionIndex.value]
        responses.value[currentQuestion.id] = {
            questionId: currentQuestion.id,
            questionText: currentQuestion.questionText,
            userResponses: userResponses.map(res => res.value),
            additionalAnswer: additionalAnswer.value
        }
    }

    const getAnswer = (questionId) => {
        return responses.value[questionId]
    }

    const handleNext = (userResponses, additionalAnswer) => {
        saveAnswer(userResponses, additionalAnswer)
        activeQuestionIndex.value++
    }

    const handleFinish = (userResponses, additionalAnswer) => {
        saveAnswer(userResponses, additionalAnswer)
        console.log(responses.value)
    }

    const fetchQuestions = async () => {
        loading.value = true;
        try {            
            setTimeout(() => {
                questionList.value = QUESTIONS
                activeQuestionIndex.value = 0
            }, 1000)
        } catch (error) {
            errorMessage = "Something went wrong. Please try again."
        } finally {
            loading.value = false;
        }
    }

    return {
        questionList,
        activeQuestionIndex,
        loading,
        responses,
        getAnswer,

        handlePrevious,
        handleNext,
        handleSkip,

        fetchQuestions,
        handleFinish

    }
})