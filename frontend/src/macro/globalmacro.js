export default {
  install(app) {
    app.config.globalProperties.$debounce = (fn, delay = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    };

    //在这里添加全局变量
    app.config.globalProperties.PITCH_RANGE = 88;
    app.config.globalProperties.CHANNEL_RANGE = 5;
    app.config.globalProperties.MAX_SONG_NUM = 10;
  },
};
