// 封装拖拽相关逻辑
import { ref } from "vue";

export function useDragDrop(commit) {
  const draggingIndex = ref(-1);

  const handlers = {
    dragStart: (index) => {
      draggingIndex.value = index;
    },
    allowDrop: (e) => {
      e.preventDefault();
    },
    drop: (index) => {
      commit("sortPattern", {
        index: draggingIndex.value,
        newIndex: index,
      });
      draggingIndex.value = -1;
    },
  };

  return { ...handlers };
}
