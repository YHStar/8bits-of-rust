<!-- 矩阵组件 -->
<template>
  <div
    class="grid"
    :style="{
      width: 25 * 8 * props.n_bars + 25 + 'px',
      height: props.h_rows * props.n_rows + 1 + 'px',
    }"
  >
    <div v-for="i in props.n_rows + 1">
      <div
        v-if="i % 12 != 8"
        class="grid-vertical-normal"
        :style="{ top: (i - 1) * props.h_rows - 1 + 'px' }"
      ></div>
      <div
        v-else
        class="grid-vertical-border"
        :style="{ top: (i - 1) * props.h_rows - 1 + 'px' }"
      ></div>
    </div>

    <div v-for="beat in 8 * props.n_bars">
      <div
        v-if="beat % 8"
        class="grid-horizontal-normal"
        :style="{
          left: beat * 25 - 1 + 'px',
        }"
      ></div>
      <div
        v-else
        class="grid-horizontal-border"
        :style="{
          left: beat * 25 - 1 + 'px',
        }"
      ></div>
    </div>
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

.grid-horizontal-normal {
  position: absolute;
  width: 1px;
  height: 100%;
  border-left: 2px solid var(--global-grid);

  /* z-index: 10; */
}

.grid-horizontal-border {
  position: absolute;
  width: 1px;
  height: 100%;
  border-left: 2px solid var(--global-bar);
  z-index: 2;
  /* z-index: 10; */
}

.grid-vertical-normal {
  position: absolute;
  height: 1px;
  width: 100%;
  border-top: 2px solid var(--global-grid);
}

.grid-vertical-border {
  position: absolute;
  height: 1px;
  width: 100%;
  z-index: 2;

  border-top: 2px solid var(--global-bar);
}
</style>
