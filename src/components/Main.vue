<template>
  <div>
    <Navbar/>
    <div class="container">
      <h1>Welcome to Receptacle!</h1>
      <h5>Here are some host statistics</h5>
      <pre>{{ hostStats }}</pre>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
const Url = 'http://localhost:8443/api'

export default {
  name: 'Main',
  components: {
    Navbar: Navbar
  },
  data () {
    return {
      hostStats: ''
    }
  },
  created () {
    this.$http.get(Url).then(response => {
      this.hostStats = response.body
    }, response => {
      console.log(response)
    })
  }
}
</script>

<style scoped>
.container {
  padding-top: 32px;
}
h5 {
  padding-top: 32px;
}
</style>