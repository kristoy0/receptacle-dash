<template>
  <div>
    <Navbar/>
    <div class="container">
      <h1>Welcome to Receptacle!</h1>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'Main',
  components: {
    Navbar: Navbar
  },
  data () {
    return {
    }
  }
}
</script>