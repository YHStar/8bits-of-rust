<template>
  <div>
    <div
      class="main-container"
    >
      <div class = "a">
        <!-- <div class="main-container"> -->
        <patterns ref="patterns" class="patterns" />
        <!-- <span ref="patterns" class="patterns" >1</span> -->
        <!-- </div> -->
        <!-- <div class="main-container"> -->
        <!-- <span ref="channels" class="channels" >2</span> -->
        <channels ref="channels" class="channels" />
        <!-- </div> -->        
      </div>
    </div>
    <piano-roll />
  </div>
</template>
<script>
import PianoRoll from "../PianoRoll/PianoRoll.vue";
import Channels from "../Channels/Channels.vue";
import Patterns from "../Patterns/Patterns.vue";

export default {
  components: {
    "piano-roll": PianoRoll,
    "channels": Channels,
    "patterns": Patterns,
  },
  // computed: {
  //     viewportWidth() {
  //         return this.$store.state.scrollX;
  //     }
  // },
  // methods: {
  //     handleTimelineScroll(e) {
  //         this.$store.commit('setScrollPosition', {
  //             x: e.target.scrollLeft,
  //             y: this.$store.state.scrollY
  //         });
  //     }
  // },
  // mounted() {
  //     document.addEventListener('mousemove', this.handleResizeMove);
  //     document.addEventListener('mouseup', this.stopResize);
  // },
  // beforeDestroy() {
  //     document.removeEventListener('mousemove', this.handleResizeMove);
  //     document.removeEventListener('mouseup', this.stopResize);
  // },
  methods: {
    // startResize(e) {
    //     this.isDragging = true;
    //     this.initialX = e.clientX;
    //     this.initialWidth = this.$refs.channelSection.offsetWidth;
    // },
    // syncScroll() {
    //     this.$refs.pianoSection.scrollLeft = this.$refs.channelSection.scrollLeft;
    // }
  },
};
</script>
<style scoped>
.a {
  height: 400px;
  display: flex;          /* 启用弹性布局 */
  flex-direction: row;    /* 默认值，可省略 */
  overflow-x: visible;
  gap:20px ;
}
.patterns {
  width: 150px;          /* 固定左侧宽度 */
  height: 100%;          /* 继承父容器高度 */
}

.channels {
  flex: 1;               /* 右侧自适应剩余宽度 */
  min-width: 0;          /* 防止内容溢出 */
}

</style>
