import Vue from "vue";
import Router from "vue-router";
import Entrance from "@/components/Entrance.vue";
import WhiteBoard from "@/components/WhiteBoard.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      component: Entrance
    },
    {
      path: "/room/:roomId",
      component: WhiteBoard
    }
  ]
});