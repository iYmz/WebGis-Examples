<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/Ol-demo-OSM">ol-demo-OSM</RouterLink>
        <RouterLink to="/Ol-demo-gemo-shapes">ol-demo-gemo-shapes</RouterLink>
        <RouterLink to="/Ol-demo-map-debug">ol-demo-map-debug</RouterLink>
        <RouterLink to="/Ol-demo-map-resolution">ol-demo-map-resolution</RouterLink>
        <RouterLink to="/Ol-demo-mark-div">ol-demo-mark-div</RouterLink>
        <RouterLink to="/Ol-demo-mark-feature-style">ol-demo-mark-feature-style</RouterLink>
        <RouterLink to="/Ol-demo-7-wms-connection">ol-demo-7-wms-connection</RouterLink>
        <RouterLink to="/Ol-demo-8-wfs-connection">ol-demo-8-wfs-connection</RouterLink>
        <RouterLink to="/Ol-demo-9-wfs-modify">ol-demo-9-wfs-modify</RouterLink>
        <RouterLink to="/Ol-demo-10-wfs-modify">ol-demo-10-wfs-modify-abandon</RouterLink>
        <RouterLink to="/Ol-demo-11-wfs-add">ol-demo-11-wfs-add</RouterLink> 
        <RouterLink to="/Ol-demo-12-wfs-modify">ol-demo-12-wfs-wfs-modifies</RouterLink>
        <!-- <RouterLink to="/Ol-demo-13-wfs-draw-shapes">ol-demo-13-wfs-draw-shapes</RouterLink> -->
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
