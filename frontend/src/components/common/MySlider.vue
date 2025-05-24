<!-- 像素风格推子 -->
<template>
  <div :class="['slider-container', { vertical: orientation === 'vertical' }]">
    <input
      type="range"
      :min="min"
      :max="max"
      :step="0.01 * (max - min)"
      :value="modelValue"
      @input="emitValue($event)"
      @wheel="handleWheel"
      @dblclick="handleDoubleClick"
      class="pixel-slider"
      :style="sliderStyle"
    />
  </div>
</template>

<script>
export default { name: "my-slider" };
</script>

<script setup>
import { computed } from "vue";

// 1. Props 声明
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  orientation: {
    type: String,
    default: "horizontal",
    validator: (value) => ["horizontal", "vertical"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue"]);

const sliderStyle = computed(() => ({
  width: props.orientation === "horizontal" ? "200px" : "30px",
}));

const emitValue = (event) => {
  emit("update:modelValue", Number(event.target.value));
};

const handleWheel = (event) => {
  event.preventDefault();
  const delta = Math.sign(event.deltaY) * 0.02;
  const newValue = props.modelValue - delta;
  const clampedValue = Math.max(props.min, Math.min(props.max, newValue));
  emit("update:modelValue", clampedValue);
};

const handleDoubleClick = () => {
  const defaultValue = 80;
  emit("update:modelValue", defaultValue);
};
</script>

<style scoped>
.slider-container {
  margin: 10px;
  /* display: inline-block; */
  .pixel-slider {
    -webkit-appearance: none;
    height: 0;
    min-width: 50px;
    background: var(--global-primary);
    border: 2px solid var(--global-border);
    padding: 2px;
  }

  .pixel-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 20px;
    background: var(--global-disabled);
    cursor: pointer;
    border: 2px solid var(--global-primary);
  }
}

.slider-container.vertical {
  transform: rotate(270deg);
  transform-origin: center;
}
</style>
