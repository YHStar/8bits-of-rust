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
                :max="100"
                v-model="volumes[n - 1]"
                @update:modelValue="val => handleVolumeChange(n-1, val)" />
              <my-text :content="volumes[n - 1] + '%'" class="volume-value" />
            </div>
            <div class="row">
              <my-text v-bind:content="'声相：'" />
              <my-knob
                class="label"
                v-model="panValues[n - 1]"
                :minVal="-100"
                :maxVal="100"
                :val="0" 
                @update:modelValue="val => handlePanChange(n-1, val)"
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
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 状态映射
const n_channels = computed(() => store.state.n_channels)
const volumes = computed({
  get: () => store.state.volumes,
  set: (value) => store.commit('setVolumes', value)
})
const panValues = computed({
  get: () => store.state.panValues,
  set: (value) => store.commit('setPanValues', value)
})

const handleVolumeChange = (index, value) => {
  store.commit('updateVolume', { index, value })
}

const handlePanChange = (index, value) => {
  store.commit('updatePanValue', { index, value })
}

// const n_channels = ref(5)
// const volumes = ref([80, 80, 80, 80, 80])
// const panValues = ref([0, 0, 0, 0, 0])

defineExpose({
  n_channels,
  volumes,
  panValues,
})
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
