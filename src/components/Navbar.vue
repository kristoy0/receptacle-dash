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
        </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
    }
  }
}
</script>