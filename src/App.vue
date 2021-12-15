<template>
  <v-app id="app">
    <main-header v-if="$store.getters.accountDetail.isAuth" />
    <router-view />
  </v-app>
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
export default {
  components: {
    MainHeader,
  },
};
</script>

<style lang="scss"></style>
