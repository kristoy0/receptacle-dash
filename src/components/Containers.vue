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
          <tr v-for="item in items" :key="item.ID">
            <td>{{ item.ID.substring(0,12) }}</td>
            <td>{{ item.Name[0].substring(1) }}</td>
            <td>{{ item.Image }}</td>
            <td>{{ item.Created }}</td>
            <td>{{ item.State }}</td>
            <td>
              <b-button-group>
                <b-btn size="sm" @click.stop="details(item, $event.target)">Details</b-btn>
                <b-button variant="danger" size="sm" v-if="item.State == 'running'" v-on:click="action('stop',item.ID)"><i class="fa fa-stop-circle"></i></b-button>
                <b-button variant="success" size="sm" v-else v-on:click="action('start', item.ID)"><i class="fa fa-play-circle"></i></b-button>
                <b-dropdown size="sm" variant="primary" id="ddown1" text="">
                  <b-dropdown-item v-if="item.State == 'paused'" v-on:click="action('unpause', item.ID)">Unpause</b-dropdown-item>
                  <b-dropdown-item v-else v-on:click="action('pause', item.ID)">Pause</b-dropdown-item>
                  <b-dropdown-item v-on:click="action('delete', item.ID)">Delete</b-dropdown-item>
                </b-dropdown>
              </b-button-group>
            </td>
          </tr>
        </table>
      </div>
      <b-modal id="modal1" @hide="resetModal" @ok="handleOk(modalDetails.action, modalDetails.id)">
          <h4 class="my-1 py-1" slot="modal-header">Index: {{ modalDetails.header }}</h4>
          <pre>{{ modalDetails.data }}</pre>
      </b-modal>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
const Url = 'http://localhost:8443/api'
export default {
  name: 'Containers',
  components: {
    Navbar: Navbar
  },
  data () {
    return {
      items: [],
      modalDetails: { index: '', data: '' }
    }
  },
  created () {
    this.$http.get(Url + '/containers/').then(response => {
      this.items = response.body
    }, response => {
      console.log(response)
    })
  },
  methods: {
    details (item, button) {
      this.modalDetails.header = item.ID.substring(0, 12)
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modal1', button)
    },
    resetModal () {
      this.modalDetails.data = ''
      this.modalDetails.header = ''
      this.modalDetails.action = ''
      this.modalDetails.id = ''
    },
    handleOk (action, id) {
      this.$http.post(Url + '/containers/' + id + '/' + action + '/').then(response => {
        console.log(action + ' ' + id)
      }, response => {
        console.log(response)
      })
    },
    action (action, id, button) {
      this.modalDetails.header = 'Confirm ' + action
      this.modalDetails.data = 'Are you sure you want to ' + action + ' container: ' + id.substring(0, 12) + '?'
      this.modalDetails.id = id
      this.modalDetails.action = action
      this.$root.$emit('bv::show::modal', 'modal1', button)
    }
  }
}
</script>

<style scoped>
.container {
  padding-top: 32px;
}
</style>