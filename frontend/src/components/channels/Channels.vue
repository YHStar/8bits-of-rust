<!-- 音轨页面 -->
<template>
  <div class="roll">
    <div class="header-bar" :style="{ width: 100 + 5 + 200 * n_bars + 'px' }">
      <span
        v-for="beat in n_bars + 1"
        :key="'h' + beat"
        :style="{ left: 80 - 3 + (beat - 1) * 200 + 'px' }"
        class="c-label">
        {{ beat - 1 }}
      </span>
    </div>
    <!-- <my-left-bar class="left-bar" :component-name="leftBarStyle" /> -->
    <div class="left-bar">
      <ChannelNames :Range="proxy.CHANNEL_RANGE" />
    </div>
    <div class="content-area">
      <PatternManager />
    </div>
  </div>
</template>

<script setup>
import PatternManager from "./Displays.vue"
import ChannelNames from "./ChannelNames.vue"
import { getCurrentInstance } from "vue"
const { proxy } = getCurrentInstance()
const n_bars = 16
</script>

<style scoped>
.roll {
  position: relative;
  height: 400px;
  width: calc(100% - 100px);
  overflow-x: scroll;
  overflow-y: auto;
  z-index: 0;

  .content-area {
    left: 80px;
    position: relative;
    width: calc(100%);
    z-index: 1;
  }

  .left-bar {
    position: sticky;
    left: 0;
    z-index: 2;
  }

  .header-bar {
    position: sticky;
    top: 0;
    height: 20px;
    background: var(--global-headbar);
    z-index: 3;
  }
}
</style>

