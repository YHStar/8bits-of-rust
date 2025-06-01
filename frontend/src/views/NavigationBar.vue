<template>
  <div class="container">
    <my-button
      text="创作"
      :active="currentRoute === '/compose'"
      @click="navigateTo('/compose')"
    />
    <my-button
      text="歌曲"
      :active="currentRoute === '/songs'"
      @click="navigateTo('/songs')"
    />
    <my-button
      text="开发者"
      :active="currentRoute === '/developers'"
      @click="navigateTo('/developers')"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

// 使用计算属性获取当前路由状态
const currentRoute = computed(() => store.state.route.currentRoute);

const navigateTo = (route) => {
  // 提交模块化的 mutation
  store.commit("route/setCurrentRoute", route);
  router.push(route);
};
</script>

<style>
.container {
  display: flex;
  gap: 12px; /* 添加按钮间距 */
}
</style>
