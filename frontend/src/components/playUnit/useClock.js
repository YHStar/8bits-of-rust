// useClock.js
import { toRefs, computed, reactive, watch } from "vue";

export function useClock() {
  // 使用 reactive 创建响应式对象
  const state = reactive({
    elapsedTime: 0, // 累计时间（毫秒）
    isPlaying: false, // 歌曲是否正在播放
    bpm:  110 / 500, //
    progress: 0, // 歌曲进度条
    measureCount: 0,
  });

  // 计时器相关变量
  let animationFrameId = null;
  let lastTimeStamp = null;
  let lastBeatTime = 0; // 记录上一拍的时间

  // 计算属性：格式化显示的时间
  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(state.elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  });

  // 计算每拍的持续时间（毫秒）
  const beatDuration = computed(() => 120 / state.bpm);

  // 更新时钟（使用requestAnimationFrame实现高精度计时）
  function updateClock(timestamp) {
    if (state.isPlaying) {
      if (!lastTimeStamp) lastTimeStamp = timestamp;
      const delta = timestamp - lastTimeStamp;
      // 更新累计时间
      state.elapsedTime += delta;

      // 计算当前拍内的时间和进度
      const currentBeatTime = state.elapsedTime % beatDuration.value;
      const fullSongLen = 60;// 判断逻辑还没写，先随便设一个值
      state.progress = (state.elapsedTime / (fullSongLen * beatDuration.value));
      lastBeatTime = currentBeatTime;

      // 每4拍增加1小节
      const beatCount = Math.floor(state.elapsedTime / beatDuration.value);

      state.measureCount = Math.floor(beatCount / 4);
    }

    lastTimeStamp = timestamp;
    animationFrameId = requestAnimationFrame(updateClock);
  }

  // 启动时钟
  function startClock() {
    if (state.isPlaying) return;

    state.isPlaying = true;
    lastTimeStamp = null;
    animationFrameId = requestAnimationFrame(updateClock);
  }

  // 暂停时钟
  function pauseClock() {
    state.isPlaying = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // 重置时钟
  function resetClock() {
    pauseClock();
    state.elapsedTime = 0;
    state.progress = 0;
    state.measureCount = 0;
    lastBeatTime = 0;
  }

  // 监听 BPM 变化
  watch(
    () => state.bpm,
    () => {
      if (state.isPlaying) {
        // 重新计算当前拍的位置
        const currentTime = performance.now();
        const elapsed = currentTime - lastTimeStamp;
        lastBeatTime = (lastBeatTime + elapsed) % beatDuration.value;
      }
    }
  );

  return {
    ...toRefs(state), // 将 reactive 对象转换为 ref 对象
    formattedTime,
    startClock,
    pauseClock,
    resetClock,
  };
}
