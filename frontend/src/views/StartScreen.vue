<template>
  <div @click="navigateTo('/compose')">
    <!-- <my-test /> -->
    <div class="start-button">
      <my-button text="创作你的8bit音乐" size="large" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(route) {
      this.$store.commit('setCurrentRoute', route);
      this.$router.push(route);
    }
  }
};
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