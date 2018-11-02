<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="artist in accountArtists" :key="artist['.key']">
            <router-link :to="'/account/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
          </li>
        </ul>
        <span class="nothing-found" v-if="accountArtists.length == 0">Artists not found.</span>
        <router-link to="/account/artist/new">Add Artist</router-link>
      </div>
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
    ...mapState(["userAccount", "accountArtists"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (this.accountId) {
        this.setRef({
          key: "accountArtists",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/artists")
        });
      }
    }
  },
  watch: {
    $route() {
      this.init();
    },
    userAccount() {
      this.init();
    }
  }
};
</script>
