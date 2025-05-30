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
    // 更新当前的和合成器ID
    updateRelease(state, { value }) {
      state.active_id = value;
    },
    // 更新合成器ADSR参数
    updateAttack(state, { value }) {
      state.params[state.active_id].attack = value;
    },
    updateDecay(state, { value }) {
      state.params[state.active_id].dscay = value;
    },
    updateSustain(state, { value }) {
      state.params[state.active_id].sustain = value;
    },
    updateRelease(state, { value }) {
      state.params[state.active_id].release = value;
    },
  },
  getters: {
    // getN_Channels: (state) => state.params.length,
  },
  actions: {
    // 更新合成器的临时ID
    updateActiveId({ commit, rootState }, { value }) {
      console.log("Action updateActiveId: value = ", value);
      commit("updateActiveId", { value });

      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_activeid(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新attack
    updateAttack({ commit, rootState }, { value }) {
      console.log("Action updateAttack :value = ", value);
      commit("updateAttack", { value });
      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_attack(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新decay
    updateDecay({ commit, rootState }, { value }) {
      console.log("Action updateDecay : value = ", value);
      commit("updateDecay", { value });
      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_decay(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新sustain
    updateSustain({ commit, rootState }, { value }) {
      console.log("Action updateSustain : value = ", value);
      commit("updateSustain", { value });

      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_sustain(value);
      } else {
        console.warn("WASM song instance not available");
      }
    },
    // 在WASM中更新release
    updateRelease({ commit, rootState }, { value }) {
      console.log("Action updateRelease : value = ", value);
      commit("updateRelease", { value });

      // 访问根状态中的 wasm_song
      if (rootState.wasm_song) {
        rootState.wasm_song.set_synth_release(value);
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
