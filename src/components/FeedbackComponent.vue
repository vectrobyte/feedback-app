<template>
  <div class="container">
    <div class="loading" v-if="loading">
      <h2>Loading...</h2>
    </div>
    <div v-else class="question-wrapper">
      <template v-for="(question, key) of questions" :key="question.id">
        <Question
          v-if="key === index"
          :question="question"
          :isFirst="!index"
          :isLast="index === questions.length - 1"
          :answer="answer"
          :saving="saving"
          @back="handleBack"
          @next="handleNext"
          @skip="handleSkip"
          @finish="handleFinish"
        />
      </template>

      <template v-if="completed">
        <br />
        <p>Submitted Answers:</p>
        <pre>{{ JSON.stringify(responses, null, 2) }}</pre>
      </template>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import { storeToRefs } from 'pinia';
import { useFeedbackStore } from '../stores/feedbackStore.js';
import Question from './Question.vue';

const store = useFeedbackStore();

let index = ref(0);
let saving = ref(false);
let completed = ref(false);

const { questions, loading, responses } = storeToRefs(store);

onMounted(async () => {
  await store.fetchQuestions();
  index.value = 0;
});

const answer = computed(() => responses.value[index.value] || {});

const handleBack = () => {
  index.value--;
}
const handleSkip = () => {
  index.value++;
}

const handleNext = ({ values, optionalText }) => {
  store.saveAnswer(index.value, values, optionalText);
  index.value++;
}

const handleFinish = async ({ values, optionalText }) => {
  store.saveAnswer(index.value, values, optionalText);

  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    completed.value = true;
  }, 1000)
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: gray;
}

.container .loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container .question-wrapper {
  width: 50%;
  height: 60vh;
  background: #ffffff;
  color: black;
  padding: 4rem;
}
</style>
