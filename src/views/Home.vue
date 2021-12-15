<template>
  <v-container class="home">
    <v-data-table
      :headers="headers"
      :items="factories"
      sort-by="calories"
      class="elevation-1"
      :no-data-text="$t('factories.table.noData')"
      hide-default-footer
    >
      <template v-slot:item.special="{ item }">
        <span>{{ item ? "Special" : "Normal" }}</span>
      </template>

      <template v-slot:item.start_date="{ item }">
        <span>{{ formatDate(item) }}</span>
      </template>

      <template v-slot:item.end_date="{ item }">
        <span>{{ formatDate(item) }}</span>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t("dashboard.factories") }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                {{ $t("dashboard.newFactory") }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ $t("dashboard.factory") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        :label="$t('dashboard.editDialog.factory_name')"
                        type="text"
                        solo
                        v-model="addFactory.factory_name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                        ref="menu_start"
                        v-model="menu_start"
                        :close-on-content-click="false"
                        :return-value.sync="addFactory.start_date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="addFactory.start_date"
                            :label="$t('dashboard.editDialog.start_date')"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="addFactory.start_date"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu_start = false"
                          >
                            {{ $t("dashboard.editDialog.cancelButtonTitle") }}
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.menu_start.save(addFactory.start_date)
                            "
                          >
                            {{ $t("dashboard.editDialog.calendarConfirm") }}
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                        ref="menu_end"
                        v-model="menu_end"
                        :close-on-content-click="false"
                        :return-value.sync="addFactory.end_date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="addFactory.end_date"
                            :label="$t('dashboard.editDialog.end_date')"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="addFactory.end_date"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu_end = false">
                            {{ $t("dashboard.editDialog.cancelButtonTitle") }}
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu_end.save(addFactory.end_date)"
                          >
                            {{ $t("dashboard.editDialog.calendarConfirm") }}
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        :label="$t('dashboard.editDialog.count_employee')"
                        type="number"
                        min="0"
                        solo
                        :hint="$t('dashboard.editDialog.count_employee')"
                        persistent-hint
                        v-model="addFactory.count_employee"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="addFactory.special"
                        :label="$t('dashboard.editDialog.special')"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  {{ $t("dashboard.editDialog.cancelButtonTitle") }}
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  {{ $t("dashboard.editDialog.confirmButtonTitle") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">{{
                $t("dashboard.deleteDialog.title")
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">{{
                  $t("dashboard.deleteDialog.cancelButtonTitle")
                }}</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{
                  $t("dashboard.deleteDialog.confirmButtonTitle")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          medium
          class="mr-2"
          @click="$router.push({ name: 'Factory', params: { id: item.id } })"
        >
          mdi-play
        </v-icon>
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-snackbar v-model="showModal" top right centered timeout="5000">
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="showModal = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Home",
  data() {
    return {
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu_start: false,
      menu_end: false,
      edittedFactory: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: this.$t("dashboard.table.name"),
          align: "start",
          sortable: false,
          value: "factory_name",
        },
        { text: this.$t("dashboard.table.start_date"), value: "start_date" },
        { text: this.$t("dashboard.table.end_date"), value: "end_date" },
        {
          text: this.$t("dashboard.table.count_employee"),
          value: "count_employee",
        },
        {
          text: this.$t("dashboard.table.special"),
          value: "special",
        },
        {
          text: this.$t("dashboard.table.actions"),
          value: "actions",
          sortable: false,
        },
      ],
      factories: [],
      editedIndex: -1,
      addFactory: {
        factory_name: null,
        start_date: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        count_employee: 0,
        special: true,
      },
      selectedFactory: null,

      showModal: false,
      message: "",
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getFactories();
  },
  methods: {
    getFactories() {
      axios
        .post("energy-nodejs.vercel.app/api/factory/all", {
          user_id: this.$store.getters.accountDetail.id,
        })
        .then((res) => {
          this.factories = [...res.data.data];
        });
    },
    newFactory() {
      axios
        .post("energy-nodejs.vercel.app/api/factory/create-factory", {
          user_id: this.$store.getters.accountDetail.id,
          factory_name: this.addFactory.factory_name,
          start_date: this.addFactory.start_date,
          end_date: this.addFactory.end_date,
          count_employee: this.addFactory.count_employee,
          special: this.addFactory.special,
        })
        .then(() => {
          this.getFactories();
          this.showDialog(this.$t("dashboard.addFactory"));
        });
    },
    updateFactory() {
      axios
        .post("energy-nodejs.vercel.app/api/factory/update-factory", {
          user_id: "61b87ecfeaf51a649d590579",
          factory_id: this.addFactory.id,
          factory_name: this.addFactory.factory_name,
          start_date: this.formatDate(this.addFactory.start_date),
          end_date: this.formatDate(this.addFactory.end_date),
          count_employee: this.addFactory.count_employee,
          special: this.addFactory.special,
        })
        .then(() => {
          this.getFactories();
          this.showDialog(this.$t("dashboard.updateFactory"));
        });
    },
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD");
    },
    editItem(item) {
      this.edittedFactory = true;
      this.dialog = true;
      this.addFactory = { ...item };
    },

    deleteItem(factory) {
      this.dialogDelete = true;
      this.selectedFactory = { ...factory };
    },

    deleteItemConfirm() {
      axios
        .post("energy-nodejs.vercel.app/api/factory/delete-factory", {
          factory_id: parseInt(this.selectedFactory.id),
        })
        .then(() => {
          this.getFactories();
          this.showDialog(this.$t("dashboard.deleteFactory"));
          this.dialogDelete = false;
        });
    },

    showDialog(message) {
      this.showModal = true;
      this.message = message;
    },

    close() {
      this.edittedFactory = false;
      this.dialog = false;
      this.addFactory = {
        factory_name: null,
        start_date: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        count_employee: 0,
        special: true,
      };
    },

    closeDelete() {
      this.dialogDelete = false;
      this.selectedFactory = null;
    },

    save() {
      if (this.edittedFactory) {
        this.updateFactory();
      } else {
        this.newFactory();
      }
      this.close();
      this.edittedFactory = false;
    },
  },
};
</script>
