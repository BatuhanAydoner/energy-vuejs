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
          {{ $t("general.welcome") }}
        </h1>
        <v-text-field
          :label="$t('general.firstname')"
          type="text"
          solo
          v-model="firstname"
        ></v-text-field>
        <v-text-field
          :label="$t('general.lastname')"
          type="text"
          solo
          v-model="lastname"
        ></v-text-field>
        <v-text-field
          :label="$t('general.email')"
          type="email"
          solo
          v-model="email"
        ></v-text-field>
        <v-text-field
          :label="$t('general.passwword')"
          type="password"
          :hint="$t('register.passwordHint')"
          persistent-hint
          solo
          v-model="password"
        ></v-text-field>
        <v-select
          :items="authorities"
          item-text="text"
          item-value="value"
          v-model="authority"
          label="Solo field"
          solo
        ></v-select>
        <div>
          <v-btn block large @click="register">
            {{ $t("register.buttonTitle") }}
          </v-btn>
        </div>
        <div class="mt-3">
          <router-link
            to="/login"
            class="text-sm ml-2 hover:text-blue-500 cursor-pointer"
            >{{ $t("register.existsAccount") }}
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
import Validation from "../../mixins/Validation";
export default {
  name: "Register",
  mixins: [Validation],
  data() {
    return {
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      authority: 1,
      authorities: [
        {
          text: "Admin",
          value: 1,
        },
        {
          text: "Editor",
          value: 2,
        },
      ],
      showModal: false,
      errorMessage: null,
    };
  },
  methods: {
    register() {
      const fields = [
        { name: "Firstname", value: this.firstname ?? "", condition: "text" },
        { name: "Lastname", value: this.lastname ?? "", condition: "text" },
        { name: "Email", value: this.email ?? "", condition: "email" },
        { name: "Password", value: this.password ?? "", condition: "password" },
      ];

      const validation = this.validation(fields);

      if (validation.error) {
        this.errorMessage = validation.message;
        this.showModal = true;
      } else {
        axios
          .post("http://localhost:3000/api/user/register", {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            authority: this.authority ? 1 : 2,
          })
          .then((res) => {
            if (res.status === 200) {
              this.errorMessage = "Register is successful.";
              this.showModal = true;
            }
            setTimeout(() => {
              this.$router.push({ name: "Login" });
            }, 1500);
          })
          .catch((res) => {
            if (res.response.data.message === "User already exists.") {
              this.errorMessage = "User already exists.";
              this.showModal = true;
            } else {
              this.errorMessage = "Register is unsuccessful.";
              this.showModal = true;
            }
          });
      }
    },
  },
};
</script>
