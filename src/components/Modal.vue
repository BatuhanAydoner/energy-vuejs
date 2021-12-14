<template>
    <v-snackbar
      :v-model="show"
        top
        right
        centered
        :timeout="3000"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="success"
          text
          v-bind="attrs"
          @click="hideModal"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
export default {
    props: ["show", "message"],
    methods: {
        hideModal() {
            this.$emit("update:show", false);
        }
    },
}
</script>