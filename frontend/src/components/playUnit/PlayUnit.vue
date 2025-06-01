<!-- 播放单元 -->
<template>
  <div class="play-unit">
    <div class="container1">
      <my-button
        size="small"
        :active="playStatus === 'playing'"
        @click="play_or_pause"
      >
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <!-- 播放图标（暂停状态时显示） -->
            <path v-if="playStatus === 'paused'" d="M4 2L14 8L4 14V2Z" />
            <!-- 暂停图标（播放状态时显示） -->
            <g v-if="playStatus === 'playing'">
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
        v-model="bpm"
        :min="10"
        :max="500"
        label="BPM"
        @change="updateInterval"
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
import { ref } from "vue";
import { useStore } from "vuex";

const playStatus = ref("paused");
const progress = ref(0);
const store = useStore();

const play_or_pause = () => {
  // 播放/暂停按钮逻辑
  if (playStatus.value == "paused") {
    playStatus.value = "playing";
    store.commit("play");
  } else if (playStatus.value == "playing") {
    playStatus.value = "paused";
    store.commit("pause");
  } else {
    console.log("unknown status!");
  }
};

const reset = () => {
  //重播按钮逻辑
  store.commit("reset");
  playStatus.value = "paused";
  progress.value = 0;
};
</script>

<style scoped>
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
  transition: width 0.3s ease;
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
