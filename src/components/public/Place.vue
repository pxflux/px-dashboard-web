<template>
  <main>
    <div v-if="place" class="wrap-content text-block">
      <h1>{{ place.title }}</h1>
      <template v-if="shows.length">
        <h2>Shows</h2>
        <ul v-for="show in shows" :key="show['__key']">
          <li>
            <router-link :to="'/show/' + place['.key']">{{ show.title }}</router-link>
          </li>
        </ul>
      </template>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  created() {
    this.init();
  },
  computed: {
    ...mapState(["place"]),

    placeId() {
      return this.$route.params.id;
    },
    shows() {
      return Object.keys(this.place.shows || {}).map(id => {
        return { ...this.place.shows[id], ...{ ".key": id } };
      });
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      this.setRef({
        key: "place",
        ref: this.$firebase.database().ref("places/" + this.placeId)
      });
    }
  },
  watch: {
    $route() {
      this.init();
    }
  }
};
</script>
