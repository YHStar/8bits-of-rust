export default {
  namespaced: true,
  state: () => ({
    currentRoute: "/", // 当前路径
    activeComposePage: "plugin", // 被激活的页面
  }),
  mutations: {
    setCurrentRoute(state, route) {
      state.currentRoute = route;
    },
    setActiveComposePage(state, page) {
      state.activeComposePage = page;
    },
  },
};
