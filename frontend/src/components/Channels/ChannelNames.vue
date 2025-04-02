<!-- 音轨左边栏,显示音轨名称 -->
<template>
  <div class="key-column">
    <div
      v-for="i in proxy.CHANNEL_RANGE"
      :key="i"
      class="key"
      :style="{ top: (i - 1) * 50 + 'px' }">
      <my-text
        :content="'通道' + i"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
        }" />
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue"
const { proxy } = getCurrentInstance()
</script>

<style scoped>
.key-column {
  position: absolute;
  z-index: 5;
  width: 82px;
  background: #ffffff;
}

.key {
  position: absolute;
  left: 0;
  right: 0;
  height: calc(50px - 2px);
  background: #fff;
  border-right: #aaa solid 2px;
  border-top: #aaa solid 1px;
  border-bottom: #aaa solid 2px;
}

.key.black {
  background: #000000;
  z-index: 2;
  height: 20px !important;
  border-left: 30px solid #fff !important;
}
</style>
