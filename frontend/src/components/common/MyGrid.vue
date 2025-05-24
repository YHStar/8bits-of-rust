<!-- 矩阵组件 -->
<template>
  <div
    class="grid"
    :style="{
      width: 25 * 8 * props.n_bars + 25 + 'px',
      height: props.h_rows * props.n_rows + 1 + 'px',
    }"
  >
    <div
      v-for="beat in 8 * props.n_bars"
      class="grid-horizontal"
      :style="{ left: beat * 25 - 1 + 'px' }"
    ></div>

    <div
      v-for="i in props.n_rows + 1"
      class="grid-vertical"
      :style="{ top: (i - 1) * props.h_rows - 1 + 'px' }"
    ></div>
  </div>
</template>

<script>
export default { name: "MyGrid" };
</script>
<script setup>
const props = defineProps({
  n_bars: {
    type: Number,
    default: 16,
  },
  n_rows: {
    type: Number,
    default: 5,
  },
  h_rows: {
    type: Number,
    default: 60,
  },
});
</script>

<style>
.grid {
  position: relative;
  height: 100%;
}

.grid-horizontal {
  position: absolute;
  width: 1px;
  height: 100%;
  border-left: 2px solid var(--global-grid);
  /* z-index: 10; */
}

.grid-vertical {
  position: absolute;
  height: 1px;
  width: 100%;
  border-top: 2px solid var(--global-grid);
}
</style>
