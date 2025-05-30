<!-- 钢琴窗音符显示逻辑 -->
<template>
  <div
    @mousedown.left="handleCanvasMouseLeftDown"
    @mouseup="handleCanvasMouseUp"
    @mousemove="handleCanvasMouseMove"
    @contextmenu.prevent
  >
    <div v-for="note in notes">
      <div
        class="note"
        :style="noteStyle(note.pitch, note.starttime, note.duration)"
        @mousedown.right="deleteNote(note, $event)"
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

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore, mapState } from "vuex";
// import { useNoteStyle } from "./noteStyle";
import { useNoteHandlers } from "./noteHandler";

const gridSize = { cellWidth: 25, cellHeight: 20 };
// const {noteStyle} = useNoteStyle(gridSize);

const store = useStore();
const notes = computed(() => store.state.notes);
const gridEl = ref(null);

const { moveNoteHandler, resizeNoteHandler, addNoteHandler } = useNoteHandlers(
  store,
  gridEl,
);

// 音符样式计算
// ref响应式变量在template中会自动解包，这里的函数传入参数都是自动解包后ref变量
const noteStyle = (row, col, duration) => ({
  left: `${col * gridSize.cellWidth}px`,
  top: `${row * gridSize.cellHeight + 1}px`,
  width: `${duration * gridSize.cellWidth - 1}px`,
  height: `${gridSize.cellHeight - 2}px`,
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

// 下一次新建note时,duration设置为最近操作过音符的note
const tmpDuration = ref(2);

// 处理鼠标左键按下
const handleCanvasMouseLeftDown = (e) => {
  if (e.ctrlKey || e.metaKey) return;

  if (e.target.classList.contains("grid")) {
    // 添加音符
    addNoteHandler(e, tmpDuration);
  }
};

// 处理鼠标移动
const handleCanvasMouseMove = (e) => {
  if (!dragState) return;
  if (dragState.type === "resize") {
    // 拖拽音符尾部,设置时值
    resizeNoteHandler(dragState, e, tmpDuration);
    return;
  }
  if (dragState.type === "move") {
    // 挪动音符位置
    moveNoteHandler(dragState, e, tmpDuration);
    return;
  }
};

// 处理鼠标弹起
const handleCanvasMouseUp = () => {
  dragState = null;
};

// 删除音符
const deleteNote = (note, e) => {
  e.preventDefault();
  store.commit("deleteNote", note);
};

// 开始挪动音符
const startMoveNote = (note, e) => {
  const gridRect = gridEl.value.$el.getBoundingClientRect();
  dragState = {
    type: "move",
    noteId: note.id,
    startX: Math.floor((e.clientX - gridRect.left) / 25),
    startY: Math.floor((e.clientY - gridRect.top) / 20),
    duration: note.duration,
    originalPos: { ...note },
  };
};
// 开始拖拽音符尾部
const startResizeNote = (note, e) => {
  e.stopPropagation();
  const gridRect = gridEl.value.$el.getBoundingClientRect();
  // console.log(note.id);
  dragState = {
    type: "resize",
    noteId: note.id,
    startX: Math.floor((e.clientX - gridRect.left) / 25),
    originalPos: { ...note },
  };
};
</script>

<style scoped>
.note {
  background-color: rgb(255, 220, 62);
  z-index: 9;
  opacity: 1;
  position: absolute;
  box-sizing: border-box;
  transition: transform 0.2s ease;
}

.note-resize-handle {
  position: absolute;
  background-color: rgb(255, 162, 0);
  cursor: ew-resize;
  z-index: 10;
}

.note-resize-handle:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
