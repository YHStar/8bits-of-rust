<template>
  <button
    class="my-button"
    :class="[sizeClass, { disabled: disabled, active: active }]"
    :disabled="disabled"
    :style="{ '--dynamic-bg': color }"
    :aria-label="ariaLabel || text"
    @click="$emit('click', $event)"
    @keydown.enter="$emit('click', $event)"
  >
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
  name: 'MyButton',
  components: {},
  props: {
    color: {
      type: String,
      default: '' // 空值表示使用默认配色
    },
    active: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (v) => ['primary', 'secondary', 'ghost'].includes(v),
    },
    size: {
      type: String,
      default: 'medium',
      validator: (v) => ['small', 'medium', 'large'].includes(v),
    },
    disabled: Boolean,
    ariaLabel: String,
  },
  emits: ['click'],
  computed: {
    sizeClass() {
      return `size-${this.size}`
    },
    dynamicStyle() {
      return this.color ? this.color: ''
    },
  },
}
</script>

<style scoped>
.my-button {
  --primary-color: rgb(255, 255, 255);
  --secondary-color: rgb(240, 240, 240);
  --ghost-color: var(--pixel-ghost);

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
  background-color: var(--dynamic-bg, var(--pixel-highlight)) !important;
  /* background-color: var(--dynamic-bg, var(--pixel-primary)) !important; */
  border: 5px solid white;
}

.my-button:not(.disabled) {
  background-color: var(--dynamic-bg, var(--pixel-primary)) !important;
}
/* 
.my-button:not(.disabled) {
  background-color: var(--pixel-primary) !important;
  color: var(--pixel-highlight);
} */
.my-button.secondary:not(.disabled) {
  background-color: var(--pixel-secondary) !important;
}
.my-button.ghost:not(.disabled) {
  background-color: var(--pixel-background) !important;
  color: var(--pixel-ghost);
  border: 1px solid var(--pixel-ghost);
}
.my-button:not(.disabled):hover {
  transform: scale(1.08); /* 放大 8% */
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 平滑动画 */
  z-index: 1; /* 防止被相邻元素遮挡 */
}
.my-button:not(.disabled):hover {
  background-color: var(--pixel-secondary);
}
.my-button:not(.disabled):active {
  transform: scale(1.05);
}

.my-button.disabled {
  background-color: var(--pixel-background);
  color: var(--pixel-disabled);
  cursor: not-allowed;
  opacity: 0.7;
}
.content-wrapper {
  display: inherit;
  align-items: inherit;
  gap: inherit;
}
</style>
