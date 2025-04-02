<template>
  <div>
    <background-layer />
    <start-screen v-if="StartRoute" />
    <navigation-bar v-if="!StartRoute" />
    <div class = "bar"></div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import StartScreen from "@/views/StartScreen.vue";
import NavigationBar from "@/views/NavigationBar.vue";
import BackgroundLayer from "@/views/BackgroundLayer.vue";
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const StartRoute = computed(() => {
  return router.currentRoute.value.path === "/";
});
</script>

<style>
.bar{
  margin: 10px;
  height: 10px;
  width: 400px;
}
</style>
