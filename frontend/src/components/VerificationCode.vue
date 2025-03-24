<template>
  <div class="verification-code">
    <CodeDigit
      v-for="(digit, index) in code"
      :key="index"
      v-model="code[index]"
      :is-input="true"
      @next="focusNext(index)"
      @prev="focusPrev(index)"
      ref="digitRefs"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CodeDigit from './CodeDigit.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const code = ref(['', '', '', '', '', ''])
const digitRefs = ref([])

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.length === 6) {
    code.value = newValue.split('')
  }
}, { immediate: true })

// 监听内部值变化
watch(code, (newValue) => {
  const codeString = newValue.join('')
  emit('update:modelValue', codeString)
}, { deep: true })

const focusNext = (index) => {
  if (index < code.value.length - 1) {
    digitRefs.value[index + 1].focus()
  }
}

const focusPrev = (index) => {
  if (index > 0) {
    digitRefs.value[index - 1].focus()
  }
}

// 处理粘贴事件
const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const numbers = pastedData.replace(/\D/g, '').slice(0, 6)
  if (numbers.length === 6) {
    code.value = numbers.split('')
  }
}

// 处理键盘输入
const handleKeydown = (event, index) => {
  // 只允许数字输入
  if (!/^\d$/.test(event.key) && 
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
    event.preventDefault()
  }
}

// 暴露方法给父组件
defineExpose({
  focus: () => digitRefs.value[0]?.focus(),
  clear: () => {
    code.value = ['', '', '', '', '', '']
    digitRefs.value[0]?.focus()
  }
})
</script>

<style scoped>
.verification-code {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}
</style> 