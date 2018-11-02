<template>
  <main>
    <div v-if="userAccount && accountArtist" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <h1>{{ accountArtist.fullName }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <router-link :to="'/account/artist/' + artistId + '/edit'" class="button">Update</router-link>
      <button @click="removeArtist">Remove</button>
      <button v-if=" ! accountArtist.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountArtist.published"><a @click="togglePublished(false)">Un publish</a></button>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { log } from "../../helper";
import { store } from "../../firebase-app";

export default {
  created() {
    this.init();
  },
  computed: {
    ...mapState(["userAccount", "accountArtist"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    },
    artistId() {
      return this.$route.params.id;
    },
    image() {
      return this.accountArtist && this.accountArtist.image
        ? this.accountArtist.image
        : {
            displayUrl: null,
            storageUri: null
          };
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (this.accountId) {
        this.setRef({
          key: "accountArtist",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/artists/" + this.artistId)
        });
      }
    },
    togglePublished(published) {
      if (!this.accountId) {
        return;
      }
      store(this.accountId, this.artistId, "artists", {
        published: published
      }).catch(log);
    },
    removeArtist() {
      if (!this.accountId) {
        return;
      }
      this.$firebase
        .database()
        .ref("accounts/" + this.accountId + "/artists/" + this.artistId)
        .remove()
        .then(
          function() {
            this.$router.push("/account/artists");
          }.bind(this)
        )
        .catch(log);
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
