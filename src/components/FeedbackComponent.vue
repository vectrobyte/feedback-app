<template>
  <div id="wrapper">
    <div class="loading" v-if="loading"><h2>Loading...</h2></div>
    <div id="form" v-if="!loading && activeQuestion">
      <h3>{{ activeQuestion?.questionText }}</h3>
      <div id="answers">
        <div
          v-if="activeQuestion.multiAnswer"
          v-for="answer in activeQuestion?.answers"
          class="form-groups"
        >
          <div>
            <input
              type="checkbox"
              v-model="checkedAnswers"
              :value="answer.answerText"
            />
            {{ answer.answerText }}
          </div>
          <input
            v-if="
              answer.acceptFreeFormText &&
              checkedAnswers.includes(answer.answerText)
            "
            type="text"
            v-model="additionalAnswer"
          />
        </div>
        <div
          v-if="!activeQuestion.multiAnswer"
          v-for="answer in activeQuestion?.answers"
          class="form-groups"
        >
          <div>
            <input
              type="radio"
              :name="activeQuestion.id"
              v-model="radioAnswer"
              :value="answer.answerText"
            />
            {{ answer.answerText }}
          </div>
          <input
            v-if="answer.acceptFreeFormText && radioAnswer == answer.answerText"
            type="text"
            v-model="additionalAnswer"
          />
        </div>

        <div>Selected Checkboxes: {{ checkedAnswers }}</div>
        <div>Selected Radio: {{ radioAnswer }}</div>
      </div>
      <div class="button-groups">
        <div>
          <button
            @click="handleButtonAction('PREVIOUS')"
            v-if="activeQuestionIndex !== 0"
          >
            Previous
          </button>
          <button
            v-if="activeQuestionIndex < questionList.length - 1"
            @click="handleButtonAction('NEXT')"
          >
            Next
          </button>
          <button
            v-if="activeQuestionIndex == questionList.length - 1"
            @click="handleButtonAction('FINISH')"
          >
            Finish
          </button>
        </div>
        <button @click="handleButtonAction('SKIP')">Skip</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFeedbackStore } from "../stores/feedbackStore.js";

let additionalAnswer = ref("");
let checkedAnswers = ref([]);
let radioAnswer = ref("");

const store = useFeedbackStore();

onMounted(() => {
  store.fetchQuestions();
});

const { activeQuestionIndex, questionList } = storeToRefs(store);

const { handleNext, handleSkip, handlePrevious, loading, handleFinish } = store;

const activeQuestion = computed(
  () => questionList.value[activeQuestionIndex.value]
);

const handleButtonAction = (action) => {
  switch (action) {
    case "PREVIOUS":
      handlePrevious();
      break;
    case "SKIP":
      handleSkip();
      break;
    case "NEXT":
      if (activeQuestion.multiAnswer) {
        handleNext([radioAnswer], additionalAnswer);
      } else {
        handleNext([checkedAnswers], additionalAnswer);
      }
      break;
    case "FINISH":
      if (activeQuestion.multiAnswer) {
        handleFinish([radioAnswer], additionalAnswer);
      } else {
        handleFinish([checkedAnswers], additionalAnswer);
      }
  }
};
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: gray;
}

#form,
.loading {
  width: 50%;
  height: 60vh;
  background: #ffffff;
  color: black;
  padding: 16px;
}

.button-groups {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
}

.button-groups button {
  margin-right: 16px;
}

.button-groups div {
  display: flex;
  justify-content: space-between;
}
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
