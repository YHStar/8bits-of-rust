// store.js
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    notes: [],
    patterns: [],
    songs: [],
    displays: [],

    selectedNotes: new Set(),
    separatorPosition: 300,
    
    activeComposePage: "plugin",
    activePattern: 0,

    exportFormat: '',
    songName: '',
    estimated_space: 0,

    scrollX: 0,
    scrollY: 0,
    channels: [
      { id: 1, name: '音轨 1', patterns: [] },
      { id: 2, name: '音轨 2', patterns: [] },
      { id: 3, name: '音轨 3', patterns: [] },
      { id: 4, name: '音轨 4', patterns: [] },
      { id: 5, name: '音轨 5', patterns: [] }
    ],
    currentRoute: '/'
  },
  mutations: {
    setSeparatorPosition(state, position) {
      state.separatorPosition = position;
    },
    setScrollPosition(state, { x, y }) {
      state.scrollX = x;
      state.scrollY = y;
    },
    
    setCurrentRoute(state, route) {
      state.currentRoute = route;
    },

    addDisplay(state, newDisplay) {
      state.displays.push(newDisplay)
      // console.log("display pattern")
      // for (var i = 0; i < state.displays.length; ++i){
      //   console.log(state.displays[i]);
      // }
    },
    deleteDisplay(state, {id}) {
      const display = state.displays.find(p => (p.id === id));
      if (display) {
        const index = state.displays.findIndex(p => (p.id === id));
        state.displays.splice(index, 1);
      }
    },
    updateDisplayPosition(state, { id, starttime, channel }) {
      const display = state.displays.find(d => d.id === id);
      if (display) {
        display.starttime = starttime;
        display.channel = channel;
      };
    },
    updateDisplayDuration(state, { id, duration }) {
      state.displays = state.displays.map(display => 
        display.id === id ? { ...display, duration } : display
      );
    },

    addNote(state, note) {
      state.notes.push(note)
    },
    deleteNote(state, id) {
      state.notes = state.notes.filter(n => n.id !== id);
    },
    updateNotePosition(state, { id, starttime, pitch  }) {
      const note = state.notes.find(n => n.id === id)
      if (note) {
        note.pitch = pitch
        note.starttime = starttime
      }
    },
    updateNoteDuration(state, { id, duration }) {
      state.notes = state.notes.map(note => 
        note.id === id ? { ...note, duration } : note
      );
    },
    emptyNotes(state){
      state.notes = []
    },
    saveNotes(state){
      const pattern = state.patterns.find(p => p.id === state.activePattern)
      if(pattern){
        console.log("save notes to old pattern", pattern.notes, state.notes)
        pattern.notes = state.notes
      }  
    },
    loadNotes(state){
      const pattern = state.patterns.find(p => p.id === state.activePattern)
      if(pattern){
        state.notes = pattern.notes
        console.log("load notes from new pattern", pattern.notes, state.notes)
      }
      for(var i = 0; i < state.notes.length; ++i){
        console.log(state.notes[i].id)
      }
    },
    


    addPattern:(state, pattern) => {
      state.patterns.push(pattern)
    },
    deletePattern(state, id) {
      state.patterns = state.patterns.filter(n => n.id !== id);
      state.displays = state.displays.filter(n => n.id !== id);
      state.notes = []
    },
    renamePattern(state, {id, name}){
      // console.log("renamepattern", name)
      const pattern = state.patterns.find(p => p.id === id)
      if(pattern) pattern.name = name
    },
    sortPattern(state, {index, newIndex}) {
      const draggedItem = state.patterns.splice(index, 1)[0]; // 移除被拖拽的元素
      state.patterns.splice(newIndex, 0, draggedItem);
    },



    updateSelection(state, { id, selected }) {
      selected ? state.selectedNotes.add(id) : state.selectedNotes.delete(id);
    },
    clearSelection(state) {
      state.selectedNotes.clear();
    },
    setExportFormat(state, format) {
      state.exportFormat = format;
    },


    addSong(state, song) {
      state.songs.push(song);
    },
    deleteSong(state, index) {
        state.songs.splice(index, 1);
    },


    setActiveComposePage(state, page) {
        state.activeComposePage = page;
    },
    setActivePattern(state, id) {
      state.activePattern = id;
    },
    setSongName(state, name) {
        state.songName = name;
    },
  },
  getters: {
    getActivePattern: (state) => 
      state.patterns.find(p => p.id === state.activePattern)
  },
  plugins: [
    createPersistedState()
  ],
});