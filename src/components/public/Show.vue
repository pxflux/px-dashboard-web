<template>
  <main>
    <div v-if="show" class="wrap-content text-block">
      <h1>{{ show.title }}</h1>
      <template v-if="places.length">
        <h2>Places</h2>
        <ul v-for="place in places" :key="place['__key']">
          <li>
            <router-link :to="'/place/' + place['.key']">{{ place.title }}</router-link>
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
    ...mapState(["show"]),

    showId() {
      return this.$route.params.id;
    },
    places() {
      return Object.keys(this.show.places || {}).map(id => {
        return { ...this.show.places[id], ...{ ".key": id } };
      });
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      this.setRef({
        key: "show",
        ref: this.$firebase.database().ref("shows/" + this.showId)
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
