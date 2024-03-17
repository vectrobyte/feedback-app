<template>
  <div class="container">
    <div class="loading" v-if="store.loading">
      <h2>Loading...</h2>
    </div>
    <div v-else class="question-wrapper">
      <template v-for="(question, key) of store.questions" :key="question.id">
        <Question
          v-if="key === index"
          :question="question"
          :isFirst="!index"
          :isLast="index === store.questions.length - 1"
          :answer="answer"
          :saving="saving"
          @back="handleBack"
          @next="handleNext"
          @skip="handleSkip"
          @finish="handleFinish"
        />
      </template>

      <br />
      <div>{{ saving ? 'Saving...' : '&nbsp;' }}</div>

      <template v-if="index === store.questions.length">
        <br />
        <p>Submitted Answers:</p>
        <pre v-if="!saving">{{ JSON.stringify(store.responses, null, 2) }}</pre>
      </template>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import { useFeedbackStore } from './store';
import Question from './components/Question.vue';

const store = useFeedbackStore();

let index = ref(0);
let saving = ref(false);

onMounted(async () => {
  await store.fetchQuestions();
  index.value = 0;
});

const answer = computed(() => store.responses[index.value] || {});

const handleBack = () => {
  index.value--;
}
const handleSkip = () => {
  index.value++;
}

const handleNext = async ({ values, optionalText }) => {
  store.saveAnswer(index.value, values, optionalText);
  index.value++;
}

const handleFinish = async ({ values, optionalText }) => {
  await handleNext({ values, optionalText });

  saving.value = true;
  setTimeout(() => {
    saving.value = false;
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
  overflow-y: auto;
  background: #ffffff;
  color: black;
  padding: 4rem;
}
</style>
