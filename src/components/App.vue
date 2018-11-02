<template>
  <div id="app" class="light">
    <site-header/>
    <router-view/>
  </div>
</template>

<script>
import SiteHeader from "@/components/Header";

export default {
  components: { SiteHeader }
};
</script>

<style lang="sass">
  @import '../assets/sass/app'
</style>
