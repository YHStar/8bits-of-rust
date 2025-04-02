<!-- 开始界面 -->
<template>
  <div @click="navigateTo('/compose')">
    <div class="start-button">
      <my-button text="创作你的8bit音乐" size="large" />
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

const navigateTo = (route) => {
  store.commit("setCurrentRoute", route)
  router.push(route)
}
</script>

<style scoped>
.start-button {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
