<template>
  <div>
      <Navbar/>
      <b-alert :show="dismissCountDown" dismissible variant="success" @dismissed="dismissCountdown=0" @dismiss-count-down="countDownChanged">
        {{ alertData }}
      </b-alert>
      <div class="container">
        <h1>
            Images
            <b-button variant="outline-primary" size="sm" @click.stop="addImg($event.target)">Add new</b-button>
        </h1>
        <b-table striped hover :items="items" :fields="fields">
          <template slot="Actions" slot-scope="row">
            <b-button-group>
              <b-button size="sm" @click.stop="details(row.item, $event.target)">Details</b-button>
              <b-button variant="danger" size="sm" @click="remove(row.item.ID)"><i class="fa fa-minus-circle"></i></b-button>
            </b-button-group>
          </template>
        </b-table>
      </div>
      <b-modal id="modal1" @hide="resetModal" @ok="handleOk(modalDetails.id)">
          <h4 class="my-1 py-1" slot="modal-header">{{ modalDetails.header }}</h4>
          <pre>{{ modalDetails.data }}</pre>
      </b-modal>
      <b-modal id="modal2" @hide="resetModal" ref="imgModal" hide-footer>
            <h4 class="my-1 py-1" slot="modal-header">Pull a new image</h4>
            <form @submit="onSubmit">
              <b-form-group id="imageGroup" horizontal description="Pick an image e.g. nginx or mysql." label="Image name">
                <b-form-input id="imageInput" v-model="form.image"></b-form-input>
              </b-form-group>
              <b-form-group id="tagGroup" horizontal description="Pick an image tag e.g. latest or alpine (for nginx)." label="Image tag">
                <b-form-input id="tagInput" v-model="form.tags"></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="secondary">Reset</b-button>
            </form>
            <div :class="{ loader: waiting }"></div>
        </b-modal>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
const Url = 'http://localhost:8443/api'
export default {
  name: 'Images',
  components: {
    Navbar: Navbar
  },
  data () {
    return {
      items: [],
      alertData: '',
      modalDetails: { header: '', data: '', id: '', action: '' },
      dismissSecs: 3,
      dismissCountDown: 0,
      waiting: false,
      form: {
        image: '',
        tags: ''
      },
      fields: {
        ID: { label: 'ID', sortable: true, formatter: (id) => { return id.substring(7, 19) } },
        Name: { label: 'Name', sortable: true },
        Size: { label: 'Image' },
        Created: { label: 'Created' },
        Actions: { label: 'Actions' }
      }
    }
  },
  created () {
    this.getImgs()
  },
  methods: {
    hideModal () {
      this.$root.$emit('bv::hide::modal', 'modal2')
    },
    getImgs () {
      this.$http.get(Url + '/images/').then(response => {
        this.items = response.body.filter(item => {
          return item.Name[0] !== '<none>:<none>'
        })
      }, response => {
        console.log(response)
      })
    },
    details (item, button) {
      this.modalDetails.header = 'Id: ' + item.ID.substring(0, 12)
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modal1', button)
    },
    resetModal () {
      this.modalDetails.data = ''
      this.modalDetails.header = ''
      this.modalDetails.id = ''
      this.modalDetails.action = ''
      this.form.image = ''
      this.form.tags = ''
      this.waiting = false
    },
    resetAlert () {
      this.alertData = ''
    },
    handleOk (id) {
      this.$http.post(Url + '/images/' + id).then(response => {
        this.getImgs()
        this.alertData = 'Image ' + id.substring(7, 19) + ' deleted'
        this.showAlert()
      }, response => {
        console.log(response)
      })
    },
    remove (id, button) {
      this.modalDetails.header = 'Confirm delete'
      this.modalDetails.data = 'Are you sure you want to delete image: ' + id.substring(7, 19) + '?'
      this.modalDetails.id = id
      this.modalDetails.action = 'delete'
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
      const Endpoint = 'http://localhost:8443/api/images/pull'
      var data = {
        image: this.form.image,
        tags: this.form.tags
      }
      this.$http.post(Endpoint, data).then(response => {
        console.log(response.statusText, data)
        this.hideModal()
        this.getImgs()
        this.alertData = response.statusText + ' ' + data.image + ':' + data.tags
        this.showAlert()
      }, response => {
        console.log(response)
      })
    },
    addImg (button) {
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
    margin: auto;
  }
  h1 {
    margin: auto;
    padding-bottom: 2%
  }
  .loader {
    margin: 0 auto;
    margin-top: 10px;
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