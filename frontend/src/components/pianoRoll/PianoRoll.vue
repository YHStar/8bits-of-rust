<!-- 钢琴窗组件 -->
<template>
  <div></div>
  <div class="roll" ref="rollContainer" @scroll="handleScroll">
    <div class="header-bar" :style="headerBarStyle">
      <span
        v-for="beat in beats"
        :key="'h' + beat"
        :style="getBeatStyle(beat)"
        class="c-label"
      >
        {{ beat - 1 }}
      </span>
    </div>
    <div class="left-bar">
      <PianoKeys />
    </div>
    <div class="content-area">
      <Score />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useScrollHandler } from "./scrollState"; // 导入封装模块

import PianoKeys from "./PianoKeys.vue";
import Score from "./Score.vue";

const rollContainer = ref(null);
const { setupLifecycle, setupStateWatcher } = useScrollHandler(rollContainer);

// 初始化生命周期和状态监听
setupLifecycle();
setupStateWatcher();

// 以下保持原有结构不变
const n_bars = ref(16);
const beats = computed(() => 16 + 1);

const headerBarStyle = computed(() => ({
  width: `${100 + 5 + 200 * n_bars.value}px`,
}));

const getBeatStyle = (beat) => ({
  left: `${80 - 3 + (beat - 1) * 200}px`,
});
</script>

<style scoped>
.roll {
  position: relative;
  height: 600px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: scroll;
  z-index: 0;
}

.content-area {
  left: 80px;
  position: relative;
  width: calc(100%);
  height: calc(100%);
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
</style>
