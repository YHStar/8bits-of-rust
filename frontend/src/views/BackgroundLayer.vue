<!-- 背景层 -->
<template>
  <div class="container"></div>
  <div class="background-layer"></div>
</template>

<style scoped>
.background-layer {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("@/assets/image.png") rgb(255, 157, 36) repeat;
  background-blend-mode: multiply;
  opacity: 0.3;
  z-index: -1;
}

.container {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(255, 157, 36) repeat;
  /* 叠加一个蒙版 */
  background-blend-mode: multiply;
  opacity: 0.3;
  z-index: -1;
}
</style>
