export default {
    namespaced: true,
    state: () => ({
      bpm: "",
      timestamp: 0, //当前歌曲播放的到时间戳
    }),
    mutations: {
      setBpm(state, value) {
        state.bpm = value;
      },
    },
    actions: {
      // 添加必要的actions
      setBpm({ commit, rootState }, value) {
        console.log("Action set bpm value = ", value);
        if (rootState.wasm_song) {
          // rootState.wasm_song.set_bpm, value);
        }
        commit("setBpm", value);
      },
    },
  };
  