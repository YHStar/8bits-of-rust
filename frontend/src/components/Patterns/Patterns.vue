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
          class="pattern-button"
          :text="pattern.name"
          :active="activePattern === pattern.id"
          :color="pattern.color"
          @click.left="selectPattern(pattern.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useColorGenerator } from "@/components/common/ColorGenerator.js";

const { getRandomColor } = useColorGenerator();
const store = useStore();
const patterns = computed(() => store.state.patterns);
const patternName = ref("");
const activePattern = computed(() => store.state.activePattern); // 跟踪激活状态

// 位置样式计算

const selectPattern = (id) => {
  // 这里可以添加业务逻辑
  store.commit("setActivePattern", id);
  // console.log("Selected pattern:", activePattern);
};

const addPattern = () => {
  const newPattern = {
    id: Date.now(),
    color: getRandomColor(),
    name: patternName.value !== "" ? patternName.value : "Pattern " + (patterns.value.length + 1),
  };
  patternName.value = "";
  // console.log("New color:", newPattern.color);
  store.commit("addPattern", newPattern);
  // console.log("Added pattern:", newPattern);
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

.pattern {
  /* max-height: 48px; */
  z-index: 6;
  max-width: 80px;
}
</style>
