// store/modules/display.js
const state = {
  data: [], // 所有 display 项
  activeDisplayId: null // 当前激活的 display
};

const mutations = {
  add(state, newDisplay) {
    state.data.push(newDisplay);
    console.log("add!", newDisplay.id);
  },
  delete(state, id) {
    state.data = state.data.filter(d => d.id !== id);
  },
  deleteByPattern(state, id) {
    state.data = state.data.filter(d => d.patternId !== id); // 删除pattern也会删除对应的所有display
  },
  updatePosition(state, { id, starttime, channel }) {
    const display = state.data.find(d => d.id === id);
    if (display) {
      display.starttime = starttime;
      display.channel = channel;
    }
  },
  updateDuration(state, { id, duration }) {
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
  add({ commit, rootState }, newDisplay) {
    commit('add', newDisplay);
    rootState.wasm_song.push_display(
      newDisplay.channel,
      newDisplay.patternId,
      newDisplay.duration,
      newDisplay.starttime
    );
    rootState.wasm_song.sort_display();
  },
  delete({ commit, rootState }, id) {
    // for (let i = 0; i < rootState.display.data.length; i++) {
    //   console.log("id = ", rootState.display.data[i].id);
    // }
    const display = rootState.display.data.find(d => d.id === id);
    console.log("deleteDisplay id = ", id, display);

    if (display) {
      commit('delete', id);
      rootState.wasm_song.delete_display(
        display.channel,
        display.patternId,
        display.starttime
      );
    }
  },
  updatePosition({ commit, rootState }, payload) {
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
      commit('updatePosition', payload);
      
      // 添加新的
      rootState.wasm_song.push_display(
        channel,
        display.patternId,
        display.duration,
        starttime
      );
      rootState.wasm_song.sort_display();
      rootState.wasm_song.reload_and_play();
    }
  },
  updateDuration({ commit, rootState }, { id, duration }) {
    const display = rootState.display.data.find(d => d.id === id);
    console.log("updateDisplayDuration id=", id);
    if (display) {
      commit('updateDuration', { id, duration });
      rootState.wasm_song.update_display_duration(
        display.channel,
        display.patternId,
        display.starttime,
        duration
      );
      rootState.wasm_song.reload_and_play();
    }
  }
};

const getters = {
  active: state => state.data.find(d => d.id === state.activeDisplayId),
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
