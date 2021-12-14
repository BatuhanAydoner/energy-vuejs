import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";
import i18n from "./plugins/i18n";
import "./assets/style/Main.scss";
import jwtDecode from "jwt-decode";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

const token = localStorage.getItem("authenticated");

if (token) {
  const decoded = jwtDecode(token);
  store.dispatch("setAccountDetails", { ...decoded });
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
