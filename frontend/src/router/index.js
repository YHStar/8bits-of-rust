// route导航设置
import { createRouter, createWebHistory } from "vue-router"
import Compose from "@/views/Compose.vue"
import Songs from "@/views/Songs.vue"
import Developers from "@/views/Developers.vue"
import StartScreen from "@/views/Start.vue"

const routes = [
  {
    path: "/",
    name: "Start",
    component: StartScreen,
  },
  {
    path: "/compose",
    name: "Compose",
    component: Compose,
  },
  {
    path: "/songs",
    name: "Songs",
    component: Songs,
  },
  {
    path: "/developers",
    name: "Developers",
    component: Developers,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
