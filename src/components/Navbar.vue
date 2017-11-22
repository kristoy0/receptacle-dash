<template>
    <b-navbar toggleable="md" type="dark" variant="primary">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Receptacle</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
            <b-nav-item href="#">Containers</b-nav-item>
            <b-nav-item href="#">Images</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right>
            <template slot="button-content">User</template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Signout</b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
    </b-collapse>
    </b-navbar>
</template>

<script>
export default {
  name: "Navbar"
};
</script>