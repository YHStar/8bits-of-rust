export default {
    namespaced: true,
    state: () => ({
      format: "",
      estimated_space: 0
    }),
    mutations: {
      setFormat(state, format) {
        state.format = format;
      }
    }
  }