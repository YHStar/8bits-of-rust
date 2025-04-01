<template>
  <div>
    <ul>
      <li
        v-for="(question, index) in questions"
        :key="question.id"
        draggable="true"
        @dragstart="dragStart(index)"
        @dragover="allowDrop"
        @drop="drop(index)"
        class="draggable-item"
      >
        {{ question.text }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "MyTest",
};
</script>
<script setup>
import { ref } from "vue";

const questions = ref([
  { id: 1, text: "问题 1" },
  { id: 2, text: "问题 2" },
  { id: 3, text: "问题 3" },
  { id: 4, text: "问题 4" },
]);

const draggingIndex = ref(-1); // 被拖拽元素的索引

// 拖拽开始
const dragStart = (index) => {
  draggingIndex.value = index;
};

// 允许放置
const allowDrop = (e) => {
  e.preventDefault();
};

// 放置
const drop = (index) => {
  const draggedItem = questions.value.splice(draggingIndex.value, 1)[0]; // 移除被拖拽的元素
  questions.value.splice(index, 0, draggedItem); // 将被拖拽的元素插入到新位置
  draggingIndex.value = -1; // 重置被拖拽元素的索引
};
</script>

<style scoped>
.draggable-item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  cursor: move;
  background-color: #f9f9f9;
}
</style>
