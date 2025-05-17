<!-- 像素风格输入框组件 -->
<template>
  <div class="pixel-input">
    <el-input
      v-model="inputValue"
      :placeholder="placeholder"
      @input="handleInput"
      @change="handleChange"
      class="pixel-style">
    </el-input>
  </div>
</template>

<script>
export default { name: "MyInput" }
</script>
<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: "请输入...",
  },
})

const emit = defineEmits(["update:modelValue", "input", "change"])

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal
  },
)

const handleInput = (val) => {
  emit("update:modelValue", val)
  emit("input", val)
}

const handleChange = (val) => {
  emit("change", val)
}
</script>

<style lang="scss" scoped>
.pixel-input {
  --bg-color: var(--global-primary);

  :deep(.el-input__wrapper) {
    background: var(--bg-color);
    box-sizing: border-box;
    border: 2px solid var(--global-border);
    border-radius: 0;
    max-width: 200px;
    height: 50px;
    padding: 4px 8px;
    font-family: "Zpix", monospace;
    font-size: 14px;
  }
}
</style>
