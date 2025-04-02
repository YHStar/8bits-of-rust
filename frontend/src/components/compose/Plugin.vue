<!-- 插件界面 -->
<template>
  <div>
    <my-text v-bind:content="'波形预设: ' + preset" size="large" />
    <br />

    <span>
      <my-text v-bind:content="'音量包络: '" size="large" />
      <my-text v-bind:content="'起音：'" />
      <my-knob class="label" v-model="attack" />
      <my-text v-bind:content="'/ms  衰减：'" />
      <my-knob class="label" v-model="decay" />
      <my-text v-bind:content="'/ms  保持：'" />
      <my-knob class="label" v-model="sustain" />
      <my-text v-bind:content="'/ms  释放：'" />
      <my-knob class="label" v-model="release" />
      <my-text v-bind:content="'/ms'" />
      <br />
    </span>

    <span>
      <my-text v-bind:content="'FM调制: '" size="large" />
      <my-text v-bind:content="'幅度：'" />
      <my-knob class="label" v-model="fm_range" />
      <my-text v-bind:content="'/semitone  速率：'" />
      <my-knob class="label" :maxVal="100" v-model="fm_frequency" />
      <my-text v-bind:content="'/Hz'" />
    </span>
  </div>
</template>

<script setup>
import { ref } from "vue"

const preset = ref("default")
const attack = ref(0)
const decay = ref(0)
const sustain = ref(0)
const release = ref(0)
const fm_range = ref(0)
const fm_frequency = ref(0)
</script>

<style>
.label {
  display: inline-block;
}
</style>
