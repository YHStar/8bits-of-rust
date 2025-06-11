<template>
  <div class="play-unit">
    <div class="container1">
      <my-button size="small" :active="isPlaying" @click="playOrPause">
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <!-- 播放图标（暂停状态时显示） -->
            <path v-if="!isPlaying" d="M4 2L14 8L4 14V2Z" />
            <!-- 暂停图标（播放状态时显示） -->
            <g v-if="isPlaying">
              <rect x="4" y="2" width="4" height="12" rx="1" />
              <rect x="10" y="2" width="4" height="12" rx="1" />
            </g>
          </svg>
        </template>
      </my-button>

      <my-button size="small" @click="reset">
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="4" y="2" width="12" height="12" rx="1" />
          </svg>
        </template>
      </my-button>

      <my-knob
        :model-value="bpm"
        :min="0.1"
        :max="1"
        :ratio="500"
        label="BPM"
        @update:model-value="handleBpmChange"
      />
      <my-text class="bpm-value" content="bpm" />
    </div>

    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }" />
    </div>

    <div class="timer-container">
      <div class="timer-display">
        <my-text class="time" :content="formattedTime" />
        <my-text class="measure" :content="measureCount + '  小节'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useClock } from "./useClock";
import { useStore } from "vuex";

const store = useStore();

// 使用时钟功能并直接解构响应式变量
const {
  bpm,
  isPlaying,
  progress,
  measureCount,
  formattedTime,
  startClock,
  pauseClock,
  resetClock,
} = useClock();

// 处理 BPM 变更
const handleBpmChange = (newBpm) => {
  if (newBpm < 0.1 || newBpm > 1) {
    console.warn("BPM must be between 50 and 500");
  }
  newBpm = Math.max(0.1, Math.min(newBpm, 1)); // 这里确保bpm范围是50-500
  console.log("BPM changed to:", newBpm * 500);
  store.commit("setBpm", newBpm);// 后端更改Bpm
  bpm.value = newBpm;
};

// 播放/暂停按钮逻辑
const playOrPause = () => {
  if (!isPlaying.value) {
    startClock();
    store.commit("play");// 后端播放歌曲
  } else {
    pauseClock();
    store.commit("pause");// 后端暂停播放歌曲
  }
};

// 重置按钮逻辑
const reset = () => {
  resetClock();
  store.commit("reset");// 后端暂停并重置歌曲
};
</script>

<style scoped>
/* 保留原有样式不变 */
.play-unit {
  margin-top: -10px;
  padding: 4px;
  background: var(--global-background);
  border: 10px, solid, var(--global-border);
}

.my-button svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transform-origin: center;
}

.progress-container {
  height: 8px;
  width: 100%;
  background: var(--global-secondary);
}
.progress-bar {
  height: 100%;
  background: var(--global-highlight);
  transition: width 0.1s ease;
}
.timer-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.timer-display > * {
  flex-grow: 0;
  width: 100px;
}
.container1 {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
