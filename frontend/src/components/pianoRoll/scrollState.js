// 封装滚动状态的核心逻辑
import { onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";

export const useScrollHandler = (containerRef) => {
  const store = useStore();

  // 复合防抖：高频滚动时每200ms强制更新一次，低频时防抖
  const hybridDebounce = (func, limit = 200) => {
    let lastTime = 0;
    let timeout;

    return (...args) => {
      const now = Date.now();
      clearTimeout(timeout);

      if (now - lastTime >= limit) {
        func(...args);
        lastTime = now;
      } else {
        timeout = setTimeout(
          () => {
            func(...args);
            lastTime = Date.now();
          },
          limit - (now - lastTime),
        );
      }
    };
  };

  // 修改调用方式
  const handleScroll = hybridDebounce((e) => {
    store.commit("setPianoScroll", {
      x: e.target.scrollLeft,
      y: e.target.scrollTop,
    });
  }, 200);

  // 初始化滚动位置
  const initScrollPosition = () => {
    if (containerRef.value) {
      containerRef.value.scrollLeft = store.state.pianoroll_scrollX;
      containerRef.value.scrollTop = store.state.pianoroll_scrollY;
    }
  };

  // 生命周期管理
  const setupLifecycle = () => {
    onMounted(() => {
      initScrollPosition();
      containerRef.value?.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      containerRef.value?.removeEventListener("scroll", handleScroll);
    });
  };

  // 状态同步监听
  const setupStateWatcher = () => {
    watch(
      () => [store.state.pianoroll_scrollX, store.state.pianoroll_scrollY],
      ([newX, newY]) => {
        if (containerRef.value) {
          containerRef.value.scrollLeft = newX;
          containerRef.value.scrollTop = newY;
        }
      },
      { deep: true },
    );
  };

  return {
    handleScroll,
    initScrollPosition,
    setupLifecycle,
    setupStateWatcher,
  };
};
