// store/modules/display.js
const state = {
  data: [], // 所有 display 项
  activeDisplayId: null // 当前激活的 display
};

const mutations = {
  addDisplay(state, newDisplay) {
    state.data.push(newDisplay);
    console.log("add!", newDisplay.id);
  },
  deleteDisplay(state, id) {
    state.data = state.data.filter(d => d.id !== id);
  },
  updateDisplayPosition(state, { id, starttime, channel }) {
    const display = state.data.find(d => d.id === id);
    if (display) {
      display.starttime = starttime;
      display.channel = channel;
    }
  },
  updateDisplayDuration(state, { id, duration }) {
    const display = state.data.find(d => d.id === id);
    if (display) {
      display.duration = duration;
    }
  },
  SET_ACTIVE_DISPLAY(state, id) {
    state.activeDisplayId = id;
  }
};

const actions = {
  addDisplay({ commit, rootState }, newDisplay) {
    commit('addDisplay', newDisplay);
    rootState.wasm_song.push_display(
      newDisplay.channel,
      newDisplay.patternId,
      newDisplay.duration,
      newDisplay.starttime
    );
    rootState.wasm_song.sort_display();
  },
  deleteDisplay({ commit, rootState }, id) {
    for (let i = 0; i < rootState.display.data.length; i++) {
      console.log("id = ", rootState.display.data[i].id);
    }
    const display = rootState.display.data.find(d => d.id === id);
    console.log("deleteDisplay id = ", id, display);

    if (display) {
      commit('deleteDisplay', id);
      rootState.wasm_song.delete_display(
        display.channel,
        display.patternId,
        display.starttime
      );
    }
  },
  updateDisplayPosition({ commit, rootState }, payload) {
    const { id, starttime, channel } = payload;
    console.log("updateDisplayPosition id=", id);
    const display = rootState.display.data.find(d => d.id === id);
    
    if (display) {
      // 先删除旧的
      rootState.wasm_song.delete_display(
        display.channel,
        display.patternId,
        display.starttime
      );
      
      // 更新状态
      commit('updateDisplayPosition', payload);
      
      // 添加新的
      rootState.wasm_song.push_display(
        channel,
        display.patternId,
        display.duration,
        starttime
      );
      rootState.wasm_song.sort_display();
    }
  },
  updateDisplayDuration({ commit, rootState }, { id, duration }) {
    const display = rootState.display.data.find(d => d.id === id);
    if (display) {
      commit('updateDisplayDuration', { id, duration });
      rootState.wasm_song.update_display_duration(
        display.channel,
        display.patternId,
        display.starttime,
        duration
      );
    }
  }
};

const getters = {
  activeDisplay: state => state.data.find(d => d.id === state.activeDisplayId),
  displaysForPattern: state => patternId => 
    state.data.filter(d => d.patternId === patternId)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};