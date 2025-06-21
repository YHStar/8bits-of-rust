// store/modules/pattern.js
const state = {
  activeId: 0,
  data: [],
  // 当前显示在钢琴窗中的音符（属于当前活动的 pattern）
  currentNotes: [],
  // 钢琴窗滚动和缩放状态
  scrollX: 0,
  scrollY: 0,
  scaleX: 1.0,
  scaleY: 1.0,
};

const mutations = {
  // 设置活动 pattern
  setActive(state, id) {
    state.activeId = id;
  },

  // 添加 pattern
  add(state, pattern) {
    state.data.push(pattern);
  },

  // 删除 pattern
  delete(state, id) {
    console.log("deletePattern id=", id)
    // 删除 pattern
    state.data = state.data.filter((n) => n.id !== id);

    // 清空当前音符
    if (state.activeId === id) {
      state.currentNotes = [];
    }
  },

  // 重命名 pattern
  rename(state, { id, name }) {
    const pattern = state.data.find((p) => p.id === id);
    if (pattern) {
      pattern.name = name;
    }
  },

  // 排序 pattern
  sort(state, { index, newIndex }) {
    const draggedItem = state.data.splice(index, 1)[0];
    state.data.splice(newIndex, 0, draggedItem);
  },

  // 音符操作
  addNote(state, note) {
    state.currentNotes.push(note);
    this.rootState.wasm_song?.edit_pattern(
      "insert",
      88 - note.pitch,
      note.starttime,
      note.starttime + note.duration
    );
  },

  deleteNote(state, note) {
    state.currentNotes = state.currentNotes.filter((n) => n.id !== note.id);
    this.rootState.wasm_song?.edit_pattern(
      "delete",
      88 - note.pitch,
      note.starttime,
      note.starttime + note.duration
    );
  },

  updateNotePosition(state, { id, starttime, pitch }) {
    const note = state.currentNotes.find((n) => n.id === id);
    if (note) {
      this.rootState.wasm_song?.edit_pattern(
        "delete",
        88 - note.pitch,
        note.starttime,
        note.starttime + note.duration
      );

      this.rootState.wasm_song?.edit_pattern(
        "insert",
        88 - pitch,
        starttime,
        starttime + note.duration
      );

      note.pitch = pitch;
      note.starttime = starttime;
    }
  },

  updateNoteDuration(state, { id, duration }) {
    const note = state.currentNotes.find((n) => n.id === id);
    if (note) {
      this.rootState.wasm_song?.edit_pattern(
        "delete",
        88 - note.pitch,
        note.starttime,
        note.starttime + note.duration
      );

      this.rootState.wasm_song?.edit_pattern(
        "insert",
        88 - note.pitch,
        note.starttime,
        note.starttime + duration
      );

      note.duration = duration;
    }
  },

  // 清空音符
  emptyNotes(state) {
    state.currentNotes = [];
  },

  // 保存当前音符到活动 pattern
  saveCurrentNotesToActivePattern(state) {
    const pattern = state.data.find((p) => p.id === state.activeId);
    if (pattern) {
      pattern.notes = [...state.currentNotes];
      pattern.scrollX = state.scrollX;
      pattern.scrollY = state.scrollY;
      pattern.scaleX = state.scaleX;
      pattern.scaleY = state.scaleY;
    }
  },

  // 从活动 pattern 加载音符
  loadNotesFromActivePattern(state) {
    const pattern = state.data.find((p) => p.id === state.activeId);
    if (pattern) {
      state.currentNotes = [...pattern.notes];
      state.scrollX = pattern.scrollX || 0;
      state.scrollY = pattern.scrollY || 0;
      state.scaleX = pattern.scaleX || 1.0;
      state.scaleY = pattern.scaleY || 1.0;
    }
  },

  // 钢琴窗滚动状态
  setPianoScroll(state, { x, y }) {
    state.scrollX = Math.max(0, x);
    state.scrollY = Math.max(0, y);
  },

  // 设置缩放比例
  setScale(state, { scaleX, scaleY }) {
    state.scaleX = Math.max(0.1, scaleX);
    state.scaleY = Math.max(0.1, scaleY);
  },

  // 增量缩放
  zoomScale(state, { deltaX, deltaY }) {
    const ZOOM_FACTOR = 0.1;
    state.scaleX = Math.max(0.1, state.scaleX + deltaX * ZOOM_FACTOR);
    state.scaleY = Math.max(0.1, state.scaleY + deltaY * ZOOM_FACTOR);
  },
};

const getters = {
  // 获取活动 pattern
  active: (state) =>
    state.data.find((p) => p.id === state.activeId),

  // 获取当前音符
  currentNotes: (state) => state.currentNotes,

  // 获取钢琴窗设置
  pianoRollSettings: (state) => ({
    scrollX: state.scrollX,
    scrollY: state.scrollY,
    scaleX: state.scaleX,
    scaleY: state.scaleY,
  }),

  // 获取所有 pattern
  allPatterns: (state) => state.data,
};

const actions = {
  setActive({ commit, rootState }, id) {
    if (rootState.wasm_song) {
      rootState.wasm_song.set_active_pattern(id);
    }
    commit("setActive", id);
  },
  add: ({ commit, rootState }, pattern) => {
    commit("add", pattern);
    if (rootState.wasm_song) {
      rootState.wasm_song.new_pattern(
        pattern.name,
        pattern.id,
        pattern.scrollX,
        pattern.scrollY,
        pattern.scaleX,
        pattern.scaleY,
      );
    }
  },
  rename({ commit, rootState }, { id, name }) {
    const pattern = rootState.pattern.data.find((p) => p.id === id);
    if (pattern) {
      console.log("renamepattern", name)
      rootState.wasm_song.rename_pattern(id, name);
      commit("rename", {id, name});
    }
  },
  delete({ commit, rootState }, id) {
    const pattern = rootState.pattern.data.find((p) => p.id === id);
    if (pattern) {
      commit("display/deleteByPattern", id, {root:true});
      commit("delete", id);
      rootState.notes = [];
      if(rootState.wasm_song){
        rootState.wasm_song.delete_pattern(id);
        rootState.wasm_song.filter_display_without_pattern_id(id);    
      }
    }   
  },
  sort({ commit, rootState }, { index, newIndex }) {
    commit("sort", {index, newIndex})
    // const draggedItem = state.pattern.data.splice(index, 1)[0]; // 移除被拖拽的元素
    // state.pattern.data.splice(newIndex, 0, draggedItem);
    state.wasm_song.sort_display();
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
  // Actions 可以在需要时添加
};
