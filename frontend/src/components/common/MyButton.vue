<!-- 像素风格按钮 -->
<template>
  <button
    class="my-button"
    :class="[sizeClass, { disabled: disabled, active: active }]"
    :disabled="disabled"
    :style="{ '--dynamic-bg': color }"
    :aria-label="ariaLabel || text"
    @click="$emit('click', $event)"
    @keydown.enter="$emit('click', $event)">
    <span class="content-wrapper">
      <slot name="icon"></slot>
      <span>
        <my-text v-bind:content="text" />
      </span>
    </span>
  </button>
</template>

<script>
export default {
  name: "MyButton"
}
</script>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary", "ghost"].includes(v),
  },
  size: {
    type: String,
    default: "medium",
    validator: (v) => ["small", "medium", "large"].includes(v),
  },
  disabled: Boolean,
  ariaLabel: String,
})

const emit = defineEmits(['click'])

const sizeClass = computed(() => `size-${props.size}`)
const dynamicStyle = computed(() => props.color ? props.color : "")
</script>

<style scoped>
.my-button {
  position: relative;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  width: 125px;
  height: 50px;
  box-sizing: border-box;
  gap: 8px;
}

.size-small {
  width: 40px;
  font-size: 14px;
}
.size-medium {
  font-size: 16px;
}
.size-large {
  width: 250px;
  height: 100px;
  font-size: 36px;
}

.my-button.active:not(.disabled) {
  background-color: var(--dynamic-bg, var(--global-highlight)) !important;
  /* background-color: var(--dynamic-bg, var(--global-primary)) !important; */
  border: 5px solid var(--global-highlight);
}

.my-button:not(.disabled) {
  background-color: var(--dynamic-bg, var(--global-primary)) !important;
}
/* 
.my-button:not(.disabled) {
  background-color: var(--global-primary) !important;
  color: var(--global-highlight);
} */
.my-button.secondary:not(.disabled) {
  background-color: var(--global-secondary) !important;
}
.my-button.ghost:not(.disabled) {
  background-color: var(--global-background) !important;
  color: var(--global-ghost);
  border: 1px solid var(--global-ghost);
}
.my-button:not(.disabled):hover {
  transform: scale(1.08);
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1;
}
.my-button:not(.disabled):hover {
  background-color: var(--global-secondary);
}
.my-button:not(.disabled):active {
  transform: scale(1.05);
}

.my-button.disabled {
  background-color: var(--global-background);
  color: var(--global-disabled);
  cursor: not-allowed;
  opacity: 0.7;
}
.content-wrapper {
  display: inherit;
  align-items: inherit;
  gap: inherit;
}
</style>
