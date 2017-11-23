<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="primary">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">Receptacle</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item to="containers">Containers</b-nav-item>
                <b-nav-item to="images">Images</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item @click.stop="addCont($event.target)"><i class="fa fa-plus-circle"></i></b-nav-item>
            </b-navbar-nav>
        </b-collapse>
        </b-navbar>
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
                <b-form-group id="restartGroup" horizontal description="Add a restart policy." label="Restart policy">
                    <b-form-select id="restartInput" :options="restartOptions" v-model="form.restartPolicy"></b-form-select>
                </b-form-group>
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
        </b-modal>
    </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
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
      modalDetails: { header: '' },
      form: {
        name: '',
        image: '',
        ports: '',
        memory: '0',
        restartPolicy: 'no',
        autoRemove: true,
        volumes: {
          hostPath: '',
          contPath: '',
          readOnly: ''
        }
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const Endpoint = 'http://localhost:8443/api/containers/create'
      var data = {
        name: this.form.name,
        image: this.form.image,
        ports: [this.form.ports],
        memory: this.form.memory,
        restartPolicy: this.form.restartPolicy,
        autoRemove: this.form.autoRemove,
        volumes: [this.form.volumes.hostPath.concat(':', this.form.volumes.contPath, this.form.volumes.readOnly)]
      }
      this.$http.post(Endpoint, data).then(response => {
        console.log(response.statusText, data)
      }, response => {
        console.log(response)
      })
    },
    addCont (button) {
      this.$root.$emit('bv::show::modal', 'modal2', button)
    },
    resetModal () {
      this.modalDetails.header = ''
    }
  }
}
</script>