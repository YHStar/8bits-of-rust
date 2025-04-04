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
import PianoRoll from "../PianoRoll/PianoRoll.vue"
import Channels from "../Channels/Channels.vue"
import Patterns from "../Patterns/Patterns.vue"
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
