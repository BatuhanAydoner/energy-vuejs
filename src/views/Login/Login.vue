<template>
  <div class="h-screen md:flex">
    <div
      class="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden"
    >
      <div>
        <h1 class="text-white font-bold text-4xl font-sans">Energy</h1>
        <p class="text-white mt-1">For the future.</p>
      </div>
      <div
        class="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"
      ></div>
      <div
        class="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"
      ></div>
      <div
        class="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"
      ></div>
      <div
        class="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"
      ></div>
    </div>
    <div class="flex md:w-1/2 justify-center py-10 items-center bg-white">
      <form class="bg-white">
        <h1 class="text-gray-800 font-bold text-2xl mb-3">
          {{ $t("welcome") }}
        </h1>
        <v-text-field
          label="Email"
          type="email"
          solo
          v-model="email"
        ></v-text-field>
        <v-text-field
          label="Password"
          type="password"
          solo
          v-model="password"
        ></v-text-field>
        <div>
          <v-btn block large @click="login"> Login </v-btn>
        </div>
        <div class="mt-3">
          <router-link
            :to="{ name: 'Register' }"
            class="text-sm ml-2 hover:text-blue-500 cursor-pointer"
            >You don't have an account? Sign up.
          </router-link>
        </div>
      </form>
    </div>
    <v-snackbar v-model="showModal" top right centered>
      {{ errorMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="showModal = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import jwtDecode from "jwt-decode";
import Validation from "../../mixins/Validation";
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      showModal: false,
      errorMessage: null,
    };
  },
  mixins: [Validation],
  methods: {
    login() {
      const fields = [
        { name: "Email", value: this.email ?? "", condition: "email" },
        { name: "Password", value: this.password ?? "", condition: "text" },
      ];

      const validation = this.validation(fields);

      if (validation.error) {
        this.errorMessage = validation.message;
        this.showModal = true;
      } else {
        axios
          .post("http://localhost:3000/api/user/login", {
            email: this.email,
            password: this.password,
          })
          .then((res) => {
            if (res.status === 200) {
              const decoded = jwtDecode(res.data.token);
              this.$store.dispatch("setAccountDetails", { ...decoded });

              this.$router.push({ name: "Home" });
            }
          })
          .catch(() => {
            this.errorMessage = "Email or password is wrong.";
            this.showModal = true;
          });
      }
    },
  },
};
</script>
