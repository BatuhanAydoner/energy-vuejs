import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuth: false,
    id: null,
    firstname: null,
    lastname: null,
    full_name: null,
    email: null,
    authority: null,
  },
  getters: {
    accountDetail(state) {
      return { ...state };
    },
  },
  mutations: {
    setAccountDetails(state, payload) {
      state.isAuth = true;
      state.id = payload.id;
      state.firstname = payload.firstname;
      state.lastname = payload.lastname;
      state.full_name = payload.full_name;
      state.email = payload.email;
      state.authority = payload.authority;
    },
  },
  actions: {
    setAccountDetails(context, data) {
      context.commit("setAccountDetails", data);
    },
  },
});
