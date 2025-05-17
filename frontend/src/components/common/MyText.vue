<!-- 像素风格文本 -->
<template>
  <span class="my-text" :class="[sizeClass]">{{ content }}</span>
</template>

<script>
export default {
  name: "MyText",
}
</script>
<script setup>
import { computed } from "vue"

const props = defineProps({
  content: String,
  size: {
    type: String,
    default: "medium",
    validator: (v) => ["small", "medium", "large"].includes(v),
  },
})

const sizeClass = computed(() => `text-${props.size}`)
</script>

<style>
@font-face {
  font-family: "Zpix";
  src: url("@/assets/zpix.ttf") format("truetype");
}
.my-text {
  font-family: "Zpix", sans-serif;
  /* color: black; */
  color: var(--global-text);
  text-shadow: 0 0 2px var(--global-text-shadow);
}

.text-small {
  font-size: 12px;
  line-height: 1.4; /* Adjust this value as needed */
}

.text-medium {
  font-size: 20px;
  line-height: 1.5; /* Adjust this value as needed */
}

.text-large {
  font-size: 30px;
  line-height: 1.6; /* Adjust this value as needed */
}
</style>
