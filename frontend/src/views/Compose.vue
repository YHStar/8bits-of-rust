<!-- 创作页面 -->
<template>
  <div>
    <div class="container">
      <my-button
        text="插件"
        :active="$store.state.activeComposePage === 'plugin'"
        @click="changeComposePage('plugin')" />
      <my-button
        text="混音台"
        :active="$store.state.activeComposePage === 'mixer'"
        @click="changeComposePage('mixer')" />
      <my-button
        text="编曲"
        :active="$store.state.activeComposePage === 'arrangement'"
        @click="changeComposePage('arrangement')" />
      <my-button
        text="导出歌曲"
        :active="$store.state.activeComposePage === 'export'"
        @click="changeComposePage('export')" />
      <play-unit class="play-unit" />
    </div>

    <div class="placeholder-block"></div>

    <plugin v-if="isComposePage('plugin')">1</plugin>
    <mixer v-if="isComposePage('mixer')">2</mixer>
    <arrangement v-if="isComposePage('arrangement')">3</arrangement>
    <export-song v-if="isComposePage('export')">4</export-song>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useStore } from "vuex"
import Plugin from "@/components/compose/Plugin.vue"
import Mixer from "@/components/compose/Mixer.vue"
import Arrangement from "@/components/compose/Arrangement.vue"
import ExportSong from "@/components/compose/ExportSong.vue"
import PlayUnit from "@/components/playUnit/PlayUnit.vue"

// 通过store.state.activeComposePage选择显示的子页面
const store = useStore()

const isComposePage = computed(
  () => (page) => store.state.activeComposePage === page,
)

const changeComposePage = (page) => {
  store.commit("setActiveComposePage", page)
}
</script>

<style>
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 6px;
}

.placeholder-block {
  height: 50px;
}
</style>
