<template>
  <div>
      <Navbar/>
      <b-alert :show="dismissCountDown" dismissible variant="success" @dismissed="dismissCountdown=0" @dismiss-count-down="countDownChanged" v-if="modalDetails.action != 'details'">
        <p v-if="modalDetails.action != 'stop'">Container {{ modalDetails.action }}ed.</p>
        <p v-else>Container stopped.</p>
      </b-alert>
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
          <tr v-for="item in items" :key="item.ID" v-bind="items">
            <td>{{ item.ID.substring(0,12) }}</td>
            <td>{{ item.Name[0].substring(1) }}</td>
            <td>{{ item.Image }}</td>
            <td>{{ item.Created }}</td>
            <td>{{ item.State }}</td>
            <td>
              <b-button-group>
                <b-btn size="sm" @click.stop="details(item, $event.target)">Details</b-btn>
                <b-button variant="danger" size="sm" v-if="item.State == 'running'" @click="action('stop',item.ID)"><i class="fa fa-stop-circle"></i></b-button>
                <b-button variant="success" size="sm" v-else @click="action('start', item.ID)"><i class="fa fa-play-circle"></i></b-button>
                <b-dropdown size="sm" variant="primary" id="ddown1" text="">
                  <b-dropdown-item v-if="item.State == 'paused'" @click="action('unpause', item.ID)">Unpause</b-dropdown-item>
                  <b-dropdown-item v-else @click="action('pause', item.ID)">Pause</b-dropdown-item>
                  <b-dropdown-item @click="action('delete', item.ID)">Delete</b-dropdown-item>
                </b-dropdown>
              </b-button-group>
            </td>
          </tr>
        </table>
      </div>
      <b-modal id="modal1" @hide="resetModal" @ok="handleOk(modalDetails.action, modalDetails.id)">
          <h4 class="my-1 py-1" slot="modal-header">{{ modalDetails.header }}</h4>
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
      modalDetails: { header: '', data: '', action: '', id: '' },
      dismissSecs: 2,
      dismissCountDown: 0
    }
  },
  created () {
    this.getConts()
  },
  methods: {
    getConts () {
      this.$http.get(Url + '/containers/').then(response => {
        this.items = response.body
      }, response => {
        console.log(response)
      })
    },
    details (item, button) {
      this.modalDetails.header = 'Id: ' + item.ID.substring(0, 12)
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.modalDetails.action = 'details'
      this.$root.$emit('bv::show::modal', 'modal1', button)
    },
    resetModal () {
      setTimeout(this.showAlert(), 700)
      this.modalDetails.data = ''
      this.modalDetails.header = ''
      this.modalDetails.id = ''
      setTimeout(this.getConts, 500)
    },
    handleOk (action, id) {
      if (action !== 'details') {
        this.$http.post(Url + '/containers/' + id + '/' + action).then(response => {
          console.log(action + ' ' + id)
        }, response => {
          console.log(response)
        })
      }
    },
    action (action, id, button) {
      this.modalDetails.header = 'Confirm ' + action
      this.modalDetails.data = 'Are you sure you want to ' + action + ' container: ' + id.substring(0, 12) + '?'
      this.modalDetails.id = id
      this.modalDetails.action = action
      this.$root.$emit('bv::show::modal', 'modal1', button)
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    }
  }
}
</script>

<style scoped>
.container {
  padding-top: 32px;
}
p {
  margin: auto;
}
</style>