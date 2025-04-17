// 状态管理
import { createStore } from "vuex"
import createPersistedState from "vuex-persistedstate"
// import { songWrapper, patternWrapper, init, init_panic_hook } from "eight_bits_of_rust"

export default createStore({
  state: {
    // 当前显示在钢琴窗中的音符
    notes: [], 
    // pattern列表
    patterns: [],
    // 歌曲列表
    songs: [],
    // display列表
    displays: [],

    selectedNotes: new Set(),
    separatorPosition: 300,

    currentRoute: "/",
    activeComposePage: "plugin",
    // 激活中的pattern的id
    activePattern: 0,

    exportFormat: "",
    songName: "",
    estimated_space: 0,

    scrollX: 0,
    scrollY: 0,

    rust_songs: [],
    current_song: null,
    current_pattern: null,
  },
  mutations: {
    // WASM相关
    // initWasmInstance(state) {
    //   init_panic_hook()
    //   state.current_song = songWrapper.new("tmp")
    //   state.current_pattern = patternWrapper.new(0, "SB")
    // },

    // 页面状态相关
    setCurrentRoute(state, route) {
      state.currentRoute = route
    },
    setActiveComposePage(state, page) {
      state.activeComposePage = page
    },
    setActivePattern(state, id) {
      state.activePattern = id
    },

    // state.displays
    addDisplay(state, newDisplay) {
      state.displays.push(newDisplay)
      // console.log("display pattern")
      // for (var i = 0; i < state.displays.length; ++i){
      //   console.log(state.displays[i]);
      // }
    },
    deleteDisplay(state, { id }) {
      const display = state.displays.find((p) => p.id === id)
      if (display) {
        const index = state.displays.findIndex((p) => p.id === id)
        state.displays.splice(index, 1)
      }
    },
    updateDisplayPosition(state, { id, starttime, channel }) {
      const display = state.displays.find((d) => d.id === id)
      if (display) {
        display.starttime = starttime
        display.channel = channel
      }
    },
    updateDisplayDuration(state, { id, duration }) {
      state.displays = state.displays.map((display) =>
        display.id === id ? { ...display, duration } : display,
      )
    },

    // state.notes
    addNote(state, note) {
      // state.current_pattern.insert_note(note.pitch, note.starttime, note.starttime + note.duration.value)
      state.notes.push(note)
    },
    deleteNote(state, id) {
      console.log("deleted note i")
      // const note_to_delete = state.notes.find((n) => n.id == id)
      // state.current_pattern.delete_note(note_to_delete.pitch, note_to_delete.starttime, note_to_delete.starttime + note_to_delete.duration)
      state.notes = state.notes.filter((n) => n.id !== id)
    },
    updateNotePosition(state, { id, starttime, pitch }) {
      const note = state.notes.find((n) => n.id === id)
      if (note) {
        // state.current_pattern.delete_note(note.pitch, note.starttime, note.starttime + note.duration.value)
        // state.current_pattern.insert_note(pitch, starttime, starttime + note.duration.value)
        note.pitch = pitch
        note.starttime = starttime
      }
    },
    updateNoteDuration(state, { id, duration }) {
      const note = state.notes.find((n) => n.id === id)
      if (note) {
        //state.current_pattern.delete_note(note.pitch, note.starttime, note.starttime + note.duration.value)
        //state.current_pattern.insert_note(note.pitch, note.starttime, note.starttime + duration.value)
      }
      state.notes = state.notes.map((note) =>
        note.id === id ? { ...note, duration } : note, // 必须深拷贝
      )
    },
    emptyNotes(state) {
      state.notes = []
      // state.current_pattern.clear()
    },
    // 切换选中的pattern时,将note复制回旧pattern,从新pattern中复制note
    saveNotes(state) {
      const pattern = state.patterns.find((p) => p.id === state.activePattern)
      if (pattern) {
        console.log("save notes to old pattern", pattern.notes, state.notes)
        pattern.notes = state.notes
      }
    },
    loadNotes(state) {
      const pattern = state.patterns.find((p) => p.id === state.activePattern)
      if (pattern) {
        state.notes = pattern.notes
        console.log("load notes from new pattern", pattern.notes, state.notes)
      }
      for (var i = 0; i < state.notes.length; ++i) {
        console.log(state.notes[i].id)
      }
    },

    // state.patterns
    addPattern: (state, pattern) => {
      state.patterns.push(pattern)
    },
    deletePattern(state, id) {
      state.patterns = state.patterns.filter((n) => n.id !== id)
      state.displays = state.displays.filter((n) => n.id !== id)
      state.notes = []
    },
    renamePattern(state, { id, name }) {
      // console.log("renamepattern", name)
      const pattern = state.patterns.find((p) => p.id === id)
      if (pattern) pattern.name = name
    },
    sortPattern(state, { index, newIndex }) {
      const draggedItem = state.patterns.splice(index, 1)[0] // 移除被拖拽的元素
      state.patterns.splice(newIndex, 0, draggedItem)
    },


    // state.songs
    addSong(state, song) {
      state.songs.push(song)
      // state.rust_songs.push(songWrapper.new(song))
    },
    deleteSong(state, index) {
      state.songs.splice(index, 1)
      // state.rust_songs.splice(index, 1)
    },
    setSongName(state, name) {
      state.songName = name
    },
    // 未使用的方法
    setSeparatorPosition(state, position) {
      state.separatorPosition = position
    },
    setScrollPosition(state, { x, y }) {
      state.scrollX = x
      state.scrollY = y
    },
    updateSelection(state, { id, selected }) {
      selected ? state.selectedNotes.add(id) : state.selectedNotes.delete(id)
    },
    clearSelection(state) {
      state.selectedNotes.clear()
    },
    setExportFormat(state, format) {
      state.exportFormat = format
    },    
  },
  getters: {
    getActivePattern: (state) =>
      state.patterns.find((p) => p.id === state.activePattern),
  },
  plugins: [createPersistedState()],
})
