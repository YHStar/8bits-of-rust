export default {
  namespaced: true,
  state: () => ({
    format: "",
    bitWidth: "16bit", // 添加缺失的属性
    songName: "", // 添加缺失的属性
    estimated_space: 0,
  }),
  mutations: {
    setFormat(state, value) {
      state.format = value;
    },
    // 添加其他必要的mutations
    setBitWidth(state, value) {
      state.bitWidth = value;
    },
    setSongName(state, value) {
      state.songName = value;
    },
  },
  actions: {
    // 添加必要的actions
    setFormat({ commit, rootState }, value) {
      console.log("Action setFormat value = ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.set_format(value);
      }
      commit("setFormat", value);
    },
    setBitWidth({ commit, rootState }, value) {
      console.log("Action setBitWidth value = ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.set_format(value);
      }
      commit("setBitWidth", value);
    },
    setSongName({ commit, rootState }, value) {
      console.log("Action setSongName value = ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.set_format(value);
      }
      commit("setSongName", value);
    },
  },
};
