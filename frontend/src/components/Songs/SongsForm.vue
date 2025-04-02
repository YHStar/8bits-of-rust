<template>
  <div class="container">
    <div class="input-container">
      <my-input v-model="songName" placeholder="请输入歌曲名称..." />
      <my-button
        type="primary"
        @click="addItem"
        text="新增歌曲"
        class="add-btn"
        size="medium"
      />
    </div>
    <SongsList ref="songsListRef" />
  </div>
</template>

<script>
import SongsList from "./SongsList.vue";
export default {
  data() {
    return {
      songName: "untitled",
    };
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     console.log("songsForm已初始化:", this.$refs.songsListRef.songs);
  //   });
  // },
  components: {
    SongsList,
  },
  methods: {
    addItem() {
      if (this.songName.trim()) {
        this.$refs.songsListRef.addItem(this.songName);
      } else {
        this.$refs.songsListRef.addItem("untitled");
      }
      this.songName = "";
    },
  },
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
