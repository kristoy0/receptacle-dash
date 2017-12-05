<template>
  <div>
      <Navbar/>
      <b-alert :show="dismissCountDown" dismissible :variant="alertVariant" @dismissed="dismissCountdown=0" @dismiss-count-down="countDownChanged">
        {{ alertData }}
      </b-alert>
      <div class="container">
        <h1>
          Containers
          <b-button variant="outline-primary" size="sm" @click.stop="addCont($event.target)">Add new</b-button>
        </h1>
        <b-table striped hover :items="items" :fields="fields">
          <template slot="Actions" slot-scope="row">
            <b-button-group>
              <b-button size="sm" @click.stop="details(row.item, $event.target)">Details</b-button>
              <b-button variant="danger" size="sm" v-if="row.item.State == 'running'" @click="action('stop', row.item.ID)"><i class="fa fa-stop-circle"></i></b-button>
                  <b-button variant="success" size="sm" v-else @click="action('start', row.item.ID)"><i class="fa fa-play-circle"></i></b-button>
                  <b-dropdown size="sm" variant="primary" id="ddown1" text="">
                    <b-dropdown-item v-if="row.item.State == 'paused'" @click="action('unpause', row.item.ID)">Unpause</b-dropdown-item>
                    <b-dropdown-item v-else @click="action('pause', row.item.ID)">Pause</b-dropdown-item>
                    <b-dropdown-item @click="action('delete', row.item.ID)">Delete</b-dropdown-item>
                  </b-dropdown>
            </b-button-group>
          </template>
        </b-table>
      </div>
      <b-modal id="modal1" @hide="resetModal" @ok="handleOk(modalDetails.action, modalDetails.id)">
          <h4 class="my-1 py-1" slot="modal-header">{{ modalDetails.header }}</h4>
          <pre>{{ modalDetails.data }}</pre>
      </b-modal>
      <b-modal id="modal2" @hide="resetModal" ref="contModal" hide-footer>
            <h4 class="my-1 py-1" slot="modal-header">Add a new container</h4>
            <form @submit="onSubmit">
                <b-form-group id="nameGroup" horizontal description="Add a name for your container." label="Container name">
                    <b-form-input id="nameInput" v-model="form.name"></b-form-input>
                </b-form-group>
                <b-form-group id="imageGroup" horizontal description="Pick an image e.g. nginx:latest or nginx:alpine." label="Image name">
                    <b-form-input id="imageInput" v-model="form.image"></b-form-input>
                </b-form-group>
                <b-form-group id="portGroup" horizontal description='Add port mapping e.g. 8080:80.' label="Port mapping">
                    <b-form-input id="portInput" v-model="form.ports"></b-form-input>
                </b-form-group>
                <b-form-group id="memoryGroup" horizontal description="Add a memory limitation to your container e.g. 1G, 512M (0 for unlimited)." label="Memory limit">
                    <b-form-input id="memoryInput" v-model="form.memory"></b-form-input>
                </b-form-group>
                <!-- TODO: Restart on failure policy not working -->
                <b-form-group id="restartGroup" horizontal description="Add a restart policy." label="Restart policy">
                    <b-form-select id="restartInput" :options="restartOptions" v-model="form.restartPolicy"></b-form-select>
                </b-form-group>
                <!-- TODO: Autoremove not working -->
                <!-- <b-form-group id="removeGroup" horizontal description="Automatically remove container when exited." label="Autoremove">
                    <b-form-select id="removeInput" :options="removeOptions" v-model="form.autoRemove"></b-form-select>
                </b-form-group> -->
                <b-form-group id="hostVolumeGroup" horizontal label="Host path">
                    <b-form-input id="hostVolumeInput" v-model="form.volumes.hostPath"></b-form-input>
                </b-form-group>
                <b-form-group id="contVolumeGroup" horizontal label="Container path">
                    <b-form-input id="contVolumeInput" v-model="form.volumes.contPath"></b-form-input>
                </b-form-group>
                <b-form-group id="removeGroup" horizontal description="Add a volumes from your host machine to the container (All pathing must be absolute)." label="Mount options">
                <b-form-select id="removeInput" :options="volumeOptions" v-model="form.volumes.readOnly"></b-form-select>
                </b-form-group>
                <b-button type="submit" variant="primary">Submit</b-button>
                <b-button type="reset" variant="secondary">Reset</b-button>
            </form>
          <p v-if="waiting">Creating container, please wait.</p>
          <div :class="{ loader: waiting }"></div>
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
      dismissSecs: 3,
      dismissCountDown: 0,
      alertData: '',
      alertVariant: '',
      waiting: false,
      /* removeOptions: [
          { value: true, text: 'True' },
          { value: false, text: 'False' }
      ], */
      volumeOptions: [
          { value: '', text: 'Read and write' },
          { value: ':ro', text: 'Read only' }
      ],
      restartOptions: [
          { value: 'no', text: 'Don\'t automatically restart' },
          { value: 'failure', text: 'Restart on failure' },
          { value: 'always', text: 'Always restart' }
      ],
      form: {
        name: '',
        image: '',
        ports: '',
        memory: '0',
        restartPolicy: 'no',
        // AutoRemove: true,
        volumes: {
          hostPath: '',
          contPath: '',
          readOnly: ''
        }
      },
      fields: {
        ID: { label: 'ID', sortable: true, formatter: (id) => { return id.substring(0, 12) } },
        Name: { label: 'Name', sortable: true, formatter: (name) => { return name[0].substring(1) } },
        Image: { label: 'Image', sortable: true },
        Created: { label: 'Created' },
        State: { label: 'State' },
        Actions: { label: 'Actions' }
      }
    }
  },
  created () {
    this.getConts()
  },
  methods: {
    hideModal () {
      this.$root.$emit('bv::hide::modal', 'modal2')
    },
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
      this.modalDetails.data = ''
      this.modalDetails.header = ''
      this.modalDetails.id = ''
      this.form.name = ''
      this.form.image = ''
      this.form.ports = ''
      this.form.memory = 0
      this.form.restartPolicy = 'no'
      this.form.volumes.hostPath = ''
      this.form.volumes.contPath = ''
      this.form.volumes.readOnly = ''
    },
    resetAlert () {
      this.alertData = ''
      this.alertVariant = ''
    },
    handleOk (action, id) {
      if (action !== 'details') {
        this.$http.post(Url + '/containers/' + id + '/' + action).then(response => {
          this.getConts()
          this.alertData = response.data ? response.data : 'Container deleted'
          this.alertVariant = 'success'
          this.showAlert()
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
      setTimeout(this.resetAlert, 3500)
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.waiting = true
      const Endpoint = 'http://localhost:8443/api/containers/create'
      var data = {
        name: this.form.name,
        image: this.form.image,
        memory: this.form.memory,
        restartPolicy: this.form.restartPolicy
        // autoRemove: this.form.autoRemove
      }
      if (this.form.ports) {
        data.ports = [this.form.ports]
      }
      if (this.form.volumes.hostPath && this.form.volumes.contPath) {
        data.volumes = [this.form.volumes.hostPath.concat(':', this.form.volumes.contPath, this.form.volumes.readOnly)]
      }
      this.$http.post(Endpoint, data).then(response => {
        console.log(response.statusText, data)
        this.hideModal()
        this.getConts()
        if (response.statusText !== 'OK') {
          this.alertData = 'Container ' + data.name + ' ' + response.statusText
          this.alertVariant = 'success'
        } else {
          this.alertData = 'Something went wrong'
          this.alertVariant = 'danger'
        }
        this.showAlert()
      }, response => {
        console.log(response)
      })
    },
    addCont (button) {
      this.$root.$emit('bv::show::modal', 'modal2', button)
    }
  }
}
</script>

<style scoped>
  .container {
    padding-top: 32px;
  }
  p {
    margin-top: 20px;
    float: left;  
  }
  h1 {
    margin: auto;
    padding-bottom: 2%
  }
  .loader {
    margin-top: 20px;
    float: right;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #428bca;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
</style>