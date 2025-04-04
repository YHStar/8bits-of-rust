
<!-- 歌曲列表逻辑 -->
<template>
  <div class="main-container">
    <table>
      <thead>
        <tr>
          <td><my-text content="序号" /></td>
          <td><my-text content="歌曲名称" /></td>
          <td><my-text content="创建时间" /></td>
          <td><my-text content="编辑" /></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song, index) in songs">
          <td><my-text :content="(index + 1).toString()" /></td>
          <td><my-text :content="song.name" /></td>
          <td><my-text :content="song.date" /></td>
          <td>
            <my-button text="删除" @click="deleteItem(index)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useStore } from "vuex"
import { getCurrentInstance } from "vue"
const { proxy } = getCurrentInstance()

const store = useStore()
const songs = computed(() => store.state.songs)
// 获取间格式化的时间
const getCurrentTime = () =>
  new Date().toISOString().slice(0, 16).replace("T", " ")

// 检查歌曲数量上限并添加歌曲
const addItem = (name) => {
  console.log("add", songs.value.length)
  if (songs.value.length >= proxy.MAX_SONG_NUM) {
    alert("歌曲数量达到上限！")
  } else {
    store.commit("addSong", {
      name: name,
      date: getCurrentTime(),
    })
  }
}

// 删除歌曲
const deleteItem = (index) => {
  if (confirm("确定删除这首歌曲吗？")) {
    store.commit("deleteSong", index)
  }
}

defineExpose({
  addItem,
  deleteItem,
})
</script>
