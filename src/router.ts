import { createRouter, createWebHashHistory } from "vue-router";
import Entrance from "./components/Entrance.vue";
import Board from "./components/Board.vue";

const routes = [
  {
    path: "/",
    component: Entrance,
  },
  {
    path: "/board/:boardId",
    component: Board,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
