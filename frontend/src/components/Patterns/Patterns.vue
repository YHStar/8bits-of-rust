<template>
  <div class="container">
    <div class="input-container">
      <my-input v-model="patternName" />
      <my-button
        class="add-button"
        size="small"
        text="+"
        @click="addPattern()"
      />
    </div>
    <div class="patterns-container">
      <div
        v-for="(pattern, index) in patterns"
        class="pattern"
        draggable="true"
        @dragstart="dragStart(index)"
        @dragover="allowDrop"
        @drop="drop(index)"
      >
        <my-button
          :text="pattern.name"
          :active="activePattern === pattern.id"
          :color="pattern.color"
          @click.left="handleLeftClick(pattern.id)"
          @click.right="deletePattern(pattern.id)"
          @dblclick="editPattern(pattern.id)"
        />
        <my-input 
          class="rename"
          v-if="isEdit===pattern.id"
          v-model="newPatternName"
          placeholder="输入新名称..."
          @keyup.enter="renamePattern(pattern.id)"
          @keyup.esc="stopRenamePattern(pattern.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useColorGenerator } from "@/components/common/ColorGenerator.js";
import MyInput from "../common/MyInput.vue";

const { getRandomColor } = useColorGenerator();
const store = useStore();
const patterns = computed(() => store.state.patterns);
const activePattern = computed(() => store.state.activePattern); // 跟踪激活状态
const isEdit = ref(-1);
const patternName = ref("");
const newPatternName = ref("")
// 位置样式计算


const handleLeftClick = (id) => {

    store.commit("setActivePattern", id);
}

const addPattern = () => {
  const newPattern = {
    id: Date.now(),
    color: getRandomColor(),
    name:
      patternName.value !== ""
        ? patternName.value
        : "Pattern " + (patterns.value.length + 1),
    notes: [],
  };
  patternName.value = "";
  // console.log("New color:", newPattern.color);
  store.commit("addPattern", newPattern);
  // console.log("Added pattern:", newPattern);
};

const deletePattern = (id) => {
  if (isEdit.value === id){
    isEdit.value = -1
  }
  else if(confirm("确定删除这个乐段？")) {
    if(id === activePattern.value){
      // console.log("need reset active pattern")
      store.commit("setActivePattern", 0);
    }
    store.commit("deletePattern", id);
  }
};

const draggingIndex = ref(-1); // 被拖拽元素的索引

// 拖拽开始
const dragStart = (index) => {
  draggingIndex.value = index;
};

// 允许放置
const allowDrop = (e) => {
  e.preventDefault();
};

const editPattern = (id) => {
  // console.log("dbclick")
  isEdit.value = id;
};

const renamePattern = (id) => {
  console.log("enter")
  store.commit("renamePattern", {
    id:id, 
    name:newPatternName.value
  })
  newPatternName.value = ""
  isEdit.value = -1
}
const stopRenamePattern = (id) => {
  console.log("esc")
  newPatternName.value = ""
  isEdit.value = -1
}
// 放置
const drop = (index) => {
  store.commit("sortPattern", {
    index: draggingIndex.value,
    newIndex: index,
  });
  draggingIndex.value = -1;
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: row;
  position: sticky;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.patterns-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 6px;
}

.add-button {
  max-width: 20px;
}
.rename{
  width: 125px;
}
.pattern {
  /* max-height: 48px; */
  z-index: 6;
  max-width: 80px;
}
</style>
