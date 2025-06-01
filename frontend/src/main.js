import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "@/router";
import App from "./App.vue";
import store from "@/store/store";

import "@/assets/theme.css";
import Common from "@/components/common";
import GlobalMacro from "@/macro/globalmacro.js";
const app = createApp(App);
app
  .use(ElementPlus)
  .use(router)
  .use(GlobalMacro)
  .use(store)
  .use(Common)
  .mount("#app");
