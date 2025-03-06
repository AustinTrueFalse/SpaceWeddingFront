<template>
  <div class="custom-text-field">
    <label :class="{ shrink: localValue || isFocused }">{{ label }}</label>
    <input
      type="text"
      v-model="localValue"
      @input="onInputChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :readonly="readonly"
      placeholder=" "
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const localValue = ref(props.modelValue);
const isFocused = ref(false); // Флаг для отслеживания фокуса
const emit = defineEmits();

watch(localValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const onInputChange = () => {
  emit("input-change", localValue.value);
};
</script>

<style scoped>
.custom-text-field {
  position: relative;
  margin: 20px 0;
}

label {
  position: absolute;
  left: 50%; /* Центрируем лейбл по горизонтали */
  transform: translateX(-50%); /* Центрируем лейбл */
  font-size: 36px; /* Начальный размер шрифта лейбла */
  color: #999; /* Цвет лейбла */
  transition: 0.2s ease;
  pointer-events: none; /* Лейбл не мешает вводить текст */
  opacity: 1; /* Полная видимость */
}

label.shrink {
  transform: translate(-50%, -20px); /* Поднимаем лейбл вверх */
  font-size: 14px; /* Уменьшаем размер шрифта при поднятии */
  opacity: 1; /* Полная видимость */
}

input {
  width: 100%;
  padding: 10px 0; /* Отступы для инпута */
  border: none; /* Убираем рамки */
  outline: none; /* Убираем контур при фокусе */
  font-size: 36px; /* Размер шрифта текста */
  text-align: center; /* Выравнивание текста по центру */
  background: transparent; /* Убираем фон */
}

input:focus + label,
input:not(:placeholder-shown) + label {
  transform: translate(-50%, -20px); /* Поднимаем лейбл при фокусе */
  font-size: 14px; /* Уменьшаем размер шрифта при фокусе */
  opacity: 1; /* Полная видимость */
}
</style>
