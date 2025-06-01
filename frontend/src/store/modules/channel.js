//channels状态相关
export default {
  namespaced: true,
  state: () => ({
    test: "1",
    params: [
      { name: "lead", volume: 0.15, pan: 0 },
      { name: "pad", volume: 0.15, pan: 0 },
      { name: "chord", volume: 0.1, pan: 0 },
      { name: "bass", volume: 0.4, pan: 0 },
      { name: "noise", volume: 0.2, pan: 0 },
    ],
  }),
  mutations: {
    // 更新通道音量
    setVolume(state, { index, value }) {
      state.params[index].volume = value;
      // state.wasm_song.set_channel_volume(index, value);
    },
    //更新通道声相
    setPan(state, { index, value }) {
      state.params[index].pan = value;
      // state.wasm_song.set_channel_pan(index, value);
    },
    // // 设置音量初值（读取歌曲文件的时候会用）
    // setVolumes(state, newVolumes) {
    //   state.volumes = [...newVolumes]
    // },
    // 设置音轨初值（读取歌曲文件的时候会用）
    setChannelParams(state, newChannelParams) {
      state.params = [...newChannelParams];
    },
    // 设置轨道数量（应该不会使用）
    setNChannels(state, value) {
      state.n_channels = value;
    },
  },
  getters: {
    getN_Channels: (state) => state.params.length,
  },
  actions: {
    // 更新通道音量（包含 WASM 操作）
    setVolume({ commit, rootState }, { index, value }) {
      console.log("Action setVolume index = ", index, " value = ", value);
      // 访问根状态中的 wasm_song
      commit("setVolume", { index, value });
      if (rootState.wasm_song) {
        rootState.wasm_song.set_channel_volume(index, value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 更新通道声相（包含 WASM 操作）
    setPan({ commit, rootState }, { index, value }) {
      console.log("Action setPan index = ", index, " value = ", value);
      commit("setPan", { index, value });
      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_channel_pan(index, value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 初始化通道的 WASM 引用
    initChannels({ state, rootState }) {
      if (!rootState.wasm_song) {
        console.warn(
          "WASM song instance not available for channel initialization",
        );
        return;
      }

      // 为每个通道设置初始值
      state.params.forEach((channel, index) => {
        rootState.wasm_song.set_channel_volume(index, channel.volume);
        rootState.wasm_song.set_channel_pan(index, channel.pan);
      });
    },
  },
};
