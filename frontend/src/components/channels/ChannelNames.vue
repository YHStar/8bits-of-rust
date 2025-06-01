<!-- 音轨左边栏,显示音轨名称 -->
<template>
  <div class="key-column">
    <div
      v-for="i in proxy.CHANNEL_RANGE"
      :key="i"
      class="key"
      :style="{ top: (i - 1) * 50 + 'px' }"
    >
      <my-text
        :content="'通道' + i"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
</script>

<style scoped>
.key-column {
  position: absolute;
  z-index: 5;
  width: 82px;
  background: var(--global-highlight);
}

.key {
  position: absolute;
  left: 0;
  right: 0;
  height: calc(50px - 2px);
  background: var(--global-highlight);
  border-right: var(--global-grid) solid 2px;
  border-top: var(--global-grid) solid 1px;
  border-bottom: var(--global-grid) solid 2px;
}
</style>
