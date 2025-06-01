<!-- 像素风格下拉选择框 -->
<template>
  <div class="pixel-select" @click="toggleDropdown">
    <div class="selected-option">
      <my-text :content="selectedLabel || '请选择...'" size="medium" />
      <div class="dropdown-arrow">▼</div>
    </div>
    <div v-show="isOpen" class="dropdown-options">
      <div
        v-for="option in options"
        class="option"
        @click.stop="selectOption(option)"
      >
        <my-text :content="option.label" size="medium" />
      </div>
    </div>
  </div>
</template>

<script>
export default { name: "MySelect" };
</script>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every((opt) => "value" in opt && "label" in opt),
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selectedLabel = ref("请选择……");

watch(
  () => props.modelValue,
  (newVal) => {
    const selected = props.options.find((opt) => opt.value === newVal);
    selectedLabel.value = selected ? selected.label : "";
  },
  { immediate: true },
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  // 添加防御性检查 - 确保 option 和 option.value 存在
  if (option && option.value !== undefined && option.value !== null) {
    emit("update:modelValue", option.value);
    selectedLabel.value = option.label || props.options[0]?.label || "请选择...";
  } else {
    console.error("Invalid option selected:", option);
  }
  isOpen.value = false;
};
</script>
<!-- <script setup>
import { ref, watch } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every((opt) => "value" in opt && "label" in opt),
  },
  modelValue: { 
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selectedLabel = ref("请选择");

watch(
  () => props.modelValue,
  (newVal) => {
    const selected = props.options.find((opt) => opt.value === newVal);
    selectedLabel.value = selected ? selected.label : "";
  },
  { immediate: true },
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  emit("update:modelValue", option.value);
  selectedLabel.value = option.label;
  isOpen.value = false;
};
</script> -->

<style scoped>
.pixel-select {
  position: relative;
  max-width: 180px;
  cursor: pointer;
  background: var(--global-primary);
  border: 3px solid;
  border-color: var(--global-border);
  padding: 8px;
}

.my-select {
  position: relative;
  cursor: pointer;
}

.selected-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-arrow {
  font-size: 12px;
  margin-left: 8px;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: -3px;
  right: -3px;
  background: var(--global-primary);
  border: 3px solid var(--global-border);
  margin-top: 4px;
  z-index: 1;
}

.option {
  padding: 8px;
}
</style>
