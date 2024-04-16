import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase/compat/app";
import firebaseConfig from "./config/firebase.config";

firebase.initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app.mount("#app");
