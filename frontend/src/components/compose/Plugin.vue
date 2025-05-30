<!-- 插件界面 -->
<template>
  <div>
    <my-text v-bind:content="'波形预设: ' + preset" size="large" />
    <br />

    <span>
      <my-text v-bind:content="'音量包络: '" size="large" />
      <my-text v-bind:content="'起音：'" />
      <my-knob
        class="label"
        v-model="synths_params[synths_active_id].attack"
        @update:modelValue="(val) => handleAttackChange(val)"
      />
      <my-text v-bind:content="'/ms  衰减：'" />
      <my-knob
        class="label"
        v-model="synths_params[synths_active_id].decay"
        @update:modelValue="(val) => handleDecayChange(val)"
      />
      <my-text v-bind:content="'/ms  保持：'" />
      <my-knob
        class="label"
        v-model="synths_params[synths_active_id].sustain"
        @update:modelValue="(val) => handleSustainChange(val)"
      />
      <my-text v-bind:content="'/ms  释放：'" />
      <my-knob
        class="label"
        v-model="synths_params[synths_active_id].release"
        @update:modelValue="(val) => handleReleaseChange(val)"
      />
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
import { computed } from "vue";
import { useStore } from "vuex";
const id = 0; // 假设这是插件的ID
const store = useStore();
const synths_params = computed({
  get: () => store.state.synthesiser.params,
  set: (value) => store.dispatch("synthesiser/setSynthParams", value),
});
const synths_active_id = computed({
  get: () => store.state.synthesiser.active_id,
  set: (value) => store.dispatch("synthesiser/updateActiveId", value),
});
const handleAttackChange = (value) => {
  store.dispatch("synthesiser/updateAttack", { value });
};
const handleDecayChange = (value) => {
  store.dispatch("synthesiser/updateDecay", { value });
};
const handleSustainChange = (value) => {
  store.dispatch("synthesiser/updateSustain", { value });
};
const handleReleaseChange = (value) => {
  store.dispatch("synthesiser/updateRelease", { value });
};
// import { ref } from "vue";
// const preset = ref("default");
// const attack = ref(0);
// const decay = ref(0);
// const sustain = ref(0);
// const release = ref(0);
// const fm_range = ref(0);
// const fm_frequency = ref(0);
</script>

<style>
.label {
  display: inline-block;
}
</style>
