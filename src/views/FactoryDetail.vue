<template>
  <v-container class="home">
    <v-data-table
      :headers="headers"
      :items="details"
      sort-by="calories"
      class="elevation-1"
      no-data-text="There is no any data."
      hide-default-footer
    >
      <template v-slot:item.discount_price="{ item }">
        <span>{{
          item["discount_price"] === true ? "Discount" : "Without discount"
        }}</span>
      </template>

      <template v-slot:item.start_date="{ item }">
        <span>{{ formatDate(item) }}</span>
      </template>

      <template v-slot:item.end_date="{ item }">
        <span>{{ formatDate(item) }}</span>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{
            details.length > 0 ? details[0].factory_name : "-"
          }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Detail
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Detail</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Unit"
                        type="text"
                        solo
                        v-model="addDetail.unit"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                        ref="menu_start"
                        v-model="menu_start"
                        :close-on-content-click="false"
                        :return-value.sync="addDetail.start_date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="addDetail.start_date"
                            label="Start Date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="addDetail.start_date"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu_start = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu_start.save(addDetail.start_date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                        ref="menu_end"
                        v-model="menu_end"
                        :close-on-content-click="false"
                        :return-value.sync="addDetail.end_date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="addDetail.end_date"
                            label="End Date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="addDetail.end_date"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu_end = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu_end.save(addDetail.end_date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Usage (KW)"
                        type="number"
                        min="0"
                        solo
                        persistent-hint
                        v-model="addDetail.usage"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Pricing"
                        type="number"
                        min="0"
                        solo
                        persistent-hint
                        v-model="addDetail.pricing"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="addDetail.discount_price"
                        label="Discount"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this detail?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
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
          text: "Unit",
          align: "start",
          sortable: false,
          value: "unit",
        },
        { text: "Start Date", value: "start_date" },
        { text: "End Date", value: "end_date" },
        { text: "Usage", value: "usage" },
        {
          text: "Pricing",
          value: "pricing",
        },
        {
          text: "Discount Price",
          value: "discount_price",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
      details: [],
      editedIndex: -1,
      addDetail: {
        id: null,
        unit: null,
        start_date: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        usage: 0,
        pricing: 0,
        discount_price: false,
      },
      selectedDetail: null,

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
    this.getDetails();
  },
  methods: {
    getDetails() {
      axios
        .post("http://localhost:3000/api/factory/detail/only", {
          factory_id: 7,
        })
        .then((res) => {
          this.details = [...res.data.data];
        });
    },
    newDetails() {
      axios
        .post("http://localhost:3000/api/factory/detail/add", {
          factory_id: 7,
          unit: this.addDetail.unit,
          start_date: this.addDetail.start_date,
          end_date: this.addDetail.end_date,
          usage: parseInt(this.addDetail.usage),
          pricing: parseFloat(this.addDetail.pricing),
          discount_price: this.addDetail.discount_price,
        })
        .then(() => {
          this.getDetails();
          this.showDialog("Factory detail is added.");
        });
    },
    updateDetail() {
      axios
        .post("http://localhost:3000/api/factory/detail/update", {
          factory_id: 7,
          factory_detail_id: this.addDetail.id,
          unit: this.addDetail.unit,
          start_date: this.formatDate(this.addDetail.start_date),
          end_date: this.formatDate(this.addDetail.end_date),
          usage: parseInt(this.addDetail.usage),
          pricing: parseFloat(this.addDetail.pricing),
          discount_price: this.addDetail.discount_price,
        })
        .then(() => {
          this.getDetails();
          this.showDialog("Factory detail is updated.");
        });
    },
    deleteDetail() {
      axios
        .post("http://localhost:3000/api/factory/detail/delete", {
          factory_detail_id: parseInt(this.selectedDetail.id),
        })
        .then(() => {
          this.getDetails();
          this.showDialog("Factory detail is deleted.");
          this.closeDelete();
        });
    },
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD");
    },
    editItem(item) {
      this.edittedFactory = true;
      this.dialog = true;
      this.addDetail = { ...item };
    },

    deleteItem(detail) {
      this.dialogDelete = true;
      this.selectedDetail = { ...detail };
    },

    deleteItemConfirm() {
      this.deleteDetail();
    },

    showDialog(message) {
      this.showModal = true;
      this.message = message;
    },

    close() {
      this.edittedFactory = false;
      this.dialog = false;
      this.addDetail = {
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
      this.selectedDetail = null;
    },

    save() {
      if (this.edittedFactory) {
        this.updateDetail();
      } else {
        this.newDetails();
      }
      this.close();
      this.edittedFactory = false;
    },
  },
};
</script>
