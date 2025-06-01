export default {
  namespaced: true,
  state: () => ({
    scrollX: 0,
    scrollY: 0,
    scaleX: 1.0,
    scaleY: 1.0,
  }),
  mutations: {
    setPianoScroll(state, { x, y }) {
      state.scrollX = Math.max(0, x);
      state.scrollY = Math.max(0, y);
    },
    setScale(state, { scaleX, scaleY }) {
      state.scaleX = Math.max(0.1, scaleX);
      state.scaleY = Math.max(0.1, scaleY);
    },
    zoomScale(state, { deltaX, deltaY }) {
      const ZOOM_FACTOR = 0.1;
      state.scaleX = Math.max(0.1, state.scaleX + deltaX * ZOOM_FACTOR);
      state.scaleY = Math.max(0.1, state.scaleY + deltaY * ZOOM_FACTOR);
    },
  },
};
