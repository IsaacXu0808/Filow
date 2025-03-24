<template>
  <div class="display-code">
    <CodeDigit v-for="(digit, index) in code" :key="index" :modelValue="digit" :isInput="false" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import CodeDigit from './CodeDigit.vue';

const props = defineProps({
  code: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.display-code {
  display: flex;
  gap: 20px; /* 增加数字之间的间距 */
}
</style> 