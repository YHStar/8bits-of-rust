<template>
  <meta name="viewport" />
  <!-- content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" -->

  <div @contextmenu.prevent>
    <!-- 禁用右键菜单 -->
    <background-layer />
    <!-- <start-screen v-if="StartRoute" /> -->
    <navigation-bar v-if="!StartRoute" />
    <!-- <my-test /> -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavigationBar from "@/views/NavigationBar.vue";
import BackgroundLayer from "@/views/BackgroundLayer.vue";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// 初始化store中的WASM实例
import { useStore } from "vuex";
const store = useStore();
store.commit("initWasmInstance");

// 根据router选择开始界面还是正式界面
const router = useRouter();

const StartRoute = computed(() => {
  return router.currentRoute.value.path === "/";
});
// TODO:全局禁用浏览器手势
// onMounted(() => {
//   // 禁用多点触控和手势缩放
//   document.addEventListener("touchstart", (event) => {
//     if (event.touches.length > 1) event.preventDefault();
//   });
//   document.addEventListener("gesturestart", (event) => event.preventDefault());
// });

// history.pushState(null, null, document.URL);
//         window.addEventListener('popstate', function () {
//             history.pushState(null, null, document.URL);
//         });
</script>

<style>
body {
  /* overflow: hidden; */
  user-select: none;
  cursor: default;
  touch-action: none;
}
</style>
