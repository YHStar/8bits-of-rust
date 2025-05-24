import { computed } from "vue";

export const useNoteHandlers = (store, gridEl, dragParams) => {
  // 音符边界常量（可配置化）
  const NOTE_CONSTRAINTS = {
    MAX_PITCH: 87,
    MIN_DURATION: 1,
    CELL_WIDTH: 25,
    CELL_HEIGHT: 20
  };

  // 坐标转换函数
  const getGridPosition = (clientX, clientY) => {
    const gridRect = gridEl.value?.$el.getBoundingClientRect();
    return {
      x: Math.floor((clientX - gridRect?.left) / NOTE_CONSTRAINTS.CELL_WIDTH),
      y: Math.floor((clientY - gridRect?.top) / NOTE_CONSTRAINTS.CELL_HEIGHT)
    };
  };

  // 移动音符
  const moveNoteHandler = (dragState, e) => {
    const { x, y } = getGridPosition(e.clientX, e.clientY);
    // 只有位置确实改变时才提交更新
    if (dragParams.moveX === x && dragParams.moveY === y) return;
    const dx = x - dragState.startX;
    const dy = y - dragState.startY;
    if (dragState.type !== "move") return;
    // 计算新位置
    let newStarttime = dragState.originalPos.starttime + dx;
    let newPitch = dragState.originalPos.pitch + dy;
    // 边界检查
    newStarttime = Math.max(0, dragState.originalPos.starttime + dx);
    newPitch = Math.max(
      0,
      Math.min(NOTE_CONSTRAINTS.MAX_PITCH, dragState.originalPos.pitch + dy)
    );

    store.commit("updateNotePosition", {
        id: dragState.noteId,
        starttime: newStarttime,
        pitch: newPitch,
    });
  };

  // 设置音符时值,逻辑类似moveNoteHandler
  const resizeNoteHandler = (dragState, e) => {
    const { x } = getGridPosition(e.clientX, 0);
    const dx = x - dragState.startX;
    
    const newDuration = Math.max(
      NOTE_CONSTRAINTS.MIN_DURATION, 
      dragState.originalPos.duration + dx
    );

    if (newDuration !== dragState.originalPos.duration) {
      store.commit("updateNoteDuration", {
        id: dragState.noteId,
        duration: newDuration
      });
    }
  };

  // 创建音符逻辑
  const addNoteHandler = (e, tmpDuration) => {
    const { x, y } = getGridPosition(e.clientX, e.clientY);
    store.commit("addNote", {
      id: Date.now(),
      starttime: x,
      duration: tmpDuration.value,
      pitch: y
    });
  };

  return {
    moveNoteHandler,
    resizeNoteHandler,
    addNoteHandler
  };
};