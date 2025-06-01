//synthesizer状态相关
export default {
  namespaced: true,
  state: () => ({
    active_id: 0,
    params: [
      {
        preset: "square",
        n_poly: 1,
        be_modulated: true,
        attack: 0,
        decay: 0.01,
        sustain: 0.5,
        release: 0.01,
      },
      {
        preset: "saw",
        n_poly: 1,
        be_modulated: true,
        attack: 0,
        decay: 0.01,
        sustain: 0.5,
        release: 0.01,
      },
      {
        preset: "spike",
        n_poly: 1,
        be_modulated: true,
        attack: 0,
        decay: 0.01,
        sustain: 0.5,
        release: 0.01,
      },
      {
        preset: "triangle",
        n_poly: 1,
        be_modulated: true,
        attack: 0,
        decay: 0.01,
        sustain: 0.5,
        release: 0.01,
      },
      {
        preset: "noise",
        n_poly: 1,
        be_modulated: true,
        attack: 0,
        decay: 0.01,
        sustain: 0.5,
        release: 0.01,
      },
    ],
  }),
  mutations: {
    // 设置当前的和合成器ID
    setActiveId(state, value) {
      state.active_id = value;
    },
    // 设置合成器预设
    setPreset(state, value) {
      state.preset = value;
    },
    // 设置合成器ADSR参数
    setAttack(state, value) {
      state.params[state.active_id].attack = value;
    },
    setDecay(state, value) {
      state.params[state.active_id].decay = value;
    },
    setSustain(state, value) {
      state.params[state.active_id].sustain = value;
    },
    setRelease(state, value) {
      state.params[state.active_id].release = value;
    },
  },
  getters: {
    // getN_Channels: (state) => state.params.length,
  },
  actions: {
    // 更新合成器的临时ID
    setActiveId({ commit, rootState }, value) {
      console.log("Action setActiveId: value = ", value);
      commit("setActiveId", value);

      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_active_synth_id(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新attack
    setAttack({ commit, rootState }, value) {
      console.log("Action setAttack :value = ", value);
      commit("setAttack", value);
      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_attack(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新decay
    setDecay({ commit, rootState }, value) {
      console.log("Action setDecay : value = ", value);
      commit("setDecay", value);
      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_decay(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新sustain
    setSustain({ commit, rootState }, value) {
      console.log("Action setSustain : value = ", value);
      commit("setSustain", value);

      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_sustain(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新release
    setRelease({ commit, rootState }, value) {
      console.log("Action setRelease : value = ", value);
      commit("setRelease", value);

      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_release(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    setPreset({ commit, rootState }, value) {
      console.log("Action setPreset : value = ", value);
      commit("setPreset", value);

      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_preset(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 初始化通道的 WASM 引用
    // initChannels({ state, rootState }) {
    //   if (!rootState.wasm_song) {
    //     console.warn(
    //       "WASM song instance not available for channel initialization"
    //     );
    //     return;
    //   }

    //   // 为每个通道设置初始值
    //   state.params.forEach((synth, index) => {
    //     rootState.wasm_song.set_channel_volume(index, channel\.volume);
    //     rootState.wasm_song.set_channel_pan(index, channel.pan);
    //   });
    // },
  },
};
