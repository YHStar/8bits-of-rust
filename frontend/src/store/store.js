// 状态管理
import { createStore } from "vuex"
import createPersistedState from "vuex-persistedstate"
import { songWrapper, init, init_panic_hook } from "eight_bits_of_rust"

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


    //当前路径
    currentRoute: "/",
    //被激活的页面
    activeComposePage: "plugin",
    // 激活中的pattern的id
    activePattern: 0,

    
    //mixer状态
    n_channels: 5,
    volumes: [80, 80, 80, 80, 80],
    panValues: [0, 0, 0, 0, 0],
    
    
    //未使用：选中的音符
    selectedNotes: new Set(),
    separatorPosition: 300,

    exportFormat: "",
    songName: "",
    estimated_space: 0,

    scrollX: 0,
    scrollY: 0,

    wasm_song: null,
  },
  mutations: {
    // WASM相关
    initWasmInstance(state) {
      // 初始化错误捕捉函数并初始化wasm实例
      init_panic_hook()
      state.wasm_song = songWrapper.new("TMP")
      // 先创建5个channel
      state.wasm_song.new_channel("1", "square", 0.2, 1, 0, true)
      state.wasm_song.new_channel("2", "saw", 0.2, 1, 0, true)
      state.wasm_song.new_channel("3", "spike", 0.2, 1, 0, true)
      state.wasm_song.new_channel("4", "triangle", 0.2, 1, 0, true)
      state.wasm_song.new_channel("5", "square", 0.2, 1, 0, true)
    },
    play(state) {
      state.wasm_song.play()
    },
    
    // 页面状态相关
    setCurrentRoute(state, route) {
      state.currentRoute = route
    },
    setActiveComposePage(state, page) {
      state.activeComposePage = page
    },
    setActivePattern(state, id) {
      state.activePattern = id
      state.wasm_song.set_active_pattern(id)
    },

    // state.displays
    addDisplay(state, newDisplay) {
      state.displays.push(newDisplay)
      state.wasm_song.push_display(newDisplay.channel, newDisplay.patternId, newDisplay.duration, newDisplay.starttime)
      state.wasm_song.sort_display()
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
        state.wasm_song.delete_display(display.channel, display.patternId, display.starttime)
      }
    },
    updateDisplayPosition(state, { id, starttime, channel }) {
      const display = state.displays.find((d) => d.id === id)
      if (display) {
        // 对wasm，直接先删除再插入
        state.wasm_song.delete_display(display.channel, display.patternId, display.starttime)
        state.wasm_song.push_display(channel, display.patternId, display.duration, starttime)
        state.wasm_song.sort_display()

        display.starttime = starttime
        display.channel = channel
      }
    },
    updateDisplayDuration(state, { id, duration }) {
      const display = state.displays.find((d) => d.id === id)
      if (display) {
        display.duration = duration
        // 对wasm，直接先删除再插入
        state.wasm_song.update_display_duration(display.channel, display.patternId, display.starttime, duration)
      }
    },

    // state.notes
    addNote(state, note) {
      state.wasm_song.edit_pattern("insert", 88 - note.pitch, note.starttime, note.starttime + note.duration)
      state.notes.push(note)
    },
    deleteNote(state, note) {
      state.wasm_song.edit_pattern("delete", 88 - note.pitch, note.starttime, note.starttime + note.duration)
      state.notes = state.notes.filter((n) => n.id !== note.id)
    },
    updateNotePosition(state, { id, starttime, pitch }) {
      const note = state.notes.find((n) => n.id === id)
      if (note) {
        state.wasm_song.edit_pattern("delete", 88 - note.pitch, note.starttime, note.starttime + note.duration)
        state.wasm_song.edit_pattern("insert", 88 - pitch, starttime, starttime + note.duration)
        note.pitch = pitch
        note.starttime = starttime
      }
    },
    // 更新音符持续时间：
    // 直接删除旧的音符，插入更新后的音符
    updateNoteDuration(state, { id, duration }) {
      const note = state.notes.find((n) => n.id === id)
      if (note) {

        // if (duration < note.duration) {
        //   state.wasm_song.edit_pattern("delete", 88 - note.pitch, note.starttime, note.starttime + note.duration)
        // }
        // else if (duration > note.duration) {
        //   state.wasm_song.edit_pattern("insert", 88 - note.pitch, note.starttime, note.starttime + note.duration)
        // }
        // note.duration = duration
        state.wasm_song.edit_pattern("delete", 88 - note.pitch, note.starttime, note.starttime + note.duration)
        state.wasm_song.edit_pattern("insert", 88 - note.pitch, note.starttime, note.starttime + duration)

        note.duration = duration
      }
    },
    emptyNotes(state) {
      state.notes = []
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
      state.wasm_song.new_pattern(pattern.name, pattern.id)
    },
    deletePattern(state, id) {
      state.patterns = state.patterns.filter((n) => n.id !== id)
      state.displays = state.displays.filter((n) => n.id !== id)
      state.notes = []
      state.wasm_song.delete_pattern(id)
      state.wasm_song.filter_display_without_pattern_id(id)
    },
    renamePattern(state, { id, name }) {
      // console.log("renamepattern", name)
      const pattern = state.patterns.find((p) => p.id === id)
      if (pattern) pattern.name = name
      state.wasm_song.rename_pattern(id, name)
    },
    sortPattern(state, { index, newIndex }) {
      const draggedItem = state.patterns.splice(index, 1)[0] // 移除被拖拽的元素
      state.patterns.splice(newIndex, 0, draggedItem)
      state.wasm_song.sort_display()
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


    //mixer状态相关
    //更新通道音量
    updateVolume(state, { index, value }) {
      console.log("updateVolume index = ", index, " value = ", value)
      state.volumes = state.volumes.map((v, i) => i === index ? value : v)
      // TODO: add wasm function here
    },
    //更新通道声相
    updatePanValue(state, { index, value }) {
      console.log("updatePan index = ", index, " value = ", value)
      state.panValues = state.panValues.map((v, i) => i === index ? value : v)
      // TODO: add wasm function here
    },
    // 设置轨道数量（应该不会使用）
    setNChannels(state, value) {
      state.n_channels = value
    },
    // 设置音量初值（读取歌曲文件的时候会用）
    setVolumes(state, newVolumes) {
      state.volumes = [...newVolumes] // 保证响应式更新[3](@ref)
    },
    // 设置声相初值（读取歌曲文件的时候会用）
    setPanValues(state, newPanValues) {
      state.panValues = [...newPanValues]
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
  // plugins: [createPersistedState()],
})
