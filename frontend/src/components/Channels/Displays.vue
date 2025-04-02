<!-- pattern在channel中的展示状态 -->
<template>
  <div
    @mousedown.left="handleCanvasMouseLeftDown"
    @mouseup="handleCanvasMouseUp"
    @mousemove="handleCanvasMouseMove"
    @contextmenu.prevent>
    <div v-for="display in displays">
      <div
        class="display"
        :style="
          patternStyle(
            display.channel,
            display.starttime,
            display.duration,
            display.color,
          )
        "
        @click.right="deleteDisplay(display.id)"
        @mousedown.left="startMoveDisplay(display, $event)"></div>
      <div
        class="display-resize-handle"
        :style="
          resizeHandleStyle(
            display.channel,
            display.starttime,
            display.duration,
          )
        "
        @mousedown.left="startResizeDisplay(display, $event)"></div>
    </div>
    <my-grid :n_rows="5" :h_rows="50" ref="gridEl" />
  </div>
</template>
<script setup>
import { ref, computed } from "vue"
import { useStore, mapState } from "vuex"

const store = useStore()
const displays = computed(() => store.state.displays)
const pattern = computed(() => store.getters.getActivePattern)
const activePattern = computed(() => store.state.activePattern)

const moveX = ref(0)
const moveY = ref(0)
const resizeX = ref(0)
const tmpDuration = ref(2)
const gridEl = ref(null)

const patternStyle = (row, col, duration, color) => ({
  left: `${col * 25}px`,
  top: `${row * 50 + 1}px`,
  width: `${duration * 25 - 1}px`,
  height: `${50 - 2}px`,
  backgroundColor: color,
})

const resizeHandleStyle = (row, starttime, duration) => ({
  left: `${(starttime + duration) * 25 - 5}px`,
  top: `${row * 50 + 1}px`,
  width: `5px`,
  height: `${50 - 2}px`,
})

let dragState = null
const selectedpatterns = ref(new Set())
const selectionBox = ref({ x1: 0, y1: 0, x2: 0, y2: 0 })

const handleCanvasMouseLeftDown = (e) => {
  e.preventDefault()
  if (e.ctrlKey || e.metaKey) return

  if (e.target.classList.contains("grid")) {
    // 添加display
    addDisplay(e)
  }
}


const handleCanvasMouseMove = (e) => {
  if (!dragState) return
  // 拖拽display尾部  
  if (dragState.type === "resize") {
    resizeDisplay(e)
    return
  }
  // 挪动display  
  if (dragState.type === "move") {
    moveDisplay(e)
    return
  }
}

const handleCanvasMouseUp = () => {
  dragState = null
}

const addDisplay = (e) => {
  const rect = e.target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  // console.log("add display:", store.state.activePattern)
  if (activePattern.value > 0) {
    const newDisplay = {
      id: Date.now(),
      patternId: pattern.value.id,
      starttime: Math.floor(x / 25),
      duration: tmpDuration.value,
      channel: Math.floor(y / 50),
      color: pattern.value.color,
    }
    store.commit("addDisplay", newDisplay)
  }
}

const deleteDisplay = (id) => {
  store.commit("deleteDisplay", { id })
}
// 复用pianoroll中startMoveNote
const startMoveDisplay = (display, e) => {
  const gridRect = gridEl.value.$el.getBoundingClientRect()

  dragState = {
    type: "move",
    displayId: display.id,
    startX: Math.floor((e.clientX - gridRect.left) / 25),
    startY: Math.floor((e.clientY - gridRect.top) / 50),
    originalPos: { ...display },
  }
}
// 复用pianoroll中startResizeNote
const startResizeDisplay = (display, e) => {
  e.stopPropagation()
  const gridRect = gridEl.value.$el.getBoundingClientRect()
  dragState = {
    type: "resize",
    displayId: display.id,
    startX: Math.floor((e.clientX - gridRect.left) / 25),
    originalPos: { ...display },
  }
}
// 复用pianoroll中MoveNote
const moveDisplay = (e) => {
  const gridRect = gridEl.value.$el.getBoundingClientRect()
  const x = Math.floor((e.clientX - gridRect.left) / 25)
  const y = Math.floor((e.clientY - gridRect.top) / 50)

  if (x === moveX.value && y === moveY.value) return
  moveX.value = x
  moveY.value = y

  const dx = x - dragState.startX
  const dy = y - dragState.startY

  let newStarttime = dragState.originalPos.starttime + dx
  let newChannel = dragState.originalPos.channel + dy

  newStarttime = Math.max(0, newStarttime)
  newChannel = Math.max(0, Math.min(4, newChannel))

  store.commit("updateDisplayPosition", {
    id: dragState.displayId,
    starttime: newStarttime,
    channel: newChannel,
  })
}
// 复用pianoroll中resizeNote
const resizeDisplay = (e) => {
  const gridRect = gridEl.value.$el.getBoundingClientRect()
  const x = Math.floor((e.clientX - gridRect.left) / 25)
  if (x === resizeX.value) return
  resizeX.value = x
  // console.log("update")
  const dx = x - dragState.startX

  let newDuration = dragState.originalPos.duration + dx
  newDuration = Math.max(1, newDuration)
  tmpDuration.value = newDuration

  store.commit("updateDisplayDuration", {
    id: dragState.displayId,
    duration: newDuration,
  })
}
</script>

<style scoped>
.display {
  z-index: 9;
  opacity: 1;
  position: absolute;
  box-sizing: border-box;
}

.display-resize-handle {
  position: absolute;
  background-color: rgba(255, 191, 0, 0.5);
  cursor: ew-resize;
  z-index: 10;
}
</style>
