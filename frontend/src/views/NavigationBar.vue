<!-- 导航栏 -->
<template>
  <div class="container">
    <my-button
      text="创作"
      :active="store.state.currentRoute === '/compose'"
      @click="navigateTo('/compose')" />
    <my-button
      text="歌曲"
      :active="store.state.currentRoute === '/songs'"
      @click="navigateTo('/songs')" />
    <my-button
      text="开发者"
      :active="store.state.currentRoute === '/developers'"
      @click="navigateTo('/developers')" />
  </div>
</template>

<script setup>
import { useStore } from "vuex"
import { useRouter } from "vue-router"
// 使用router进行网页导航
const store = useStore()
const router = useRouter()
const navigateTo = (route) => {
  store.commit("setCurrentRoute", route)
  router.push(route)
}
</script>

<style>
.container {
  display: flex;
}
</style>
