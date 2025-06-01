<!-- 歌曲表单提交逻辑 -->
<template>
  <div class="container">
    <div class="input-container">
      <my-input v-model="songName" placeholder="请输入歌曲名称..." />
      <my-button
        type="primary"
        @click="addItem"
        text="添加歌曲"
        class="add-btn"
        size="medium"
      />
    </div>
    <SongsList ref="songsListRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SongsList from "./SongsList.vue";

const songName = ref("");
const songsListRef = ref(null);

// 检查并提交歌曲名字
const addItem = () => {
  if (songName.value.trim()) {
    songsListRef.value.addItem(songName.value);
  } else {
    songsListRef.value.addItem("untitled");
  }
  songName.value = "";
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: row;
  gap: 6px;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
