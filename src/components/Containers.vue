<template>
  <div>
      <Navbar/>
      <div class="container">
      <b-table striped hover show-empty :items="items" :fields="fields">
        <template slot="Actions" slot-scope="row">
          <b-btn size="sm" @click.stop="details(row.item,row.index,$event.target)">Details</b-btn>
        </template>
        </b-table>
        <b-modal id="modal1" @hide="resetModal" ok-only>
          <h4 class="my-1 py-1" slot="modal-header">Index: {{ modalDetails.index }}</h4>
          <pre>{{ modalDetails.data }}</pre>
        </b-modal>
      </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
let axios = require("axios");

const Url = "https://receptacle-worker:8443";
let items
function GetContInfo() {
  axios.get(Url + "/api/containers")
    .then(function(response) {
      items = response.data
    })
    .catch(function(error) {
      console.log(error);
    });
}
const fields = {
  ID: { label: "ID" },
  Name: { label: "Name" },
  Image: { label: "Image" },
  Uptime: { label: "Uptime" },
  State: { label: "State" },
  Actions: { label: "Actions" }
};

export default {
  name: "Containers",
  components: {
    Navbar: Navbar
  },
  data() {
    return {
      items: items,
      fields: fields,
      modalDetails: { index: "", data: "" }
    };
  },
  methods: {
    details(item, index, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2);
      this.modalDetails.index = index;
      this.$root.$emit("bv::show::modal", "modal1", button);
    },
    resetModal() {
      this.modalDetails.data = "";
      this.modalDetails.index = "";
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 32px;
}
</style>