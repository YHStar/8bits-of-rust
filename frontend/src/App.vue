<template>
  <div>
    <background-layer />
    <!-- <start-screen v-if="StartRoute" /> -->
    <navigation-bar v-if="!StartRoute" />
    <!-- <my-test /> -->
    <div class="bar"></div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import Start from "@/views/Start.vue"
import NavigationBar from "@/views/NavigationBar.vue"
import BackgroundLayer from "@/views/BackgroundLayer.vue"
import { computed } from "vue"
import { useRouter } from "vue-router"

// 根据router选择开始界面还是正式界面
const router = useRouter()

const StartRoute = computed(() => {
  return router.currentRoute.value.path === "/"
})
</script>

<style>
.bar {
  margin: 10px;
  height: 10px;
  width: 400px;
}
</style>
