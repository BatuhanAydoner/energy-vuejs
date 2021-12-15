te
<template>
  <div>
    <!-- Appbar -->
    <v-app-bar elevation="4" dense dark class="main-header">
      <!-- Router Link -->
      <router-link to="/dashboard" class="title-link"
        ><v-toolbar-title>Energy</v-toolbar-title></router-link
      >

      <v-spacer></v-spacer>
      <div style="margin-top: 15px; margin-right: 20px">
        <!-- Switch -->
        <v-select
          :items="languages"
          item-text="title"
          item-value="value"
          v-model="selectedLanguage"
          label="Solo field"
          return-object
          solo
        ></v-select>
      </div>
      <div style="margin-right: 10px">
        <div to="/logs" class="logs-link">
          {{ $store.getters.accountDetail.full_name }}
        </div>
      </div>
      <v-btn color="warning" @click="logout">{{ $t("general.logout") }}</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedLanguage: localStorage.getItem("lang")
        ? localStorage.getItem("lang")
        : "en",
      languages: [
        { title: "Türkçe", value: "tr" },
        { title: "English", value: "en" },
      ],
    };
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/login");
    },
  },
  watch: {
    selectedLanguage(val) {
      localStorage.setItem("lang", val.value);
      location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.main-header {
  width: 100% !important;
  align-items: center !important;
}
.title-link {
  text-decoration: none;
  color: white;
}
.logs-link {
  text-decoration: none;
  color: white;
}
</style>
