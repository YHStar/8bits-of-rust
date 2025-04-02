<template>
  <div
    @mousedown.left="handleCanvasMouseDown"
    @mouseup="handleCanvasMouseUp"
    @mousemove="handleCanvasMouseMove"
  >
    <div v-for="note in notes">
      <div
        class="note"
        :style="noteStyle(note.pitch, note.starttime, note.duration)"
        @mousedown.right="deleteNote(note.id)"
        @mousedown.left="startMoveNote(note, $event)"
      ></div>

      <div
        class="note-resize-handle"
        :style="resizeHandleStyle(note.pitch, note.starttime, note.duration)"
        @mousedown.left="startResizeNote(note, $event)"
      ></div>
    </div>
    <my-grid :n_rows="88" :h_rows="20" ref="gridEl" />
  </div>
</template>
<script>
export default {};
</script>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore, mapState } from "vuex";

const store = useStore();
const notes = computed(() => store.state.notes);

// store.state.notes)
const gridEl = ref(null);

// const notes = computed(() => {
// 	let note;
// 	for (note in store.state.notes) {
// 		console.log(note.pitch);
// 	}
// 	return store.state.notes
// })

// 音符样式计算
const noteStyle = (row, col, duration) => ({
  left: `${col * 25}px`,
  top: `${row * 20 + 1}px`,
  width: `${duration * 25 - 1}px`,
  height: `${20 - 2}px`,
});

const resizeHandleStyle = (row, starttime, duration) => ({
  left: `${(starttime + duration) * 25 - 5}px`,
  top: `${row * 20 + 1}px`,
  width: `5px`,
  height: `${20 - 2}px`,
});

// 事件处理函数
let dragState = null;
const selectedNotes = ref(new Set());
const selectionBox = ref({ x1: 0, y1: 0, x2: 0, y2: 0 });
const moveX = ref(0);
const moveY = ref(0);
const resizeX = ref(0);
const tmpDuration = ref(2);

onMounted(() => {
  // console.log("notes: ", notes.grid[0][0] )
  // store.commit('initNotes')
});

const handleCanvasMouseDown = (e) => {
  // for (var note = 0; note < store.state.notes.length; note++) {
  //   console.log(note.id)
  // }
  // let x2 = e.clientX - rect.left
  // let y2 = e.clientY - rect.top
  if (e.ctrlKey || e.metaKey) return;

  if (e.target.classList.contains("grid")) {
    // 初始化框选
    const rect = e.target.getBoundingClientRect();
    // let x1 = e.clientX - rect.left
    // let y1 = e.clientY - rect.top
    // selectionBox.value = {
    // 	x1: e.clientX - rect.left,
    // 	y1: e.clientY - rect.top,
    // 	x2: e.clientX - rect.left,
    // 	y2: e.clientY - rect.top
    // }
    // dragState = { type: 'select' }
    // selectedNotes.value.clear()
    // 创建新音符逻辑
    // const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNote = {
      id: Date.now(),
      starttime: Math.floor(x / 25),
      duration: tmpDuration,
      pitch: Math.floor(y / 20),
    };
    console.log("handleCanvasMouseDown", newNote.id);
    store.commit("addNote", newNote);
  }
};

const deleteNote = (id) => {
  store.commit("deleteNote", id);
};

const startMoveNote = (note, e) => {
  const gridRect = gridEl.value.$el.getBoundingClientRect();

  dragState = {
    type: "move",
    noteId: note.id,
    startX: Math.floor((e.clientX - gridRect.left) / 25),
    startY: Math.floor((e.clientY - gridRect.top) / 20),
    originalPos: { ...note },
  };
};

const startResizeNote = (note, e) => {
  e.stopPropagation();
  const gridRect = gridEl.value.$el.getBoundingClientRect();
  console.log(note.id);
  dragState = {
    type: "resize",
    noteId: note.id,
    startX: Math.floor((e.clientX - gridRect.left) / 25),
    originalPos: { ...note },
  };
};

const handleCanvasMouseMove = (e) => {
  if (!dragState) return;
  if (dragState.type === "resize") {
    resizeNote(e);
    return;
  }
  if (dragState.type === "move") {
    moveNote(e);
    return;
  }
};

const moveNote = (e) => {
  const gridRect = gridEl.value.$el.getBoundingClientRect();

  // 计算相对网格的坐标
  const x = Math.floor((e.clientX - gridRect.left) / 25);
  const y = Math.floor((e.clientY - gridRect.top) / 20);
  if (moveX.value === x && moveY.value === y) return;
  moveX.value = x;
  moveY.value = y;
  // 计算移动距离
  const dx = x - dragState.startX;
  const dy = y - dragState.startY;

  if (dragState.type !== "move") return;
  // 计算新位置并应用边界检查
  let newStarttime = dragState.originalPos.starttime + dx;
  let newPitch = dragState.originalPos.pitch + dy;

  // 边界检查
  newStarttime = Math.max(0, newStarttime);
  newPitch = Math.max(0, Math.min(87, newPitch)); // 88个琴键(0-87)

  // 只有位置确实改变时才提交更新
  store.commit("updateNotePosition", {
    id: dragState.noteId,
    starttime: newStarttime,
    pitch: newPitch,
  });
};

const resizeNote = (e) => {
  const gridRect = gridEl.value.$el.getBoundingClientRect();

  const x = Math.floor((e.clientX - gridRect.left) / 25);
  if (x === resizeX.value) return;
  resizeX.value = x;

  const dx = x - dragState.startX;

  let newDuration = dragState.originalPos.duration + dx;
  newDuration = Math.max(1, newDuration); // 最小长度为1

  store.commit("updateNoteDuration", {
    id: dragState.noteId,
    duration: newDuration,
  });
};

const handleCanvasMouseUp = () => {
  dragState = null;
};

// // 矩形碰撞检测
// const isRectOverlap = (a, b) => {
// 	return a.x1 < b.right && a.x2 > b.left && a.y1 < b.bottom && a.y2 > b.top
// }

// // 键盘事件监听
// document.addEventListener('keydown', (e) => {
// 	if (e.key === 'Delete') {
// 		store.commit('DELETE_SELECTED')
// 	}
// 	if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
// 		const notesToCopy = store.state.notes.filter(n => store.state.selectedNotes.includes(n.id))
// 		store.commit('COPY_NOTES', notesToCopy)
// 	}
// })
</script>

<style scoped>
.note {
  background-color: rgb(255, 232, 172);
  z-index: 9;
  opacity: 1;
  position: absolute;
  box-sizing: border-box;
  transition: transform 0.2s ease;
}

.note-resize-handle {
  position: absolute;
  background-color: rgba(255, 191, 0, 0.5);
  cursor: ew-resize;
  z-index: 10;
}

.note-resize-handle:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
