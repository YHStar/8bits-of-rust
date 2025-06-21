// 状态管理
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { SongWrapper, init_panic_hook } from "eight_bits_of_rust";
import route from "./modules/route";
import pattern from "./modules/pattern";
import channel from "./modules/channel";
import synthesiser from "./modules/synthesiser";
import song from "./modules/song";
import playunit from "./modules/playunit";
import display from "./modules/display";
import pianoroll from "./modules/pianorolls";
import exportsongs from "./modules/exportsongs";

export default createStore({
  state: {
    // 当前显示在钢琴窗中的音符
    notes: [],
    // pattern列表
    patterns: [],
    // 歌曲列表
    // songs: [],
    // display列表
    // displays: [],

    // 当前路径
    // currentRoute: "/",
    //被激活的页面
    // activeComposePage: "plugin",
    // 激活中的pattern的id
    // activePattern: 0,

    //mixer状态
    // channels_params: [
    //   { name: "lead", volume: 0.15, pan: 0 },
    //   { name: "pad", volume: 0.15, pan: 0 },
    //   { name: "chord", volume: 0.1, pan: 0 },
    //   { name: "bass", volume: 0.4, pan: 0 },
    //   { name: "noise", volume: 0.2, pan: 0 },
    // ],
    //synthesiser状态
    // synths_params: [
    //   { preset: "square", n_poly: 1, be_modulated: true, attack : 0, decay : 0.1, sustain : 0.5, release : 0.1 },
    //   { preset: "saw", n_poly: 1, be_modulated: true, attack : 0, decay : 0.1, sustain : 0.5, release : 0.1  },
    //   { preset: "spike", n_poly: 1, be_modulated: true, attack : 0, decay : 0.1, sustain : 0.5, release : 0.1  },
    //   { preset: "triangle", n_poly: 1, be_modulated: true, attack : 0, decay : 0.1, sustain : 0.5, release : 0.1 },
    //   { preset: "noise", n_poly: 1, be_modulated: true, attack : 0, decay : 0.1, sustain : 0.5, release : 0.1  },
    // ],
    //piano roll状态
    pianoroll_scrollX: 0, // 横向滚动位置
    pianoroll_scrollY: 0, // 纵向滚动位置
    pianoroll_scaleX: 1.0, // 横向缩放比例（1.0为原始尺寸）
    pianoroll_scaleY: 1.0, // 纵向缩放比例

    //未使用：选中的音符
    selectedNotes: new Set(),
    separatorPosition: 300,

    // exportFormat: "",
    // songName: "",
    estimated_space: 0,

    scrollX: 0,
    scrollY: 0,

    wasm_song: null,
  },
  mutations: {
    // WASM相关

    initWasmInstance(state) {
      // 初始化错误捕捉函数并初始化wasm实例
      init_panic_hook();
      state.wasm_song = SongWrapper.new("TMP");
      console.log("Initializing WASM instance...", state.route.currentRoute);
      console.log("Channel params:", state.channel.params); // Debug channel data
      console.log("Synth params:", state.synthesiser.params); // Debug synth data

      const channelParams = state.channel.params;
      const synthParams = state.synthesiser.params;

      console.log("init wasm song with channels", channelParams.length);
      console.log("synth params length", synthParams[0]); // Ensure matching lengths
      // const synthParams = state.synth.params;
      // const patternState = state.pattern;
      for (var i = 0; i < channelParams.length; ++i) {
        // for (var i = 0; i < 2; ++i) {
        // console.log("channelParams: ", i, channelParams[i].name, channelParams[i].volume, channelParams[i].pan);
        // console.log("synthParams: ", synthParams[i].preset, synthParams[i].n_poly, synthParams[i].be_modulated);
        state.wasm_song.new_channel(
          channelParams[i].name,

          channelParams[i].volume,
          channelParams[i].pan,

          synthParams[i].preset,
          synthParams[i].n_poly,

          synthParams[i].be_modulated,

          synthParams[i].attack,
          synthParams[i].decay,
          synthParams[i].sustain,
          synthParams[i].release,
        );
      }

      // 把正在编辑的pattern保存
      console.log(state.pattern);
      var pattern = state.pattern.data.find((p) => p.id === state.pattern.activeId);
      if (pattern) {
        // console.log("save notes to old pattern", pattern.notes, state.notes)
        pattern.notes = state.notes;
      }
      // state.pattern.data = Array.from(state.patterns)
      //初始化所有pattern
      for (var i = 0; i < state.pattern.data.length; ++i) {
        var pattern = state.pattern.data[i];
        console.log(pattern.name, pattern.id);
        state.wasm_song.new_pattern(pattern.name, pattern.id);
        state.wasm_song.set_active_pattern(pattern.id);
        for (var j = 0; j < pattern.notes.length; ++j) {
          var note = pattern.notes[j];
          state.wasm_song.edit_pattern(
            "insert",
            88 - note.pitch,
            note.starttime,
            note.starttime + note.duration,
          );
        }
      }
      //初始化active pattern
      state.wasm_song.set_active_pattern(state.pattern.activeId);

      // 初始化所有display
      for (var i = 0; i < state.display.data.length; ++i) {
        var display = state.display.data[i]
        state.wasm_song.push_display(
          display.channel,
          display.patternId,
          display.duration,
          display.starttime,
        );
      }
      state.wasm_song.sort_display();
    },
    play(state) {
      // 播放
      state.wasm_song.play();
    },
    // play_single_note(state) {
    //   // 播放单个音符
    //   // console.log("play single note")
    //   //预览单个音符
    // },
    pause(state) {
      // 暂停
      // console.log("pause")
      //wasm暂停函数
    },
    reset(state) {
      // 重置
      // console.log("reset")
      //wasm重置函数
    },



    // state.notes
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
      const pattern = state.pattern.data.find((p) => p.id === state.pattern.activeId);
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
      const pattern = state.pattern.data.find((p) => p.id === state.pattern.activeId);
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

    // 钢琴窗相关状态

    // 设置钢琴窗滚动位置
    setPianoScroll(state, { x, y }) {
      state.pianoroll_scrollX = Math.max(0, x); // 限制最小值
      state.pianoroll_scrollY = Math.max(0, y);
    },

    // 设置缩放比例（带最小限制）
    setScale(state, { scaleX, scaleY }) {
      state.pianoroll_scaleX = Math.max(0.1, scaleX); // 最小缩放10%
      state.pianoroll_scaleY = Math.max(0.1, scaleY);
    },

    // 增量缩放控制（适用于滚轮操作）
    zoomScale(state, { deltaX, deltaY }) {
      const ZOOM_FACTOR = 0.1;
      state.pianoroll_scaleX = Math.max(
        0.1,
        state.pianoroll_scaleX + deltaX * ZOOM_FACTOR,
      );
      state.pianoroll_scaleY = Math.max(
        0.1,
        state.pianoroll_scaleY + deltaY * ZOOM_FACTOR,
      );
    },

    // 未使用的方法
    setSeparatorPosition(state, position) {
      state.separatorPosition = position;
    },
    setScrollPosition(state, { x, y }) {
      state.scrollX = x;
      state.scrollY = y;
    },
    updateSelection(state, { id, selected }) {
      selected ? state.selectedNotes.add(id) : state.selectedNotes.delete(id);
    },
    clearSelection(state) {
      state.selectedNotes.clear();
    },
  },
  modules: {
    route,
    channel,
    pattern,
    synthesiser,
    song,
    playunit,
    display,
    // pianoroll,
    exportsongs,
    
  },
  plugins: [createPersistedState()],
});
