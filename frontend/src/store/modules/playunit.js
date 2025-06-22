export default {
  namespaced: true,
  state: () => ({
    bpm: "",
    timestamp: 0, //当前歌曲播放的到时间戳
    play_song_or_pattern: 0, // 初始化为song
  }),
  mutations: {
    setBpm(state, value) {
      state.bpm = value;
    },
    setPlaySongOrPattern(state, value) {
      state.play_song_or_pattern = value
    }
  },
  actions: {
    // 添加必要的actions
    setBpm({ commit, rootState }, value) {
      console.log("Action set bpm: ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.set_bpm(value);
      }
      commit("setBpm", value);
    },
    setPlaySongOrPattern({ commit, rootState }, value) {
      console.log("Action set play song or pattern: ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.setPlaySongOrPattern(value);
      }
      commit("setPlaySongOrPattern", value);
    },
  },
};
