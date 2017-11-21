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
          <h4 class="my-1 py-1" slot="modal-header">Index: {{ modalDetails.ID }}</h4>
          <pre>{{ modalDetails.data }}</pre>
        </b-modal>
      </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

const Url = "https://receptacle-worker:8443";

const fields = {
  ID: { label: "ID", sortable: true, formatter: (value) => { return value.substring(0,12)} },
  Name: { label: "Name", sortable: true, formatter: (value) => { return value.toString().substring(1) } },
  Image: { label: "Image", sortable: true },
  Created: { label: "Created" },
  State: { label: "State", sortable: true },
  Actions: { label: "Actions" }
};

export default {
  name: "Containers",
  components: {
    Navbar: Navbar
  },
  data() {
    return {
      items: [],
      fields: fields,
      modalDetails: { ID: "", data: "" }
    };
  },
  created() {
    this.$http.get(Url + '/api/containers').then(response => {
      this.items = response.body;
    }), response => {
      console.log(response)
    }
  },
  methods: {
    details(item, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2);
      this.modalDetails.ID = item.ID.substring(0,12)
      this.$root.$emit("bv::show::modal", "modal1", button);
    },
    resetModal() {
      this.modalDetails.data = "";
      this.modalDetails.ID = "";
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 32px;
}
</style>