<!-- 钢琴窗组件 -->
<template>
  <div></div>
  <div class="roll" ref="rollContainer" @scroll="handleScroll">
    <div class="header-bar" :style="headerBarStyle">
      <span
        v-for="beat in beats"
        :key="'h' + beat"
        :style="getBeatStyle(beat)"
        class="c-label">
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
import { ref, computed, onMounted, onUnmounted, watch  } from "vue"
import { useStore } from "vuex"

import PianoKeys from "./PianoKeys.vue"
import Score from "./Score.vue"

const n_bars = ref(16)
const beats = computed(() => 16 + 1)

const headerBarStyle = computed(() => ({
  width: `${100 + 5 + 200 * n_bars.value}px`,
}))

const getBeatStyle = (beat) => ({
  left: `${80 - 3 + (beat - 1) * 200}px`,
})


const store = useStore()
const rollContainer = ref(null)

// 监听滚动事件
const handleScroll = (e) => {
  store.commit("setPianoScroll", {
    x: e.target.scrollLeft,
    y: e.target.scrollTop
  })
}

// 初始化时恢复滚动位置
onMounted(() => {
  if (rollContainer.value) {
    rollContainer.value.scrollLeft = store.state.pianoroll_scrollX
    rollContainer.value.scrollTop = store.state.pianoroll_scrollY
  }
})

// 移除事件监听
onUnmounted(() => {
  if (rollContainer.value) {
    rollContainer.value.removeEventListener("scroll", handleScroll)
  }
})


// 监听Vuex状态变化
watch(
  () => [store.state.pianoroll_scrollX, store.state.pianoroll_scrollY],
  ([newX, newY]) => {
    if (rollContainer.value) {
      rollContainer.value.scrollLeft = newX
      rollContainer.value.scrollTop = newY
    }
  },
  { deep: true }
)
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