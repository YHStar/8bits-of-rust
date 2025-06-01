<!-- 混音器界面 -->
<template>
  <div>
    <table>
      <tbody>
        <tr v-for="n in n_channels">
          <td class="channel">
            <my-text v-bind:content="'音轨' + n.toString()" size="large" />
            <my-button text="合成器" />
            <my-button text="效果器1" />
            <my-button text="效果器2" />
            <my-button text="效果器3" />
            <div class="row">
              <my-text v-bind:content="'音量：'" />
            </div>
            <div class="vertical-slider">
              <my-slider
                orientation="vertical"
                :min="0"
                :max="1"
                v-model="channels_params[n - 1].volume"
                @update:modelValue="(val) => handleVolumeChange(n - 1, val)"
              />
              <my-text
                :content="parseInt(100 * channels_params[n - 1].volume) + '%'"
                class="volume-value"
              />
            </div>
            <div class="row">
              <my-text v-bind:content="'声相：'" />
              <my-knob
                class="label"
                v-model="channels_params[n - 1].pan"
                :minVal="-1"
                :maxVal="1"
                :val="0"
                @update:modelValue="(val) => handlePanChange(n - 1, val)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// import { ref } from "vue"
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

// 状态映射
const n_channels = computed(() => store.state.channels_params.length);
const channels_params = computed({
  get: () => store.state.channel.params,
  set: (value) => store.dispatch("channel/setChannelParams", value),
});

const handleVolumeChange = (index, value) => {
  store.dispatch("channel/setVolume", { index, value });
};

const handlePanChange = (index, value) => {
  store.dispatch("channel/setPan", { index, value });
};
// const n_channels = ref(5)
// const volumes = ref([80, 80, 80, 80, 80])
// const panValues = ref([0, 0, 0, 0, 0])

// defineExpose({
//   n_channels,
//   volumes,
//   panValues,
// })
</script>

<style scoped>
.channel {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.volume {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.vertical-slider {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
</style>
