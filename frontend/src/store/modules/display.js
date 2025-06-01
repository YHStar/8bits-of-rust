export default {
  namespaced: true,
  state: () => ({
    displays: [],
  }),
  mutations: {
    addDisplay(state, newDisplay) {
      state.displays.push(newDisplay);
    },
    deleteDisplay(state, { id }) {
      state.displays = state.displays.filter((d) => d.id !== id);
    },
    updateDisplayPosition(state, { id, starttime, channel }) {
      const display = state.displays.find((d) => d.id === id);
      if (display) {
        display.starttime = starttime;
        display.channel = channel;
      }
    },
    updateDisplayDuration(state, { id, duration }) {
      const display = state.displays.find((d) => d.id === id);
      if (display) display.duration = duration;
    },
  },
};
