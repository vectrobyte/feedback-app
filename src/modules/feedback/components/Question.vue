<template>
  <div v-if="question?.id" class="question">
<!--    <pre>{{ JSON.stringify(question, null, 2) }}</pre>-->

    <h3>{{ question.questionText }}</h3>
    <div v-if="question?.multiAnswer" class="form-groups">
      <template v-for="option in question.options">
        <label>
          <input
              type="checkbox"
              v-model="values"
              :value="option.answerText"
          />
          {{ option.answerText }}
        </label>
        <input
            v-if="
              option.acceptFreeFormText &&
              values.includes(option.answerText)
            "
            type="text"
            v-model="optionalText"
        />
      </template>
    </div>
    <div v-else class="form-groups">
      <template v-for="option in question.options">
        <label>
          <input
              type="radio"
              v-model="values"
              :name="question.id"
              :value="option.answerText"
          />
          {{ option.answerText }}
        </label>
        <input
            v-if="option.acceptFreeFormText && values === option.answerText"
            type="text"
            v-model="optionalText"
        />
      </template>
    </div>

    <div class="button-groups">
      <div>
        <button
            @click="onBack"
            v-if="!isFirst"
        >
          Previous
        </button>
        <button
            v-if="!isLast"
            :disabled="saving"
            @click="onNext"
        >
          Next
        </button>
        <button
            v-else
            :disabled="saving"
            @click="onFinish"
        >
          Finish
        </button>
      </div>
      <button @click="onSkip">Skip</button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const { question, isFirst, isLast, answer, saving } = defineProps(['question', 'answer', 'isFirst', 'isLast', 'saving']);
const emit = defineEmits(['back', 'next', 'skip', 'finish']);

const values = ref(answer.userResponses || []);
const optionalText = ref(answer.additionalAnswer || null);

const onBack = () => {
  emit('back');
}

const onSkip = () => {
  emit('skip');
}

const onNext = () => {
  emit('next', {
    values: values.value,
    optionalText: optionalText?.value,
  });
}

const onFinish = () => {
  emit('finish', {
    values: values.value,
    optionalText: optionalText.value,
  });
}
</script>

<style scoped>
.form-groups {
  display: flex;
  flex-direction: column;
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
</style>
