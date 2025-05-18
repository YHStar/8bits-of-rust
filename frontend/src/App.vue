<template>
  <div>
    <background-layer />
    <!-- <start-screen v-if="StartRoute" /> -->
    <navigation-bar v-if="!StartRoute" />
    <!-- <my-test /> -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavigationBar from "@/views/NavigationBar.vue"
import BackgroundLayer from "@/views/BackgroundLayer.vue"
import { computed } from "vue"
import { useRouter } from "vue-router"

// 初始化store中的WASM实例
import { useStore } from "vuex"
const store = useStore()
store.commit("initWasmInstance")

// 根据router选择开始界面还是正式界面
const router = useRouter()

const StartRoute = computed(() => {
  return router.currentRoute.value.path === "/"
})
</script>
