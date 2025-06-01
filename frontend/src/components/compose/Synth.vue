<!-- 合成器界面 -->
<template>
  <my-text v-bind:content="'波形预设:' + preset" size="large" /><br />

  <my-text v-bind:content="'音量包络'" size="large" />
  <my-text v-bind:content="'起音：'" /><my-knob class="label" />
  <my-text v-bind:content="'/ms  衰减：'" /><my-knob class="label" />
  <my-text v-bind:content="'/ms  保持：'" /><my-knob class="label" />
  <my-text v-bind:content="'/ms  释放：'" /><my-knob class="label" />
  <my-text v-bind:content="'/ms'" /><br />

  <my-text v-bind:content="'FM调制:'" size="large" />
  <my-text v-bind:content="'幅度：'" /><my-knob class="label" />
  <my-text v-bind:content="'/semitone  速率：'" /><my-knob class="label" />
  <my-text v-bind:content="'/Hz'" />
</template>

<script setup>
import { ref } from "vue";

const preset = ref("default");
const attack = ref(0);
const decay = ref(0);
const sustain = ref(0);
const release = ref(0);

defineExpose({
  preset,
  attack,
  decay,
  sustain,
  release,
});
</script>

<style>
.label {
  display: inline-block;
}
</style>
