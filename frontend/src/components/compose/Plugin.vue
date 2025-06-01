<!-- 插件界面 -->
<template>
  <div>
    <div class="selector">
      <my-text v-bind:content="'轨道编号: '" size="large" />
      <my-select
        v-model="synths_active_id"
        :options="[
          { label: '1', value: 0 },
          { label: '2', value: 1 },
          { label: '3', value: 2 },
          { label: '4', value: 3 },
          { label: '5', value: 4 },
        ]"
      />
    </div>
    <div class="selector">
      <my-text v-bind:content="'波形预设: '" size="large" />
      <my-select
        v-model="synths_params[synths_active_id].preset"
        :options="[
          { label: 'square', value: 'square' },
          { label: 'saw', value: 'saw' },
          { label: 'spike', value: 'spike' },
          { label: 'triangle', value: 'triangle' },
          { label: 'noise', value: 'noise' },
        ]"
        @update:modelValue="(val) => handlePresetChange(val)"
      />
    </div>
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
      <my-text v-bind:content="'%  释放：'" />
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
import { ref, computed } from "vue";
import { useStore } from "vuex";
const id = 0; // 假设这是插件的ID，因为还没有做效果器，所以先用synth_active_id代替
const store = useStore();

//合成器预设
const synths_params = computed({
  get: () => store.state.synthesiser.params,
  set: (value) => store.dispatch("synthesiser/setSynthParams", value),
});

//正在编辑的合成器ID
const synths_active_id = computed({
  get: () => store.state.synthesiser.active_id,
  set: (value) => {
    console.log("SET synths_active_id to:", value);
    return store.dispatch("synthesiser/setActiveId", value);
  },
});

//合成器波形预设
const handlePresetChange = (value) => {
  store.dispatch("synthesiser/setPreset", value);
};
//合成器ADSR参数
const handleAttackChange = (value) => {
  store.dispatch("synthesiser/setAttack", value);
};
const handleDecayChange = (value) => {
  store.dispatch("synthesiser/setDecay", value);
};
const handleSustainChange = (value) => {
  store.dispatch("synthesiser/setSustain", value);
};
const handleReleaseChange = (value) => {
  store.dispatch("synthesiser/setRelease", value);
};
// const preset = ref("default");
// const attack = ref(0);
// const decay = ref(0);
// const sustain = ref(0);
// const release = ref(0);
const fm_range = ref(0);
const fm_frequency = ref(0);
</script>

<style scoped>
.label {
  display: inline-block;
}
.selector {
  display: flex;
  gap: 40px;
}
</style>
