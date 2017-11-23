<template>
  <div>
      <Navbar/>
      <div class="container">
        <table class="table table-striped borderless">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Size</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
          <tr v-for="item in items" :key="item.ID">
            <td>{{ item.ID.substring(7, 19) }}</td>
            <td>{{ item.Name[0] }}</td>
            <td>{{ item.Size }}</td>
            <td>{{ item.Created }}</td>
            <td>
              <b-button-group>
                <b-btn size="sm" @click.stop="details(item, $event.target)">Details</b-btn>
                <b-button variant="danger" size="sm" v-on:click="remove(item.ID)"><i class="fa fa-minus-circle"></i></b-button>
              </b-button-group>
            </td>
          </tr>
        </table>
      </div>
      <b-modal id="modal1" @hide="resetModal" @ok="handleOk(modalDetails.id)">
          <h4 class="my-1 py-1" slot="modal-header">{{ modalDetails.header }}</h4>
          <pre>{{ modalDetails.data }}</pre>
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
      modalDetails: { header: '', data: '', id: '' }
    }
  },
  created () {
    this.$http.get(Url + '/images/').then(response => {
      this.items = response.body.filter(item => {
        return item.Name[0] !== '<none>:<none>'
      })
    }, response => {
      console.log(response)
    })
  },
  methods: {
    details (item, button) {
      this.modalDetails.header = 'Id: ' + item.ID.substring(0, 12)
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modal1', button)
    },
    resetModal () {
      this.modalDetails.data = ''
      this.modalDetails.header = ''
      this.modalDetails.id = ''
    },
    handleOk (id) {
      this.$http.post(Url + '/images/' + id).then(response => {
        console.log(id + ' deleted')
      }, response => {
        console.log(response)
      })
    },
    remove (id, button) {
      this.modalDetails.header = 'Confirm delete'
      this.modalDetails.data = 'Are you sure you want to delete image: ' + id.substring(7, 19) + '?'
      this.modalDetails.id = id
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