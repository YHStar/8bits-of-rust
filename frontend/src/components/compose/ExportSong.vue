<!-- 导出歌曲界面 -->
<template>
  <div class="container">
    <div class="export-params">
      <div class="selector">
        <my-text content="导出格式：" size="large" />
        <my-select
          v-model="exportFormat"
          :options="[
            { label: '.mp3', value: 'mp3' },
            { label: '.wav', value: 'wav' },
          ]"
        />
      </div>
      <div class="selector">
        <my-text content="导出位宽：" size="large" />
        <my-select
          v-model="exportBitWidth"
          :options="[
            { label: '8bit', value: '8bit' },
            { label: '16bit', value: '16bit' },
            { label: '24bit', value: '24bit' },
          ]"
        />
      </div>
      <div class="selector">
        <my-text content="歌曲名字：" size="large" />
        <my-input v-model="songName" size="large" />
      </div>
      <my-text
        v-bind:content="'预计占用空间：' + estimated_space + 'MB'"
        size="large"
      />
    </div>
    <div class="export-button">
      <my-button size="large" text="导出" />
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const songName = computed({
  get: () => store.state.exportsongs.songName,
  set: (value) => store.commit("exportsongs/setSongName", value),
});

const exportFormat = computed({
  get: () => store.state.exportsongs.format,
  set: (value) => store.commit("exportsongs/setFormat", value),
});

const exportBitWidth = computed({
  get: () => store.state.exportsongs.bitWidth,
  set: (value) => store.commit("exportsongs/setBitWidth", value),
});

const estimated_space = computed(() => store.state.exportsongs.estimated_space);
</script>
<style scoped>
.container {
  display: flex;
  flex: row;
  align-items: center;
  justify-content: center;
  height: 600px;
  gap: 100px;
}
.export-params {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.selector {
  display: flex;
  gap: 40px;
}
.export-button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
