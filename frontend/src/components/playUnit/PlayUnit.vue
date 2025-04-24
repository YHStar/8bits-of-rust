<!-- 播放单元 -->
<template>
  <div class="play-unit">
    <div class="button-unit">
      <my-button size="small" :active="playStatus === 'playing'" @click="play">
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2L14 8L4 14V2Z" />
          </svg>
        </template>
      </my-button>
      <my-button size="small" :active="playStatus === 'paused'" @click="pause">
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="4" y="2" width="4" height="12" rx="1" />
            <rect x="10" y="2" width="4" height="12" rx="1" />
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
    </div>

    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useStore } from "vuex"

const playStatus = ref("stopped")
const progress = ref(0)
const store = useStore()

const play = () => {
  playStatus.value = "playing"
  store.commit("play")
}

const pause = () => {
  playStatus.value = "paused"
}

const reset = () => {
  playStatus.value = "stopped"
  progress.value = 0
}
</script>

<style scoped>
.play-unit {
  margin-top: -10px;
  padding: 4px;
  background: var(--pixel-background);
}

.button-unit {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.my-button svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transform-origin: center;
}

.progress-container {
  /* margin-top: 15px; */
  height: 8px;
  width: 100%;
  background: #3a3a3a;
  /* border-radius: 4px; */
  /* overflow: hidden; */
}
.progress-bar {
  height: 100%;
  background: var(--pixel-highlight);
  transition: width 0.3s ease;
}
</style>
