<template>
  <div>
      <Navbar/>
      <div class="container">
        <table class="table table-striped borderless">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Created</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          <tr v-for="item in items">
            <td>{{ item.ID.substring(0,12) }}</td>
            <td>{{ item.Name[0].substring(1) }}</td>
            <td>{{ item.Image }}</td>
            <td>{{ item.Created }}</td>
            <td>{{ item.State }}</td>
            <td>
              <b-button-group>
                <b-button variant="danger" size="sm" v-if="item.State == 'running'" v-on:click="stop(item.ID)"><i class="fa fa-stop-circle"></i></b-button>
                <b-button variant="success" size="sm" v-else v-on:click="start(item.ID)"><i class="fa fa-play-circle"></i></b-button>
                <b-dropdown size="sm" variant="primary" id="ddown1" text="">
                  <b-dropdown-item v-if="item.State == 'paused'" v-on:click="unpause(item.ID)">Unpause</b-dropdown-item>
                  <b-dropdown-item v-else v-on:click="pause(item.ID)">Pause</b-dropdown-item>
                  <b-dropdown-item v-on:click="remove(item.ID)">Delete</b-dropdown-item>
                </b-dropdown>
              </b-button-group>
            </td>
          </tr>
        </table>
      </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

const Url = "http://localhost:8443/api";

export default {
  name: "Containers",
  components: {
    Navbar: Navbar
  },
  data() {
    return {
      items: []
    };
  },
  created() {
    this.$http.get(Url + "/containers/").then(response => {
      this.items = response.body;
    }),
      response => {
        console.log(response);
      };
  },
  methods: {
    stop(id) {
      this.$http.post(Url + "/containers/" + id + "/stop/").then(response => {
        console.log("Stopped: " + id)
      }, response => {
        console.log(response)
      });
    },
    start(id) {
      this.$http.post(Url + "/containers/" + id + "/start/").then(response => {
        console.log("Started: " + id)
      }, response => {
        console.log(response)
      });
    },
    pause(id) {
      this.$http.post(Url + "/containers/" + id + "/pause/").then(response => {
        console.log("Paused: " + id)
      }, response => {
        console.log(response)
      });
    },
    unpause(id) {
      this.$http.post(Url + "/containers/" + id + "/unpause/").then(response => {
        console.log("Unpaused: " + id)
      }, response => {
        console.log(response)
      });
    },
    remove(id) {
      this.$http.post(Url + "/containers/" + id + "/delete/true").then(response => {
        console.log("Removed: " + id)
      }, response => {
        console.log(response)
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 32px;
}
</style>