export default {
  namespaced: true,
  state: () => ({
    patterns: [],
    activePattern: 0,
    notes: [],
  }),
  mutations: {
    // state.patterns
    setActivePattern(state, id) {
      state.activePattern = id;
      state.wasm_song.set_active_pattern(id);
    },
    addPattern: (state, pattern) => {
      state.patterns.push(pattern);
      state.wasm_song.new_pattern(
        pattern.name,
        pattern.id,
        pattern.scrollX,
        pattern.scrollY,
        pattern.scaleX,
        pattern.scaleY,
      );
    },
    deletePattern(state, id) {
      state.patterns = state.patterns.filter((n) => n.id !== id);
      state.displays = state.displays.filter((n) => n.patternId !== id); // 删除pattern也会删除对应的所有display
      state.notes = [];
      state.wasm_song.delete_pattern(id);
      state.wasm_song.filter_display_without_pattern_id(id);
    },
    renamePattern(state, { id, name }) {
      // console.log("renamepattern", name)
      const pattern = state.patterns.find((p) => p.id === id);
      if (pattern) pattern.name = name;
      state.wasm_song.rename_pattern(id, name);
    },
    sortPattern(state, { index, newIndex }) {
      const draggedItem = state.patterns.splice(index, 1)[0]; // 移除被拖拽的元素
      state.patterns.splice(newIndex, 0, draggedItem);
      state.wasm_song.sort_display();
    },

    addNote(state, note) {
      state.wasm_song.edit_pattern(
        "insert",
        88 - note.pitch,
        note.starttime,
        note.starttime + note.duration,
      );
      state.notes.push(note);
    },
    deleteNote(state, note) {
      state.wasm_song.edit_pattern(
        "delete",
        88 - note.pitch,
        note.starttime,
        note.starttime + note.duration,
      );
      state.notes = state.notes.filter((n) => n.id !== note.id);
    },
    updateNotePosition(state, { id, starttime, pitch }) {
      const note = state.notes.find((n) => n.id === id);
      if (note) {
        state.wasm_song.edit_pattern(
          "delete",
          88 - note.pitch,
          note.starttime,
          note.starttime + note.duration,
        );
        state.wasm_song.edit_pattern(
          "insert",
          88 - pitch,
          starttime,
          starttime + note.duration,
        );
        note.pitch = pitch;
        note.starttime = starttime;
      }
      //wasm播放这个音符
      // state.wasm_song.play_single_note(note.pitch, note.starttime, note.duration)
    },
    // 更新音符持续时间：
    // 直接删除旧的音符，插入更新后的音符
    updateNoteDuration(state, { id, duration }) {
      const note = state.notes.find((n) => n.id === id);
      if (note) {
        // if (duration < note.duration) {
        //   state.wasm_song.edit_pattern("delete", 88 - note.pitch, note.starttime, note.starttime + note.duration)
        // }
        // else if (duration > note.duration) {
        //   state.wasm_song.edit_pattern("insert", 88 - note.pitch, note.starttime, note.starttime + note.duration)
        // }
        // note.duration = duration
        state.wasm_song.edit_pattern(
          "delete",
          88 - note.pitch,
          note.starttime,
          note.starttime + note.duration,
        );
        state.wasm_song.edit_pattern(
          "insert",
          88 - note.pitch,
          note.starttime,
          note.starttime + duration,
        );

        note.duration = duration;
      }
    },
    emptyNotes(state) {
      state.notes = [];
    },
    // 切换选中的pattern时,将note复制回旧pattern,从新pattern中复制note
    saveNotes(state) {
      const pattern = state.patterns.find((p) => p.id === state.activePattern);
      if (pattern) {
        // console.log("save notes to old pattern", pattern.notes, state.notes)
        pattern.notes = state.notes;
        pattern.scrollX = state.pianoroll_scrollX;
        pattern.scrollY = state.pianoroll_scrollY;
        pattern.scaleX = state.pianoroll_scaleX;
        pattern.scaleY = state.pianoroll_scaleY;
      }
    },
    loadNotes(state) {
      const pattern = state.patterns.find((p) => p.id === state.activePattern);
      if (pattern) {
        state.notes = pattern.notes;
        // console.log("load notes from new pattern", pattern.notes, state.notes)
      }
      state.pianoroll_scrollX = pattern.scrollX;
      state.pianoroll_scrollY = pattern.scrollY;
      state.pianoroll_scaleX = pattern.scaleX;
      state.pianoroll_scaleY = pattern.scaleY;
      // for (var i = 0; i < state.notes.length; ++i) {
      // console.log(state.notes[i].id)
      // }
    },
  },
  getters: {
    getActivePattern: (state) =>
      state.patterns.find((p) => p.id === state.activePattern),
  },
};
