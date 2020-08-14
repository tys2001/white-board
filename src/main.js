import Vue from "vue";
import App from "@/App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "@/router.js";
import firebase from "firebase";
import firebaseConfig from "@/firebase.config.js";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
