import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import FactoryDetail from "../views/FactoryDetail.vue";
import Login from "../views/Login/Login.vue";
import Register from "../views/Register/Register.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresUnauth: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresUnauth: true },
  },
  {
    path: "/dashboard",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/factory/:id",
    name: "Factory",
    component: FactoryDetail,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.accountDetail.isAuth) {
    next("/login");
  } else if (to.meta.requiresUnauth && store.getters.accountDetail.isAuth) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
