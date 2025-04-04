<!-- 编曲界面 -->
<template>
  <div>
    <div class="main-container">
      <div class="a">
        <patterns ref="patterns" class="patterns" />
        <channels ref="channels" class="channels" />
      </div>
    </div>
    <piano-roll />
  </div>
</template>

<script setup>
import PianoRoll from "../pianoRoll/PianoRoll.vue"
import Channels from "../channels/Channels.vue"
import Patterns from "../patterns/Patterns.vue"
</script>

<style scoped>
.a {
  height: 400px;
  display: flex;
  flex-direction: row;
  overflow-x: visible;
  gap: 20px;
}
.patterns {
  width: 150px;
  height: 100%;
}

.channels {
  flex: 1;
  min-width: 0;
}
</style>
