<template>
  <div class="code-digit" :class="{ 'is-input': isInput, 'is-readonly': !isInput }">
    <input
      v-if="isInput"
      type="text"
      maxlength="1"
      :value="modelValue"
      @input="handleInput"
      @keydown="handleKeydown"
      ref="inputRef"
    />
    <div v-else class="display-digit">{{ modelValue }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  isInput: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'next'])

const inputRef = ref(null)

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  if (value) {
    emit('next')
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Backspace' && !props.modelValue) {
    emit('prev')
  }
}

defineExpose({
  focus: () => inputRef.value?.focus()
})
</script>

<style scoped>
.code-digit {
  width: clamp(80px, 16vw, 100px);
  height: clamp(80px, 16vw, 100px);
  border-radius: clamp(10px, 2vw, 15px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(48px, 10vw, 64px);
  font-weight: 700;
  color: #1a237e;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.code-digit.is-readonly {
  background: #b0b0b0 !important;
  color: #fff !important;
}

.code-digit.is-input {
  background: #ffffff;
  border-color: #e0e0e0;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.code-digit.is-input:hover {
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

.code-digit.is-input:focus-within {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  transform: translateY(-1px);
}

.code-digit input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: clamp(48px, 10vw, 64px);
  font-weight: 700;
  color: #00a6ff;
  outline: none;
  padding: 0;
}

.display-digit {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a237e;
  background: #ffffff;
  border-radius: clamp(10px, 2vw, 15px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.code-digit.is-readonly .display-digit {
  background: #b0b0b0 !important;
  color: #fff !important;
}

.display-code {
  display: flex;
  gap: 20px;
}
</style> 