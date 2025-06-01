export default {
  namespaced: true,
  state: () => ({
    songs: [],
    songName: "",
  }),
  mutations: {
    addSong(state, song) {
      state.songs.push(song);
    },
    deleteSong(state, index) {
      state.songs.splice(index, 1);
    },
    setSongName(state, name) {
      state.songName = name;
    },
  },
};
